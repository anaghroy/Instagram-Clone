const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exists"],
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      trim: true, //Prevent accidental spaces
      lowercase: true,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, //Don't return password by default
    },
    bio: String,
    profileImage: {
      type: String,
      default: "https://ik.imagekit.io/anaghroy/default.png",
    },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true },
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
