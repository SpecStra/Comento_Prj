import express from "express"
import {getHome, getJoin, getLogin, postJoin, postLogin} from "../controller/rootController";

const rootRouter = express.Router()

rootRouter.get("/", getHome)
rootRouter.route("/login").get(getLogin).post(postLogin)
rootRouter.route("/join").get(getJoin).post(postJoin)

export default rootRouter