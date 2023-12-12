const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Adicione essa linha para lidar com caminhos de arquivo

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('message', (data) => {
      io.emit('message', data);
    });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
