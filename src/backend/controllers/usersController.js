const pool = require("../db/pool");
const authenticateJWT = require("./authentication/authenticateJWT")

async function getAllUsers(req,res,next){
    try{
        const { rows } = await pool.query("SELECT * FROM users")
        return res.status(200).json({ data: rows})
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}

async function getUser(req,res){
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ message: "Username query parameter is required" });
      }
    try{
        const { rows } = pool.query("SELECT * FROM users WHERE username ILIKE $1",[`%${username}%`])
        if(!rows[0]){
            return res.status(404).json({message: "No users found"})
        }
        return res.status(200).json({ data:rows})
    }
    catch{
        return res.status(500).json({message:"Something went wrong with our database!"})
    }
}

module.exports = {
    getAllUsers: [authenticateJWT,getAllUsers],
    getUser: [authenticateJWT,getUser]
}
