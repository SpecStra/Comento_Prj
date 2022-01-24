import express from "express"
import rootRouter from "../router/rootRouter";
import userRouter from "../router/userRouter";
import dataRouter from "../router/dataRouter";
import morgan from "morgan";
import bodyParser from "body-parser";
import "./db"
import "../model/Company"

const PORT = 5000

const app = express()
//const logger = morgan("dev")

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")
//app.use(logger)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use("/", rootRouter)
app.use("/user", userRouter)
app.use("/data", dataRouter)

const handleServerListening = () => {
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
}

app.listen(PORT, handleServerListening)