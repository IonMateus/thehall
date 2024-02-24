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
  
  numberOfClients++
  console.log('User connected:', socket.id, " : ", numberOfClients);
  io.emit("updateNumberOfClients", numberOfClients)

  io.emit('updateRooms', Object.keys(rooms));

  socket.on("username", (username) => {
    if (username) {
      userNames[socket.id] = username;
    }
  });
  

  socket.on("verifyRoom", (roomName) => {
    if(roomName){
      res = rooms.hasOwnProperty(roomName)
      if(res){
        if(rooms[roomName].password === ""){
          socket.emit('joinRoom', {roomName:roomName,password:""});
        }else{
          socket.emit("enterRoom", true);
        }
      }else{
        socket.emit("enterRoom", false);
      }
    }
  });
  
  socket.on('createRoom', (data) => {
    if(data && data.roomName && data.password){
      if (/^[a-zA-Z]+$/.test(data.roomName) && !rooms.hasOwnProperty(data.roomName)) {
        rooms[data.roomName] = { clients: [], numberOfClientsOnRoom: 0 , password: data.password};
        socket.join(data.roomName);
        socket.emit('updateRooms', Object.keys(rooms));
      }
    }
  });

  socket.on('joinRoom', (data) => {
    if(data && data.roomName && data.password){
      const room = rooms[data.roomName];
      if (room && !room.clients.includes(socket.id)) {
        if(data.password === room.password){
          socket.join(data.roomName);
          room.clients.push(socket.id);
          room.numberOfClientsOnRoom++;
          socket.emit("CanJoinRoom",true)
          io.to(data.roomName).emit("updateNumberOfClientsOnRoom", room.numberOfClientsOnRoom);
        }else{
          socket.emit("CanJoinRoom",false)
        }
      }
    }
  });
  

  socket.on('message', (data) => {
    if(data && data.room && data.message){
      const senderUsername = userNames[socket.id];
      io.to(data.room).emit('message', { user: senderUsername, message: data.message , socketId:socket.id});
    }
  });
  

  socket.on('disconnect', () => {
    delete userNames[socket.id]
    numberOfClients--
    console.log('User disconnected:', socket.id, " : ", numberOfClients);
    io.emit("updateNumberOfClients", numberOfClients)

    Object.keys(rooms).forEach((room) => {
      if (rooms[room].clients.includes(socket.id)){

        rooms[room].numberOfClientsOnRoom--
        console.log('Clientes na sala sala1:', io.sockets.adapter.rooms[room]);

        if (!io.sockets.adapter.rooms[room] || Object.keys(io.sockets.adapter.rooms[room]).length === 0) {
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
  console.log(`\n----------Server is running on port ${PORT}----------`);
});
