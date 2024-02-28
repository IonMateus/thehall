const socket = io()
const roomList = document.getElementById('roomList')

socket.on('updateRooms', (roomNames) => {
    roomList.innerHTML = ''
    roomNames.forEach((room) => {
        const button = document.createElement('button')
        button.innerText = room
        button.style.margin = "20px"
        button.style.boxShadow = "5px 5px 5px aqua"
        button.className = "relative bg-gray-800 text-white-300 font-bold py-2 px-4 rounded overflow-hidden hover:bg-gray-700 transition duration-300"
        const span = document.createElement('span')
        span.className = "absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 opacity-25 hover:opacity-0 transition duration-300"
        button.appendChild(span)
        button.addEventListener('click', () => goToRoom(room))
        roomList.appendChild(button)
    })
})


socket.on("updateInformations", (data) =>{
    let accessCounter = document.getElementById("accessCounter")
    let roomsCreatedCounter = document.getElementById("roomsCreatedCounter")
    let messagesCounter = document.getElementById("messagesCounter")
    document.getElementById("serverDate").innerText = "*Since: "+ data.serverDate + " (Server date)"
    messagesCounter.innerText = `- Messages: ${data.messages}`
    accessCounter.innerText = `- Access: ${data.access}`
    roomsCreatedCounter.innerText = `- Rooms created: ${data.roomsCreated}`
})
    

socket.on("updateNumberOfClients",(number)=>{
    const counter = document.getElementById("numberOfClients")
    counter.innerHTML = `Guests: ${number}`
})


function createRoom() {
    form = document.getElementById("roomForm")
    form.style.display = "block"
    roomNameInput = document.getElementById("roomNameInput")
    roomPasswordInput = document.getElementById("roomPasswordInput")
    const roomName = roomNameInput.value
    if(roomName !== null && roomName !== ""){
    const password = roomPasswordInput.value
    if (roomName && password !== null) {
        socket.emit('createRoom', {roomName: roomName, password: password})
        window.location.href = `./room/${roomName}`
    }
    }
}


function goToRoom(roomName) {
    window.location.href = `/room/${roomName}`
}
