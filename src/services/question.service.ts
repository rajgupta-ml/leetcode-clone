import type z from "zod"
import type { createQuestionSchema } from "../zodSchemas/question.Zschema"
import { prisma } from "../utils/db"


export const questionService = {
    createQuestion : async (meta_data : z.infer<typeof createQuestionSchema>) => {  
            const questionDb = await prisma.questions.create({
                data : {
                    ...meta_data
                }
            })
            
            return {id : questionDb.id}
        

    }
}