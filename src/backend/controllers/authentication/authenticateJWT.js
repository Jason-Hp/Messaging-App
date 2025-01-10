const jwt = require("jsonwebtoken");
require('dotenv').config()

const authenticateJWT = (req, res, next) => {
    const token = req.cookies?.token;
    console.log(token)
    if (!token) {
        return res.status(403).json({ message: "You are not authenticated!" }); 
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Something went wrong with authentication" }); 
      }
      const username = user.username;
      req.user = username;
      next();
    });
};

module.exports = authenticateJWT;