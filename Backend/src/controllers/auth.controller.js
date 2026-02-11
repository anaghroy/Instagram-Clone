const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", //Only send cookies when request comes from SAME SITE.
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
}

async function loginController(req, res) {
  try {
    const { username, email, password } = req.body;

    /**Checking process */
    const user = await userModel.findOne({
      $or: [
        {
          /**Condition-1 */
          username: username,
        },
        {
          /**Condition-2 */
          email: email,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    // Compare plain password with hashed password from DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    /**Password checking */
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    /**Creating token */
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    /**Creating cookie */
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", //Only send cookie when request comes from SAME SITE.
    });

    res.status(200).json({
      message: "User logged in",
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { registerController, loginController };
