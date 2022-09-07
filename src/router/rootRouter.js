import express from "express"
import {
    getHome,
    getJoin,
    getJoinGate,
    getJoinWorkshop,
    getLogin,
    getLogout,
    postJoin,
    postJoinWorkshop,
    postLogin
} from "../controller/rootController.js";

const rootRouter = express.Router()

rootRouter.get("/", getHome)
rootRouter.route("/login").get(getLogin).post(postLogin)
rootRouter.route("/join").get(getJoinGate)
rootRouter.route("/join/company").get(getJoin).post(postJoin)
rootRouter.route("/join/workshop").get(getJoinWorkshop).post(postJoinWorkshop)
rootRouter.route("/logout").get(getLogout)

export default rootRouter