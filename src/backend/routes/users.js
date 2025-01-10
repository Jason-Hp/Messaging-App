const { Router } = require("express");
const usersController = require("../controllers/usersController")

const usersRouter = Router()

usersRouter.get("/",usersController.getAllUsers)
usersRouter.get("/current",usersController.getCurrentUser)

module.exports = usersRouter