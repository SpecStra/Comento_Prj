import express from "express"
import rootRouter from "../router/rootRouter";
import userRouter from "../router/userRouter";
import dataRouter from "../router/dataRouter";

const PORT = 5000

const app = express()

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")
app.use("/", rootRouter)
app.use("/user", userRouter)
app.use("/data", dataRouter)

const handleServerListening = () => {
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
}

app.listen(PORT, handleServerListening)