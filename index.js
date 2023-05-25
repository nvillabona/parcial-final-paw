const express = require('express');
require('dotenv').config();

const { dbConnection } = require('./database/config');
const Message = require('./models/message');
const { socketController } = require('./controller/socketController');

const app = express()
const port = process.env.PORT;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// Database connection
dbConnection();

// Socket.IO setup
io.on('connection', socket => socketController(socket, io));

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});