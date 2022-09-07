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
    getDownloadAllData,
    postDataAdd,
    postDataEdit,
    postDataPages
} from "../controller/dataController.js";
import {uploadWare} from "../init/sessionCatcher.js";

const dataRouter = express.Router()

dataRouter.get("/", getData)
dataRouter.route("/pages/:page([0-9]{1,3})").get(getDataPage).post(postDataPages)
dataRouter.route("/pages/:page([0-9]{1,3}/:mode)").get(getDataPage).post(postDataPages)
dataRouter.route("/add").get(getDataAdd).post(uploadWare.single("attach"), postDataAdd)
dataRouter.get("/downloadAll", getDownloadAllData)
dataRouter.get("/:objectID", getDataDetails)
dataRouter.route("/:objectID/edit").get(getDataEdit).post(uploadWare.single("attach"), postDataEdit)
dataRouter.get("/:objectID/delete", getDataDelete)
dataRouter.route("/uploads/:file_path([0-9:a-z]{32})").get(getDataDownload)
dataRouter.route("/uploads/:file_path([0-9:a-z]{32})/delete").get(getAttachDelete)

export default dataRouter