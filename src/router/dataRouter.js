import express from "express"
import {
    getAttachDelete,
    getData,
    getDataAdd,
    getDataDelete,
    getDataDetails,
    getDataDownload,
    getDataEdit,
    getDataPage,
    postDataAdd,
    postDataEdit
} from "../controller/dataController";
import {uploadWare} from "../init/sessionCatcher";

const dataRouter = express.Router()

dataRouter.get("/", getData)
dataRouter.get("/pages/:page([0-9]{1,3})", getDataPage)
dataRouter.get("/pages/:page([0-9]{1,3}/:mode)", getDataPage)
dataRouter.route("/add").get(getDataAdd).post(uploadWare.single("attach"), postDataAdd)
dataRouter.get("/:objectID", getDataDetails)
dataRouter.route("/:objectID/edit").get(getDataEdit).post(uploadWare.single("attach"), postDataEdit)
dataRouter.get("/:objectID/delete", getDataDelete)
dataRouter.route("/uploads/:file_path([0-9:a-z]{32})").get(getDataDownload)
dataRouter.route("/uploads/:file_path([0-9:a-z]{32})/delete").get(getAttachDelete)

export default dataRouter