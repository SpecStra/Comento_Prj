import express from "express"
import {getHome, getJoin, getLogin, getLogout, postJoin, postLogin} from "../controller/rootController";

const rootRouter = express.Router()

rootRouter.get("/", getHome)
rootRouter.route("/login").get(getLogin).post(postLogin)
rootRouter.route("/join").get(getJoin).post(postJoin)
rootRouter.route("/logout").get(getLogout)

export default rootRouter