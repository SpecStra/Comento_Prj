import express from "express"
import session from "express-session"
import rootRouter from "../router/rootRouter.js";
import userRouter from "../router/userRouter.js";
import dataRouter from "../router/dataRouter.js";
import bodyParser from "body-parser";
import "./db.js"
import "../model/Company.js"
import "../model/User.js"
import {localWare} from "./sessionCatcher.js";

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
app.use((req, res, next) => {
    res.status(404).render("404", {message : "Hey, you've got a wrong way."})
})

const handleServerListening = () => {
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
}

app.listen(PORT, handleServerListening)