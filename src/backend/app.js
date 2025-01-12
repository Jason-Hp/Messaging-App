const express = require("express");
const cors = require('cors');
const apiRouter = require("./routes/apiRouter");
const cookieParser = require("cookie-parser");
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5000',  // Frontend URL
  credentials: true,  // Allow credentials (cookies, headers, etc.)
};


// Apply CORS to Express routes as well
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api", apiRouter);

// Start the server
const expressServer = app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});

const io = new Server(expressServer,{
  cors:corsOptions
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