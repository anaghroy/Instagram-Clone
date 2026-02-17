const express = require("express")
const multer = require("multer")
const upload = multer({storage: multer.memoryStorage()})
const postController = require("../controllers/post.controller")
const identifyUser = require("../middlewares/auth.middleware")
const postRouter = express.Router()

/*POST /api/posts [protected]*/
postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)

/**
 * GET /api/posts/ [protected]
 */
postRouter.get("/", identifyUser, postController.getPostController)


/**
 * GET /api/posts/details/:postid
 * - return an detail about specific post with the id. also check whether the post belongs to the user that the request come from
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


module.exports = postRouter