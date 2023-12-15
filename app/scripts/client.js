
class Client {
    constructor() {
        this.socket = io();
        this.setupEventListeners();
        this.mask = "../../images/userIcon.png"
        this.requestTables()
    }

    setupEventListeners() {
        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        this.socket.on('userCounter', (value) => {
            document.getElementById("usersCounter").innerHTML = `Participants: ${value}`
        });

        this.socket.on('message', (message) => {
            this.handleMessage(message);
        });

        this.socket.on('sendTables', (tables) => {
            console.log(tables)
            for(let i=0;i<tables.length;i++){
                addTable(tables[i].name)
            }
        });

        this.socket.on('sendTable', (table) => {
            addTable(table.name)
        });

    }

    requestTables(){
        this.socket.emit('requestTables');
    }

    sendTable(table){
        this.socket.emit('sendTable', table);
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (message) {
            this.socket.emit('message', message);
            messageInput.value = '';
        }
    }

    handleMessage(message) {
        const messagesList = document.getElementById('messages');
        const listItem = document.createElement('li');
        listItem.textContent = message;
        messagesList.appendChild(listItem);
        messagesList.scrollTop = messagesList.scrollHeight;
    }
}

