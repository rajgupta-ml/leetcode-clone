import express from "express"
import authRouter from "./router/auth.router"
import questionRouter from "./router/question.router"

const app = express()
app.use(express.json())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/question", questionRouter)

app.listen(8080, () => {
    console.log("The server is running on port 8080")
})