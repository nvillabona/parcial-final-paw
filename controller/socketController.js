const Message = require("../models/message");

const users = []

const socketController = async(socket, io) => {
    users.push(socket.id)
    io.emit('active-users', users)
    console.log('A user connected');
    try {
        // Load chat history from MongoDB
        const messages = await Message.find().sort({ timestamp: 1 });

        // Emit chat history to the connected user
        if(messages.length > 0){
            socket.emit('chat history', messages);
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }

    // Handle chat messages
    socket.on('chat message', async (msg) => {
        console.log('Message received:', msg);

        // Save the message to MongoDB
        const message = new Message({
            user: socket.id,
            content: msg,
            timestamp: new Date()
        });
        await message.save();

        // Broadcast the message to all connected clients
        io.emit('chat message', {content:msg, user: socket.id});
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.id),1)
        console.log('A user disconnected');
        io.emit('active-users', users)
    });
}

module.exports = { socketController }