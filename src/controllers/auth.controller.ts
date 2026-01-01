import type { Request, Response } from "express";
import { refreshTokenSchema, sendOtpSchema, verifyOtpSchema } from "../zodSchemas/auth.Zschema";
import {redis} from "bun"
import authService from "../services/auth.service";
const authController = {

     
    sendOtp: async (req  : Request, res : Response) => {
        const {success, data} = sendOtpSchema.safeParse(req.body)
        if(!success) {
            res.status(400).json({
                sucess : false,
                error : "Invalid Request data"
            })
            return 
        }

        try {
            const otp = await authService.sendOtp(data)
            console.log(`The OTP is: ${otp}`)
            res.status(200).json({
                success : true,
                data : {}
            })
            
        } catch (error) {
            res.status(400).json({
                success : false,
                error : (error as Error).message
            })
        }
        
    },

    verifyOtp : async (req : Request, res : Response) => {
        const {success, data } = verifyOtpSchema.safeParse(req.body)
        if(!success) {
            res.status(400).json({
                sucess : false,
                error : "Invalid Request data"
            })
            return
        }


        try {
            const response = await authService.verifyOtp(data)

            res.status(201).json({
                success : true,
                data : response
            })
        } catch (error) {
            res.status(400).json({
                success : false,
                error : (error as Error).message
            })
        }


    },
    refreshToken : async (req : Request, res : Response) => {
        const {success, data} = refreshTokenSchema.safeParse(req.body)
        if(!success) {
            res.status(400).json({
                sucess : false,
                error : "Invalid Request data"
            })
            return 
        }

        try {
            const payload = await authService.refreshToken(data.token)
            res.status(200).json({
                success : true,
                data : payload
            })
        } catch (error) {
            // This should be a different class so that 500 error can be diffrentated
            if(error instanceof Error){
                res.status(500).json({
                    success : false,
                    error : error.message
                })
            }
        }
    },


    logout : async (req : Request, res : Response) => {
        const {success, data } = refreshTokenSchema.safeParse(req.body)
        if(!success) {
            res.status(400).json({
                sucess : false,
                error : "Invalid Request data"
            })
            return 
        }

        try {
            await authService.logout(data.token)
            res.status(200).json({
                success : true,
                data : {}
            })
        } catch (error) {
            // This should be a different class so that 500 error can be diffrentated
            if(error instanceof Error){
                res.status(500).json({
                    success : false,
                    error : error.message
                })
            }
        }


        
    }



}


export default authController