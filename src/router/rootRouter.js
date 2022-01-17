import express from "express"
import {getHome, getJoin, getLogin} from "../controller/rootController";

const rootRouter = express.Router()

rootRouter.get("/", getHome)
rootRouter.get("/login", getLogin)
rootRouter.get("/join", getJoin)

export default rootRouter