const express = require("express")
const cors = require('cors');
const apiRouter = require("./routes/apiRouter")
const cookieParser = require("cookie-parser");
require('dotenv').config()



app = express();

//When your frontend and backend are hosted on different sites
const corsOptions = {
    origin: 'http://localhost:5000', 
    credentials: true,  
  };
app.use(cors(corsOptions));
  
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use("/api",apiRouter)


app.listen(process.env.PORT,()=>{
    console.log("Listening on port "+process.env.PORT)
})