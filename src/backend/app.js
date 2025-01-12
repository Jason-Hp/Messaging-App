const express = require("express");
const cors = require('cors');
const apiRouter = require("./routes/apiRouter");
const cookieParser = require("cookie-parser");
const { Server } = require('socket.io');
const path = require('path')
require('dotenv').config();

const app = express();


const corsOptions = {
  origin: 'http://localhost:5000',  //Your Frontend URL
  credentials: true,  
};



app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/files', express.static(path.join(__dirname, './files')));
app.use("/api", apiRouter);


const expressServer = app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});

//For some reason, my socket keeps disconnecting
const io = new Server(expressServer,{
  cors:corsOptions,
  reconnection: true,
  reconnectionAttempts: 5, 
  reconnectionDelay: 1000, 
  reconnectionDelayMax: 5000 
})

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    let chatRoomId = data.chatRoom
    io.emit(`message-${chatRoomId}`, data);  

  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});