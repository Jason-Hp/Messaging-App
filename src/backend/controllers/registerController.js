const bcrypt = require('bcryptjs');  
const pool = require("../db/pool");
const { body,validationResult } = require('express-validator')



async function registerController(req,res,next){
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()})
      }
    
    try{

       const { username, password} = req.body 
       const { rows } = await pool.query("SELECT * FROM users WHERE username = $1",[username])
       const user = rows[0]
       if(user){
        return res.status(401).json({message:"Username ALREADY in use!"})
       }else{
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query("INSERT INTO users (username,password) VALUES ($1, $2)",[username,hashedPassword])
        return res.status(201).json({message:"Registration success!"})
       }

    } catch(err){
        res.status(500).json({message : "Something went wrong, please try again!"})
    }
}



module.exports =    [body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('Cpassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }), registerController]