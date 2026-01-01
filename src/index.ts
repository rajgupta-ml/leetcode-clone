import express from "express"
import authRouter from "./router/auth.router"

// There should be role Admin and Students 
// Admins should be able to create Question and add TestCase
// Student should be able to provide solution for those questionNo and the run 

const app = express()
app.use(express.json())
app.use("/api/v1", authRouter)



app.listen(8080, () => {
    console.log("The server is running on port 8080")
})