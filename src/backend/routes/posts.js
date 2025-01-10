const { Router } = require("express");
const postsController = require("../controllers/postsController")

const postsRouter = Router()

postsRouter.get("/",postsController.getAllPosts)
postsRouter.get("/:postId",postsController.getSpecificPost)
postsRouter.delete("/:postId",postsController.deleteAPost)
postsRouter.get("/author/:authorId",postsController.getAuthorPosts)
postsRouter.post("/",postsController.addPost)

module.exports = postsRouter