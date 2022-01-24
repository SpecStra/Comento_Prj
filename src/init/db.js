import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})

const db = mongoose.connection

const handleOpen = () => {
    console.log("✔ MongoDB has connected")
}
const handleError = (error) => {
    console.log("DB error has occurred : ", error)
}

db.on("error", handleError)
db.once("open", handleOpen)