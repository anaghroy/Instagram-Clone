const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

/**require routes */
const authRouter = require("../src/routes/auth.route");
const postRoute = require("./routes/post.route");
const userRouter = require("./routes/user.route");

/**Using routes */
/**authentication Middleware */
app.use("/api/auth", authRouter);
/**User creating "post" */
app.use("/api/posts", postRoute);
app.use("/api/users", userRouter)

module.exports = app;
