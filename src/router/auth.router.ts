import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router()



router.post("/send-otp", authController.sendOtp)
router.post("/verify-otp", authController.verifyOtp)
router.post("/refresh-token", authController.refreshToken)
router.post("/logout", authController.logout)


export default router