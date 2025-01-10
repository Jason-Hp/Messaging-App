
const { Router } = require("express");
const loginRouter = require("./login");
const registerRouter = require("./register");
const commentsRouter = require("./comments");
const postsRouter = require("./posts");

const apiRouter = Router()

apiRouter.use("/login",loginRouter)
apiRouter.use("/register",registerRouter)
apiRouter.use("/comments",commentsRouter)
apiRouter.use("/posts",postsRouter)

module.exports = apiRouter;

