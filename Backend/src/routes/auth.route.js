const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

/**POST- /api/auth/register */
authRouter.post("/register", authController.registerController);

/**POST- /api/auth/login */
authRouter.post("/login", authController.loginController);

/**OTP- send */
authRouter.post("/send-otp", authController.sendOtpController)

/**OTP- verify */
authRouter.post("/verify-otp", authController.verifyOtpController)



module.exports = authRouter;
