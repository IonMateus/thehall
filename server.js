const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

let rooms = {}
let numberOfClients = 0
let userNames = {}
let access = 0
let roomsCreated = 0
let messages = 0

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/room/:roomName', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'))
})

io.on('connection', (socket) => {
  
  numberOfClients++
  access++
  console.log('User connected:', socket.id, " : ", numberOfClients)
  io.emit("updateNumberOfClients", numberOfClients)
  io.emit("updateInformations",{access,roomsCreated,messages})
  io.emit('updateRooms', Object.keys(rooms))


  socket.on("username", (username) => {
    if (username) {
      userNames[socket.id] = username
      var usernames = []
      for(i in rooms[socket.tryToEnter].clients){
        usernames.push(userNames[rooms[socket.tryToEnter].clients[i]])
      }
      io.to(socket.tryToEnter).emit('updateUsernames', usernames)
    }
  })

  
  socket.on("verifyRoom", (roomName) => {
    if(roomName){
      if(roomExist(roomName)){
        if(rooms[roomName].password === ""){
          socket.emit('joinRoom', {roomName:roomName,password:""})
        }else{
          socket.emit("enterRoom", true)
        }
      }else{
        socket.emit("enterRoom", false)
      }
    }
  })
  

  socket.on('createRoom', (data) => {
      if (/^[a-zA-Z]+$/.test(data.roomName) && !roomExist(data.roomName)) {
        rooms[data.roomName] = { clients: [], numberOfClientsOnRoom: 0 , password: data.password}
        socket.join(data.roomName)
        socket.emit('updateRooms', Object.keys(rooms))
        roomsCreated++
      }
    
  })


  socket.on('joinRoom', (data) => {
      const room = rooms[data.roomName];
      if (room && !room.clients.includes(socket.id) && roomExist(data.roomName)) {
        socket.tryToEnter = data.roomName
        if(data.password === room.password){
          socket.join(data.roomName)
          room.clients.push(socket.id)
          room.numberOfClientsOnRoom = room.clients.length
          socket.emit("CanJoinRoom",true)
        }else{
          socket.emit("CanJoinRoom",false)
        }
      }
    
  })
  

  socket.on('message', (data) => {
    if(data && data.message && data.roomName && roomExist(data.roomName)){
      if(rooms[data.roomName].clients.includes(socket.id)){
        const senderUsername = userNames[socket.id]
        io.to(data.roomName).emit('message', { user: senderUsername, message: data.message , socketId:socket.id})
        messages++
      }
    }
  })


  socket.on("sendImage", (data) => {
    const senderUsername = userNames[socket.id];
    
    if (isPNG(data.file)) {
      io.to(data.roomName).emit('sendImageToRoom', { user: senderUsername, file: data.file, socketId: socket.id });
    } else {
      socket.emit('notification', "Somente imagens PNG");
    }
  })
  
  function isPNG(buffer) {
    return (
      buffer[0] === 0x89 && 
      buffer[1] === 0x50 && 
      buffer[2] === 0x4E && 
      buffer[3] === 0x47    
    )
  }


  socket.on('disconnect', () => {
    delete userNames[socket.id]

    numberOfClients--
    console.log('User disconnected:', socket.id, " : ", numberOfClients);
    io.emit("updateNumberOfClients", numberOfClients)

    if(socket.tryToEnter){
      const room = socket.tryToEnter
      rooms[room].clients = rooms[room].clients.filter((client) => client !== socket.id)
      rooms[room].numberOfClientsOnRoom = rooms[room].clients.length

      if (rooms[room].numberOfClientsOnRoom === 0) {
        delete rooms[room];
        io.emit('updateRooms', Object.keys(rooms))
      }else{
        var usernames = []
        for(i in rooms[socket.tryToEnter].clients){
          usernames.push(userNames[rooms[socket.tryToEnter].clients[i]])
        }
        io.to(socket.tryToEnter).emit('updateUsernames', usernames)
      }
    }

  })


})


const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`\n----------Server is running on port ${PORT}----------`)
})

function roomExist(roomName){
  return rooms.hasOwnProperty(roomName)
}