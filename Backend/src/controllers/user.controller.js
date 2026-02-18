const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  //Checking -1
  if (followeeUsername === followerUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }
  //Checking -2
  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });
  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "User you are trying to follow does not exist",
    });
  }
  //Checking -3
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });
  if (isAlreadyFollowing) {
    return res.status(200).json({
      message: `You are already following ${followeeUsername}`,
      follow: isAlreadyFollowing,
    });
  }

  try {
    const followRecord = await followModel.create({
      follower: followerUsername,
      followee: followeeUsername,
    });
    res.status(201).json({
      message: `You are now following ${followeeUsername}`,
      follow: followRecord,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error:${err.message}`,
    });
  }
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  try {
    const isUserFollowing = await followModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
    });
    if (!isUserFollowing) {
      return res.status(200).json({
        message: `You are not following ${followeeUsername}`,
      });
    }

    await followModel.findByIdAndDelete(isUserFollowing._id);

    res.status(200).json({
      message: `You have unfollowed ${followeeUsername}`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error:${err.message}`,
    });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
};
