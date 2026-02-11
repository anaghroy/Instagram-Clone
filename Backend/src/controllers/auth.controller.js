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

/**Generate OTP */
async function sendOtpController(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    /**Checking user */
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /**Generate 6 digit OTP */

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    /**Hash OTP */
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("OTP:", otp);

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

/**Verify OTP */
async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "user not found" });
   
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not requested" });
    }
    
    // Compare plain password with hashed password from DB
    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid || user.otpExpires < Date.now()) {
      return res.status(401).json({
        message: "Invalid  or expired OTP",
      });
    }

    //Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    //Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    /**Cookies */
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      message: "Logged in successfully",
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
module.exports = {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
};
