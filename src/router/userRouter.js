import express from "express"
import {getUser} from "../controller/userController";

const userRouter = express.Router()

userRouter.get("/", getUser)

export default userRouter