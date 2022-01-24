import express from "express"
import {
    getData,
    getDataDetails,
    getDataDelete,
    getDataEdit,
    getDataAdd,
    postDataAdd, postDataEdit
} from "../controller/dataController";

const dataRouter = express.Router()

dataRouter.get("/", getData)
dataRouter.route("/add").get(getDataAdd).post(postDataAdd)
dataRouter.get("/:id([0-9]{6})", getDataDetails)
dataRouter.route("/:id([0-9]{6})/edit").get(getDataEdit).post(postDataEdit)
dataRouter.get("/:id([0-9]{6})/delete", getDataDelete)

export default dataRouter