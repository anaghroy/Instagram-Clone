const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

/**POST- /api/auth/register */
authRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password, bio, profileImage } = req.body;

    /**Checking process*/
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message:
          "User already exists" +
          (isUserAlreadyExists.email == email
            ? "Email already exists"
            : "Username already exists"),
      });
    }

    /**Password setup*/
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      bio,
      profileImage,
      password: hashedPassword,
    });

    /**Creating token */
    /**-user ka data hona chahiya
     * - data unique hona chahiye
     */
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    /**creating cookies */
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict", //Only send cookies when request comes from SAME SITE.
    });

    res.status(201).json({
      message: "User Registered successfully",
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

authRouter.post("/login", async (req, res)=>{
    const {username, email, password} = req.body

    /**Checking process */
})

module.exports = authRouter
