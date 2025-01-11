const bcrypt = require('bcryptjs');  
const pool = require("../db/pool");




async function registerController(req,res,next){

    
      const { username, password, Cpassword} = req.body
      console.log(password,Cpassword)
      if(password.length<8){
        return res.status(400).json({message:"Password should be more than 8 characters!"})
      } 
      if(password !== Cpassword){
        return res.status(400).json({message:"Password confirmation does not match password!"})
      }

    try{
       const { rows } = await pool.query("SELECT * FROM users WHERE username = $1",[username])
       const user = rows[0]
       if(user){
        return res.status(409).json({message:"Username ALREADY in use!"})
       }else{
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query("INSERT INTO users (username,password) VALUES ($1, $2)",[username,hashedPassword])
        return res.status(201).json({message:"Registration success!"})
       }

    } catch(err){
        res.status(500).json({message : "Something went wrong, please try again!"})
    }
}



module.exports = registerController