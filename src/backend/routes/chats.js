const { Router } = require("express")
const chatsController = require("../controllers/chatsController")

const chatsRouter = Router()

chatsRouter.get("/",chatsController.getAllChats)
chatsRouter.post("/",chatsController.addChat)
chatsRouter.get("/:chatId",chatsController.getChat)
chatsRouter.delete("/:chatId",chatsController.deleteChat)
chatsRouter.get("/:chatId/messages",chatsController.getMessages)
chatsRouter.post("/:chatId/messages",chatsController.addMessage)
chatsRouter.delete("/:chatId/messages/:messageId",chatsController.deleteMessage)
chatsRouter.put("/:chatId/messages/:messageId",chatsController.editMessage)

module.exports = chatsRouter