import express from "express"
import {getData, getDataDetails} from "../controller/dataController";

const dataRouter = express.Router()

dataRouter.get("/", getData)
dataRouter.get("/:id", getDataDetails)

export default dataRouter