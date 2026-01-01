import {compare, hash} from "bcrypt"
import {redis} from "bun"
import { prisma } from "../utils/db";
import { signJWT, signRefreshToken, verifyJWT } from "../utils/token";

import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/enums";
const OTP_TTL = 60 * 2


const createTokenAndPersist = async (email : string, id : string, role : UserRole) => {
    const jwt = signJWT({email : email, id : id, role})
    const refreshToken = signRefreshToken({email : email, id : id, role})


   await prisma.refreshToken.create({
        data : {
            token : refreshToken,
            revoked : false,
            userId : id,
        }
    })
    return {jwt, refreshToken}

}

const authService = {
    sendOtp : async (data : {email : string, password : string}) => {

        const otp = Math.floor(100000 + Math.random() * 900000);
        const payload = {email : data.email, password: hash(data.password, 12), otp}
        redis.set(data.email, JSON.stringify(payload), "EX", OTP_TTL)
        return otp
    },

    verifyOtp : async (data : {email : string, otp : string}) => {
        const redisData = await redis.get(data.email)
        
        if(!redisData) {
            throw new Error("Invalid or Expired OTP")
        } 
        const payload : {email : string, password: string, otp : string} = JSON.parse(redisData)


        if(data.otp !== payload.otp) {
            throw new Error("Invalid OTP")
        }
        redis.del(data.email)

        const existingUser = await prisma.user.findUnique({where : {email : data.email}});

        let user; 
        if(!existingUser) {
            user = await prisma.user.create({data : {
                email : payload.email,
                password : payload.password
            }})
        }else{
            const passwordMatch = await compare(payload.password, existingUser.password)

            if(!passwordMatch){
                throw new Error("Invalid Credantials")
            }
            user = existingUser
        }


        const {jwt, refreshToken} = await createTokenAndPersist(user.email, user.id, user.role)
        return {
            id: user.id,
            email: user.email,
            level: user.level,
            rating: user.rating,
            jwt,
            refreshToken,
        }
    },

    refreshToken : async (receivedRefreshToken : string) => {
        const payload = verifyJWT(receivedRefreshToken) as JwtPayload

        if(!payload  || !payload.id) {
            throw new Error("Invalid refresh token")
        }


        const storedToken = await prisma.refreshToken.findFirst({
            where : {
                token : receivedRefreshToken,
                revoked : false,
                userId  : payload.id
            }
        })

        if(!storedToken) {
            throw new Error("Refresh Token revoked not found")
        }

        await prisma.refreshToken.update({
            where : {id : storedToken.id},
            data : {revoked : true}
        })

        const { jwt, refreshToken } = await createTokenAndPersist(
            payload.email,
            payload.id,
            payload.role
          )

          return {jwt , refreshToken}

    },

    logout : async (receivedRefreshToken : string) => {
        const payload = verifyJWT(receivedRefreshToken) as JwtPayload
        if(!payload || !payload.id) {
            throw new Error("Invalid Token")
        }

        const storedToken = await prisma.refreshToken.findFirst({
            where : {
                revoked : false,
                token : receivedRefreshToken,
                userId : payload.id
            }
        })

        if(!storedToken) {
            throw new Error("The user is not signedIn")
        }
        
        await prisma.refreshToken.update({
            where : {
                id : storedToken.id,
            },
            data : {
                revoked : true
            }
        })

    }

}

export default authService