import express from "express"
import {getJoin, getLogin, getLogout, postJoin, postLogin} from "../controller/rootController";
import {getDataPage} from "../controller/dataController";

const rootRouter = express.Router()

rootRouter.get("/", getDataPage)
rootRouter.route("/login").get(getLogin).post(postLogin)
rootRouter.route("/join").get(getJoin).post(postJoin)
rootRouter.route("/logout").get(getLogout)

export default rootRouter