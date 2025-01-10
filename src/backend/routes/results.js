const { Router } = require("express");
const usersController = require("../controllers/usersController")

const resultsRouter = Router()

resultsRouter.get("/",usersController.getUser)

module.exports = resultsRouter