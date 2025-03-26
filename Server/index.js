const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const users = {}; // Store connected users with socket IDs as keys

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle username registration
    socket.on("join_chat", (username) => {
        // Validate username
        if (typeof username !== 'string' || !['alice', 'bob'].includes(username.toLowerCase())) {
            socket.emit("error", "Invalid username. Only Alice/Bob allowed");
            return;
        }

        // Check if username is already taken
        if (Object.values(users).includes(username)) {
            socket.emit("username_taken", "Username already in use");
            return;
        }

        // Register user
        users[socket.id] = username;
        console.log(`${username} joined the chat`);
        
        // Notify all clients
        io.emit("update_users", Object.values(users));
        socket.emit("join_success", `Joined as ${username}`);
    });

    // Handle message sending
    socket.on("send_message", (message) => {
        const sender = users[socket.id];
        
        // Verify user is registered
        if (!sender) {
            socket.emit("error", "Join the chat before sending messages");
            return;
        }

        // Validate message
        if (typeof message !== 'string' || message.trim() === '') {
            socket.emit("error", "Invalid message");
            return;
        }

        const data = { sender, message: message.trim() };
        console.log(`Message from ${data.sender}: ${data.message}`);
        io.emit("receive_message", data); // Broadcast verified message
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        const username = users[socket.id];
        if (username) {
            console.log(`${username} disconnected`);
            delete users[socket.id];
            io.emit("update_users", Object.values(users));
        }
    });
});

server.listen(8001, () => {
    console.log("Secure chat server running on port 8001");
});