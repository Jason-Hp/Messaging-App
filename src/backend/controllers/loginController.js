const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
const pool = require("../db/pool");
require("dotenv").config();

async function loginController(req, res, next) {
    const { username, password } = req.body;

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];  

        if (!user) {
            return res.status(401).json({ message: "Username does not exist!" });
        }

       
        bcrypt.compare(password, user.password, (err, Match) => {
            if (err) {
                return res.status(500).json({ message: "Error during password comparison" });
            }

            if (Match) {
                const token = jwt.sign({ username }, process.env.SECRET, { expiresIn: "100h" });

                //DO INCLUDE sameSite: "None"  if front and backend hosted on different sites
                res.cookie("token", token, {
                    httpOnly: true,     
                    secure: false, 
                    maxAge: 360000000   // 100 hours
                });
  
                return res.status(200).json({ message: "Login successful" });
            } else {
                return res.status(401).json({ message: "Password is incorrect!" });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong with our database, please try again!" });
    }
}

module.exports = loginController;



