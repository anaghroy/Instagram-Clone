const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);

/**require routes */
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.route");
const userRouter = require("./routes/user.route");

/**Using routes */
app.use("/api/auth", authRouter);
/**User creating "post" */
app.use("/api/posts", postRouter);
/**Creating follow and unfollow */
app.use("/api/users", userRouter);

module.exports = app;
