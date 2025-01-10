const express = require("express")
const cors = require('cors');
const apiRouter = require("./routes/apiRouter")
const apicache = require('apicache')
const cookieParser = require("cookie-parser");
require('dotenv').config()
let cache = apicache.middleware;


app = express();

//When your frontend and backend are hosted on different sites
/*const corsOptions = {
    origin: 'https://frontend.com', <-------- Change to your frontend site
    credentials: true,  
  };
  
  app.use(cors(corsOptions));*/
  
app.use(cors()); //Replace this is if the above is true
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cache('10 minutes'))
app.use(cookieParser())

app.use("/api",apiRouter)


app.listen(process.env.PORT,()=>{
    console.log("Listening on port "+process.env.PORT)
})