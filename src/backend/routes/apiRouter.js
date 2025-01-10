
const { Router } = require("express");
const loginRouter = require("./login");
const registerRouter = require("./register");
const usersRouter = require("./users")
const resultsRouter = require("./results")
const chatsRouter = require("./chats")

const apiRouter = Router()

apiRouter.use("/login",loginRouter)
apiRouter.use("/register",registerRouter)
apiRouter.use("/users",usersRouter)
apiRouter.use("/results",resultsRouter)
apiRouter.use("/chats",chatsRouter)

module.exports = apiRouter;

