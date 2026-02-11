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
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    bio: String,
    profileImage: {
      type: String,
      default: "https://ik.imagekit.io/anaghroy/default.png",
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("all-users", userSchema);

module.exports = userModel;
