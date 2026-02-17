const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/auth.route");
const postRoute = require("./routes/post.route");
const app = express();

/**Middleware */
app.use(express.json());
app.use(cookieParser());

/**authentication Middleware */
app.use("/api/auth", authRouter);
/**User creating "post" */
app.use("/api/posts", postRoute);

module.exports = app;
