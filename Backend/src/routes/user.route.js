const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

const userRouter = express.Router();

/**
 * @route POST /api/users/follow/:userid
 * @description Follow a user
 * @access Private
 */
userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
);
/**
 * @route   PATCH /api/users/follow/accept/:id
 * @desc    Accept a follow request.
 *          Only the followee (target user) is authorized to accept.
 *          Status changes from "pending" → "accepted".
 * @access  Private
 * @params  id → Follow document ID
 */
userRouter.patch(
  "/follow/accept/:id",
  identifyUser,
  userController.acceptFollowController,
);
/**
 * @route   PATCH /api/users/follow/reject/:id
 * @desc    Reject a follow request.
 *          Only the followee can reject.
 *          Status changes from "pending" → "rejected".
 * @access  Private
 * @params  id → Follow document ID
 */
userRouter.patch(
  "/follow/reject/:id",
  identifyUser,
  userController.rejectFollowController,
);
/**
 * @route   GET /api/users/followers/count/:username
 * @desc    Get total followers count of a user.
 *          Only "accepted" followers are counted.
 * @access  Public / Private (your choice)
 * @params  username → username whose followers are counted
 */
userRouter.get(
  "/followers/count/:username",
  userController.getFollowersCountController,
);
/**
 * @route   POST /api/users/unfollow/:username
 * @desc    Unfollow a user.
 *          Deletes follow document if status is "accepted".
 * @access  Private
 * @params  username → username to unfollow
 */
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
);

module.exports = userRouter;
