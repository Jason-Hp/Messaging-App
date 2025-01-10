const { Router } = require("express");
const registerController = require("../controllers/registerController")

const registerRouter = Router()

registerRouter.post("/",registerController)

module.exports = registerRouter