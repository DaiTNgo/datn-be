require('dotenv').config();
const http = require('http');
const socket = require('socket.io');
const app = require('./app');
const DB = require('./config/db');

const PORT = process.env.PORT || 5000;
const server = http.Server(app);

const io = socket(server, {
    cors: {
        origin: 'https://datn-fe.netlify.app',
        methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: false,
    },
});
globalThis.io = io;

io.on('connection', (socket) => {
    socket.on('daingo', (msg) => {
        socket.emit('test', `Message::::::${msg}`);
    });
    console.log('a user connected');
});

server.listen(PORT, async () => {
    console.log(`Listening on ${PORT}`);
    DB.connect();
});
