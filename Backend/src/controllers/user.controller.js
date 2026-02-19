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
      status: "pending",
    });
    res.status(201).json({
      message: `Follow request sent to ${followeeUsername}`,
      follow: followRecord,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error:${err.message}`,
    });
  }
}
async function acceptFollowController(req, res) {
  const followId = req.params.id;

  const follow = await followModel.findById(followId);

  if (!follow) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (follow.followee !== req.user.username) {
    return res.status(403).json({ message: "Not authorized" });
  }

  follow.status = "accepted";
  await follow.save();

  res.json({
    message: "Follow request accepted ❤️",
    follow,
  });
}
async function rejectFollowController(req, res) {
  const followId = req.params.id;

  const follow = await followModel.findById(followId);

  if (!follow) return res.status(404).json({ message: "Request not found" });

  if (follow.followee !== req.user.username) {
    return res.status(403).json({ message: "Not authorized" });
  }

  follow.status = "rejected";
  await follow.save();

  res.json({
    message: "Follow request rejected 💔",
    follow,
  });
}
async function getFollowersCountController(req, res) {
  const username = req.params.username;

  try {
    const count = await followModel.countDocuments({
      followee: username,
      status: "accepted",
    });

    res.status(200).json({
      message: "Followers count fetched successfully",
      followersCount: count,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
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
      status: "accepted",
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
  } catch (err) {
    res.status(500).json({
      message: `Error:${err.message}`,
    });
  }
}

module.exports = {
  followUserController,
  acceptFollowController,
  rejectFollowController,
  getFollowersCountController,
  unfollowUserController,
};
