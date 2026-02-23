const express = require("express");
const authController = require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware")

const authRouter = express.Router();

/**POST- /api/auth/register */
authRouter.post("/register", authController.registerController);

/**POST- /api/auth/login */
authRouter.post("/login", authController.loginController);

/**OTP- send */
authRouter.post("/send-otp", authController.sendOtpController)

/**OTP- verify */
authRouter.post("/verify-otp", authController.verifyOtpController)

/**
 * @route GET /api/auth/get-me
 * @desc Get the currently logged in user's information
 * @access Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController)

module.exports = authRouter;
