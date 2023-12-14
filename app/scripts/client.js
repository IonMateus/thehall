
class Client {
    constructor() {
        this.socket = io();
        this.setupEventListeners();
        this.mask = "../../images/userIcon.png"
    }

    setupEventListeners() {
        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        this.socket.on('message', (data) => {
            this.handleMessage(data);
        });
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (message) {
            this.socket.emit('message', message);
            messageInput.value = '';
        }
    }

    handleMessage(data) {
        const messagesList = document.getElementById('messages');
        const listItem = document.createElement('li');
        listItem.textContent = data;
        messagesList.appendChild(listItem);
    }
}

