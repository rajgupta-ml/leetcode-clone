import type { NextFunction, Request, Response } from "express";
import { success } from "zod";
import { verifyJWT } from "../utils/token";
import type { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";

export const baseAuthMiddleware = (req: Request, res : Response, next : NextFunction) => {

    const token = req.headers["authorization"]
    
    if(!token){
        res.status(401).json({
            success : false,
            error : "Invalid request body"
        })
        return;
    }



    const decodedToken = verifyJWT(token) as JwtPayload
    if(!decodedToken || !decodedToken.id) {
        res.status(401).json({
            success : false,
            error : "Invalid JWT token"
        })
        return;
    }   


    req.email = decodedToken.email,
    req.id = decodedToken.id,
    req.role = decodedToken.role,
    next()

}


export const isAdminMiddleware = (req : Request, res : Response, next : NextFunction) => {
    if(!req.role || req.role != UserRole.admin) {
        res.status(403).json({
            success : false,
            error : "Only Admin are allowed"
        })
        return 
    }
    next()
}