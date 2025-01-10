const { Router } = require("express");
const usersController = require("../controllers/usersController")

const usersRouter = Router()

usersRouter.get("/",usersController.getAllUsers)

module.exports = usersRouter