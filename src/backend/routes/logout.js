const { Router } = require("express");
const logoutController = require("../controllers/logoutController")

const logoutRouter = Router()

logoutRouter.get("/",logoutController)

module.exports = logoutRouter