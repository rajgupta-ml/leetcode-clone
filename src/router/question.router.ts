import { Router } from "express";
import { baseAuthMiddleware, isAdminMiddleware } from "../middleware/auth.middleware";
import { questionController } from "../controllers/question.controller";

const router = Router()
router.post("/", baseAuthMiddleware, isAdminMiddleware, questionController.createQuestion)
router.get("/:id", baseAuthMiddleware)
router.put("/:id", baseAuthMiddleware, isAdminMiddleware)
router.delete("/:id", baseAuthMiddleware, isAdminMiddleware)



export default router