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
    }
  });
  

  socket.on("verifyRoom", (roomName) => {
    res = rooms.hasOwnProperty(roomName)
    io.emit("enterRoom", res);
  });
  

  socket.on('createRoom', (roomName) => {
    if (/^[a-zA-Z]+$/.test(roomName)) {
      rooms[roomName] = { clients: [], numberOfClientsOnRoom: 0 };
      socket.join(roomName);
      io.emit('updateRooms', Object.keys(rooms));
    } else {
      
    }
  });

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    const room = rooms[roomName];
    if (room && !room.clients.includes(socket.id)) {
      room.clients.push(socket.id);
      room.numberOfClientsOnRoom++;
      io.to(roomName).emit("updateNumberOfClientsOnRoom", room.numberOfClientsOnRoom);
    }
  });
  

  socket.on('message', (data) => {
    const senderUsername = userNames[socket.id];
    io.to(data.room).emit('message', { user: senderUsername, message: data.message });
  });
  

  socket.on('disconnect', () => {

    console.log('User disconnected:', socket.id);
    delete userNames[socket.id]
    numberOfClients--
    io.emit("updateNumberOfClients", numberOfClients)

    Object.keys(rooms).forEach((room) => {
      if (rooms[room].clients.includes(socket.id)){
        
        rooms[room].numberOfClientsOnRoom--

        if (rooms[room].numberOfClientsOnRoom === 0) {
          delete rooms[room];
          io.emit('updateRooms', Object.keys(rooms));
        }else{
          rooms[room].clients = rooms[room].clients.filter((client) => client !== socket.id);

          io.to(room).emit("updateNumberOfClientsOnRoom", rooms[room].numberOfClientsOnRoom)
        }

      }
    });

  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
