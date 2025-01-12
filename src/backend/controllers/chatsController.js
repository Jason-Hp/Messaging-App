const pool = require("../db/pool");
const authenticateJWT = require("./authentication/authenticateJWT")

async function getAllChats(req, res) {
    const { id, username } = req.user;

    try {
        const { rows } = await pool.query("SELECT * FROM chats WHERE (userid1 = $1 OR userid2 = $1) ORDER BY date DESC", [id]);
        if(!rows[0]){
            return res.status(404).json({message:"No chat found"})
        }
        return res.status(200).json({ data: rows });
    } catch{
        return res.status(500).json({ message: "Something went wrong with our database" });
    }
}

async function addChat(req,res){
    const {id,username} = req.user
    const {title,contactId} = req.body

    if(!title || !contactId){
        return res.status(400).json({message:"Please INCLUDE title AND user to message"})
    }
    try{
        if(id === contactId){
            return res.status(400).json({message:"Why would you chat with yourself?"})
        }
        const {rows} = await pool.query("SELECT * FROM chats WHERE (userid1 = $1 AND userid2 = $2) OR (userid1 = $2 AND userid2 = $1)",[id,contactId])
        if(rows.length>0){
            return res.status(400).json({message:"Chat with this user already exists!"})
        }

        await pool.query("INSERT INTO chats (title,userid1,userid2) VALUES ($1,$2,$3)",[title,id,contactId])
        return res.status(201).json({message:"Chat created!"})
    }
    catch{
        return res.status(500).json({ message: "Something went wrong with our database" });
    }
   
}

async function getChat(req,res){
    const { chatId } = req.params
    const {id} = req.user

    try{
        const {rows} = await pool.query("SELECT * FROM chats WHERE id = $1",[chatId])
        if(!rows[0]){
            return res.status(404).json({message:"No chat found"})
        }
        if(rows[0].userid1 == id || rows[0].userid2 == id){
            return res.status(200).json({data:rows[0]})
        }
        else{
            return res.status(401).json({message:"You are not authorized!"})
        }
    }
    catch{
        return res.status(500).json({ message: "Something went wrong with our database" });
    }

}

async function deleteChat(req,res){
    const { chatId } = req.params
    const {id} = req.user

    try{
        const {rows} = await pool.query("SELECT * FROM chats WHERE id = $1",[chatId])
        if(!rows[0]){
            return res.status(404).json({message:"No chat found"})
        }
        if(rows[0].userid1 == id){
            await pool.query("DELETE FROM chats WHERE id = $1",[chatId])
            res.status(200).json({message:"Chat deleted"})
        }
        else{
            return res.status(401).json({message:"You are not authorized!"})
        }
    }
    catch{
        return res.status(500).json({ message: "Something went wrong with our database" });
    }

}

async function getMessages(req, res) {
    const { chatId } = req.params;
    const { id } = req.user;

    try {
        const { rows } = await pool.query("SELECT * FROM chats WHERE id = $1", [chatId]);
        if (!rows[0]) {
            return res.status(404).json({ message: "No chat found" });
        }
 
        if (rows[0].userid1 === id || rows[0].userid2 === id) {
            try {
                const { rows } = await pool.query("SELECT * FROM messages WHERE chatid = $1 ORDER BY date ASC",[chatId]);
                return res.status(200).json({ data: rows, user:id });
            } catch {
                return res.status(500).json({ message: "Something went wrong retrieving messages" });
            }
        } else {
            return res.status(401).json({ message: "You are not authorized!" });
        }
    } catch {
        return res.status(500).json({ message: "Something went wrong with our database" });
    }
}


async function addMessage(req,res){
    const { chatId } = req.params
    const {id} = req.user
    const {message} = req.body

    try{
        const {rows} = await pool.query("SELECT * FROM chats WHERE id = $1",[chatId])
        if(!rows[0]){
            return res.status(404).json({message:"No chat found"})
        }
        if(rows[0].userid1 == id || rows[0].userid2 == id){
            try{
                await pool.query("INSERT INTO messages (message, chatid, userid) VALUES ($1, $2, $3)", [message, chatId, id]);
                await pool.query("UPDATE chats SET date = NOW() WHERE id=$1", [chatId]);

                return res.status(201).json({message:"Message sent"})
            }
            catch{
                return res.status(500).json({ message: "Something went wrong with sending message" });
            }
        }
        else{
            return res.status(401).json({message:"You are not authorized!"})
        }
    }
    catch{
        return res.status(500).json({ message: "Something went wrong with our database" });
    }
}

async function deleteMessage(req,res){
    const { chatId,messageId } = req.params
    const {id} = req.user


    try{
        const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1",[messageId])
        if(!rows[0]){
            return res.status(404).json({message:"Message not found"})
        }
        if (rows[0].userid != id){
            return res.status(401).json({message:"You are not authorized!"})
        }
        await pool.query("DELETE FROM messages WHERE id = $1",[messageId])
        return res.status(201).json({message:"Message deleted"})
    }
    catch{
        return res.status(500).json({ message: "Something went wrong with our database" });
    }
}

async function editMessage(req, res) {
    const { messageId } = req.params;
    const { id } = req.user;
    const { edit } = req.body;

    if (!edit) {
        return res.status(400).json({ message: "Message edit content is required" });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId]);
        if (!rows[0]) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (rows[0].userid != id) {
            return res.status(401).json({ message: "You are not authorized!" });
        }
        await pool.query("UPDATE messages SET message = $1 WHERE id = $2", [edit, messageId]); 
        return res.status(200).json({ message: "Message edited" });
    } catch {
        return res.status(500).json({ message: "Something went wrong with our database" });
    }
}

module.exports = {
    getAllChats:[authenticateJWT,getAllChats],
    addChat:[authenticateJWT,addChat],
    getChat:[authenticateJWT,getChat],
    deleteChat:[authenticateJWT,deleteChat],
    getMessages:[authenticateJWT,getMessages],
    addMessage:[authenticateJWT,addMessage],
    deleteMessage:[authenticateJWT,deleteMessage],
    editMessage:[authenticateJWT,editMessage]
}