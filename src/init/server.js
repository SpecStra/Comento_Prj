import express from "express"
import rootRouter from "../router/rootRouter";
import userRouter from "../router/userRouter";
import dataRouter from "../router/dataRouter";

const PORT = 5000

const app = express()

const handleHome = () => console.log("HOme, sir")

app.use("/", rootRouter)
app.use("/users", userRouter)
app.use("/data", dataRouter)

const handleServerListening = () => {
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
}

app.listen(PORT, handleServerListening)