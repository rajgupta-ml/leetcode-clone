import z, { email } from "zod"



export const sendOtpSchema = z.object({
    email : z.email(),
    password : z.string().min(6)
})


export const verifyOtpSchema = z.object({
    email : z.email(),
    otp : z.string().length(6)
})

export const refreshTokenSchema = z.object({
    token : z.string()
})


