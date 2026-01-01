import type { Request, Response  } from "express"
import { createQuestionSchema } from "../zodSchemas/question.Zschema"
import { questionService } from "../services/question.service"

// examples and testCase  = [{input : [], ouput : []}]

type typeTestCase = {
    input : string | string[]
    output : string | string[]
}

const isValidStructure = (test_case : typeTestCase[]) => {
    return test_case.every(obj => obj.input != null || obj.output != null )
}

export const questionController = {
    createQuestion : async (req : Request, res : Response) => {
        const {success, data} = createQuestionSchema.safeParse(req.body)
        if(!success) {
            res.status(400).json({
                success : false,
                error : "Invalid Request Data"
            })
            return;
        }
        let isValidTestCase, isValidExample;
        if(data.test_case.length > 0) {
            isValidTestCase = isValidStructure(data.test_case)
        }
        if(data.examples.length > 0) {
            isValidExample = isValidStructure(data.examples)
        }


        if(isValidTestCase == false || isValidExample == false){
            res.status(400).json({
                success : false,
                error :"Invalid struture for testcases or examples"
            })
        }

        try {
            const response = await questionService.createQuestion(data)
            res.status(201).json({
                success : true,
                data : {
                    ...response
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success : false,
                error : "Could not persit the question onto the db"
            })
        }

    }
}