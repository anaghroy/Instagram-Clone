const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  let file;
  try {
    file = await imagekit.files.upload({
      file: req.file.buffer.toString("base64"),
      fileName: "Test",
      folder: "Instagram-clone/All_posts",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Image upload failed",
      error: err.message,
    });
  }

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;

  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Posts fetched successfully.",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  return res.status(200).json({
    message: "Post fetched  successfully.",
    post,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  //Checking-1
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  try {
    const like = await likeModel.create({
      post: postId,
      user: username,
    });

    res.status(200).json({
      message: "Post liked successfully.",
      like,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error: ${err.message}`,
    });
  }
}

async function getFeedController(req, res) {
  try {
    const user = req.user;
    const post = await Promise.all(
      (await postModel.find().populate("user").lean())
      .map(async (post) => {
        {
          /**
           * typeof post => object
           */
          const isLiked = await likeModel.findOne({
            user: user.username,
            post: post._id,
          });
          post.isLiked = !!isLiked;
          return post;
        }
      }),
    );
    res.status(200).json({
      message: "Feed fetched successfully.",
      posts: post,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${err.message}`,
    });
  }
}
module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getFeedController,
};
