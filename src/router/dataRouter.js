import express from "express"
import {
    getData,
    getDataDetails,
    getDataDelete,
    getDataEdit,
    getDataAdd,
    postDataAdd, postDataEdit, getDataDownload
} from "../controller/dataController";
import {uploadWare} from "../init/sessionCatcher";

const dataRouter = express.Router()

dataRouter.get("/", getData)
dataRouter.route("/add").get(getDataAdd).post(uploadWare.single("attach"), postDataAdd)
dataRouter.get("/:id([0-9]{6})", getDataDetails)
dataRouter.route("/:id([0-9]{6})/edit").get(getDataEdit).post(uploadWare.single("attach"), postDataEdit)
dataRouter.get("/:id([0-9]{6})/delete", getDataDelete)
dataRouter.route("/uploads/:file_path([0-9:a-z]{32})").get(getDataDownload)

export default dataRouter