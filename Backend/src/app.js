const cookieParser = require("cookie-parser")
const express = require("express")

const app = express()

/**Middleware */
app.use(express.json())
app.use(cookieParser())




module.exports = app