import type { Request, Response } from "express";
import { sendOtpSchema, verifyOtpSchema } from "../zodSchemas/auth.Zschema";
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
            res.status(200).json({
                success : true,
                data : {
                    otp : otp
                }
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


    }
}


export default authController