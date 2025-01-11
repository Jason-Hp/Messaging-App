const bcrypt = require('bcryptjs');  
const pool = require("../db/pool");




async function logoutController(req,res,next){
    
    res.clearCookie("token", {
        httpOnly: true,  
        secure: false,   
        sameSite: "None",
        expires: new Date(0) 
      });
    
      return res.status(200).json({ message: "Logged out successfully" });
};
    




module.exports = logoutController