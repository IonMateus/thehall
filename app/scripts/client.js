
class Client {
    constructor() {
        this.socket = io();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        this.socket.on('message', (data) => {
            this.handleMessage(data);
        });

        this.socket.on('connect', () => {
            console.log('Connected to server:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
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

