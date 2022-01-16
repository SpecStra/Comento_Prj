import express from "express"

const PORT = 5000

const app = express()

const handleHome = () => console.log("HOme")

app.get("/", handleHome)

const handleServerListening = () => {
    console.log(`✔ Server listening on port http://localhost:${PORT}`)
}

app.listen(PORT, handleServerListening)