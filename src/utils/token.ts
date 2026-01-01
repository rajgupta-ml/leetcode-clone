import { sign, verify, type SignOptions } from "jsonwebtoken"
import type { UserRole } from "../generated/prisma/enums"

const signJWT = (payload : {email : string, id : string, role : UserRole}, expiresIn= "15m") => {
    return sign(payload, process.env.JWT_SECRET!, {expiresIn : expiresIn} as SignOptions)
}
const signRefreshToken = (payload : {email : string, id : string, role : UserRole}, expiresIn = "7d") => {
    return sign(payload, process.env.JWT_SECRET!, {expiresIn : expiresIn} as SignOptions)
}
const verifyJWT = (receivedJwt : string) => {
    return verify(receivedJwt, process.env.JWT_SECRET!)
}

export { signJWT, signRefreshToken, verifyJWT}