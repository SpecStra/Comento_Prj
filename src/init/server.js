import express from "express"
import session from "express-session"
import rootRouter from "../router/rootRouter";
import userRouter from "../router/userRouter";
import dataRouter from "../router/dataRouter";
import bodyParser from "body-parser";
import "./db"
import "../model/Company"
import "../model/User"
import {localWare} from "./sessionCatcher";

const PORT = 5000

const app = express()
// const logger = morgan("dev")

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")
// app.use(logger)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use(session({
    secret : "He",
    resave : true,
    saveUninitialized : true
}))
app.use(localWare)

app.use("/", rootRouter)
app.use("/user", userRouter)
app.use("/data", dataRouter)

const handleServerListening = () => {
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
}

app.listen(PORT, handleServerListening)