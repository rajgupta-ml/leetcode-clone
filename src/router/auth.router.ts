import { Router } from "express";
import authController from "../controllers/auth.controller";
// Sigup, Signin, Logout, Refresh Token
const router = Router()



router.post("/send-otp", authController.sendOtp)
