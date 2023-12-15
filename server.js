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
  console.log('Server is running on port 3000.');
});

let usersCounter = 0
let tables = []

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  usersCounter++
  io.emit('userCounter',usersCounter)

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      usersCounter--
      io.emit('userCounter',usersCounter)
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
  const name = req.params[0]; 
  let index = tables.findIndex(table => table.name === name);
  res.send(createTablePage(name,index));
});


function createTablePage(name,index){
  if(index == -1){
    return `
      <h1>The table '${name}' doesn't exist</h1>
      <a href='../../app'> - Back</a>
    `
  }else{
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hall | ${name}</title>

    <script src="/socket.io/socket.io.js"></script>
    <script src="../../app/scripts/client.js"></script>
    <script src="../../app/scripts/table.js"></script>
    
    <link rel="stylesheet" href="../../styles/app.css">
    
    <script>
      let appClient

      document.addEventListener('DOMContentLoaded', function () {
      appClient = new Client();
});
    </script>
</head>
<body>
      
  <h1>Table: ${name}</h1>
  <a href='../../app'> - Back</a>

  <br><br>

  <ul id="messages"></ul>
    <form id="form" action="">
        <input id="message-input" autocomplete="off" /><button>Send</button>
    </form>
      
</body>
</html>
  
    `
  }
}