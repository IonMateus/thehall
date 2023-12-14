const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { table } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname)));

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

let contador = 3
let tables = []
let users = []

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });

  socket.on('message', (data) => {
    io.emit('message',data)
  });

  socket.on('requestTables', () => {
    io.to(socket.id).emit('sendTables', tables);
    console.log("tables send")
  });

  socket.on('sendTable', (table) => {
    tables.push(table)
    socket.broadcast.emit('sendTable', table);
    console.log("table", table.name)
  });

});


app.get('/table/*', (req, res) => {
  const path = req.params[0]; 
  res.send(`
  <h1>Table '${path}'</h1>
  <a href='../../app'>The Hall</a>
  `);
});