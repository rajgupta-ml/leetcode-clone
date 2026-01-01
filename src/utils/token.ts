import { sign, verify, type SignOptions } from "jsonwebtoken"

const signJWT = (payload : {email : string, id : string}, expiresIn= "15m") => {
    return sign(payload, process.env.JWT_SECRET!, {expiresIn : expiresIn} as SignOptions)
}
const signRefreshToken = (payload : {email : string, id : string}, expiresIn = "7d") => {
    return sign(payload, process.env.JWT_SECRET!, {expiresIn : expiresIn} as SignOptions)
}
const verifyJWT = (receivedJwt : string) => {
    return verify(receivedJwt, process.env.JWT_SECRET!)
}

export { signJWT, signRefreshToken, verifyJWT}