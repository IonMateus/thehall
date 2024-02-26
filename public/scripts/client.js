const socket = io();
const roomList = document.getElementById('roomList');

socket.on('updateRooms', (roomNames) => {
    roomList.innerHTML = '';
    roomNames.forEach((room) => {
        const button = document.createElement('button');
        button.innerText = room;
        button.style.margin = "20px"
        button.style.boxShadow = "5px 5px 5px aqua"
        button.className = "relative bg-gray-800 text-white-300 font-bold py-2 px-4 rounded overflow-hidden hover:bg-gray-700 transition duration-300";
        const span = document.createElement('span');
        span.className = "absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 opacity-25 hover:opacity-0 transition duration-300";
        button.appendChild(span);
        button.addEventListener('click', () => goToRoom(room));
        roomList.appendChild(button);
    });
});


socket.on("updateInformations", (data) =>{
    let accessCounter = document.getElementById("accessCounter")
    let roomsCreatedCounter = document.getElementById("roomsCreatedCounter")
    accessCounter.innerText = `- Access: ${data.access}`
    roomsCreatedCounter.innerText = `- Rooms created: ${data.roomsCreated}`
})
    

socket.on("updateNumberOfClients",(number)=>{
    const counter = document.getElementById("numberOfClients")
    counter.innerHTML = `Clients: ${number}`
})

function createRoom() {
    const roomName = prompt('Enter room name (letters only):');
    if(roomName !== null && roomName !== ""){
    const password = prompt("Password: (Just confirm if you want a public room)")
    if (roomName && password !== null) {
        socket.emit('createRoom', {roomName: roomName, password: password});
        window.location.href = `./room/${roomName}`
    }
    }
}

function goToRoom(roomName) {
    window.location.href = `/room/${roomName}`;
}
