import express from "express"
import {getData, getDataDetails, getDataDelete, getDataEdit} from "../controller/dataController";

const dataRouter = express.Router()

dataRouter.get("/", getData)
dataRouter.get("/:id", getDataDetails)
dataRouter.get("/:id/edit", getDataEdit)
dataRouter.get("/:id/delete", getDataDelete)

export default dataRouter