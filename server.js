const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};
let numberOfClients = 0
const userNames = {};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/room/:roomName', (req, res) => {
  //const roomName = req.params.roomName;
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

io.on('connection', (socket) => {
  
  console.log('User connected:', socket.id);
  numberOfClients++
  io.emit("updateNumberOfClients", numberOfClients)

  io.emit('updateRooms', Object.keys(rooms));


  socket.on("username", (username) => {
    if (username) {
      userNames[socket.id] = username;
      io.emit('updateUsername', { socketId: socket.id, username });
    }
  });
  

  socket.on("verifyRoom", (roomName) => {
    res = rooms.hasOwnProperty(roomName)
    io.emit("enterRoom", res);
  });
  

  socket.on('createRoom', (roomName) => {
    if (/^[a-zA-Z]+$/.test(roomName)) {
      rooms[roomName] = { clients: [] };
      socket.join(roomName);
      io.emit('updateRooms', Object.keys(rooms));
    } else {
      
    }
  });

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    rooms[roomName].clients.push(socket.id);
  });

  socket.on('message', (data) => {
    const senderUsername = userNames[socket.id];
    io.to(data.room).emit('message', { user: senderUsername, message: data.message });
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    numberOfClients--
    io.emit("updateNumberOfClients", numberOfClients)
    Object.keys(rooms).forEach((room) => {
      rooms[room].clients = rooms[room].clients.filter((client) => client !== socket.id);
    });
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
