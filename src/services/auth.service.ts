import {compare, hash } from "bcrypt"
import {redis} from "bun"
import { prisma } from "../utils/db";
import { signJWT, signRefreshToken } from "../utils/token";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { email } from "zod";
const OTP_TTL = 60 * 1000 * 2


const createTokenAndPersist = async (email : string, id : string) => {
    const jwt = signJWT({email : email, id : id})
    const refreshToken = signRefreshToken({email : email, id : id})


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
        const payload = {email : data.email, password: data.password, otp}
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

        await prisma.refreshToken.updateMany({
            data : {
                revoked : true
            },
            where : {
                userId : user.id
            }
        })

        const {jwt, refreshToken} = await createTokenAndPersist(user.email, user.id)
        return {
            id: user.id,
            email: user.email,
            level: user.level,
            rating: user.rating,
            jwt,
            refreshToken,
        }
    },

    refreshToken : async (receivedToken : string) => {

    }

}

export default authService