const { Router } = require("express");
const commentsController = require("../controllers/commentsController")

const commentsRouter = Router()

commentsRouter.get("/",commentsController.getAllComments)
commentsRouter.get("/:commentId",commentsController.getSpecificComment)
commentsRouter.delete("/:commentId",commentsController.deleteAComment)
commentsRouter.get("/post/:postId",commentsController.getPostComments)
commentsRouter.post("/post/:postId",commentsController.addComment)

module.exports = commentsRouter
