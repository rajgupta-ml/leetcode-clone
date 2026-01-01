import {z} from "zod"   
import { ProfileLevel } from "../generated/prisma/enums"

type typeTestCase = {
    input : string | string[]
    output : string | string[]
}


export const createQuestionSchema = z.object({
    question_title : z.string(),
    question : z.string(),
    question_rating: z.string(),
    question_level: z.enum(ProfileLevel),
    test_case: z.array(
        z.object({
            input: z.union([z.string(), z.array(z.string())]),
            output: z.union([z.string(), z.array(z.string())])
        })
    ),
    examples: z.array(
        z.object({
            input: z.union([z.string(), z.array(z.string())]),
            output: z.union([z.string(), z.array(z.string())])
        })
    )
})