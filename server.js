const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the main chat page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Store active users and their room information
const activeUsers = new Map(); // socketId -> { username, room }
const roomUsers = new Map(); // roomName -> Set of socketIds

// Available rooms
const availableRooms = ["General", "Sports", "Tech", "Music", "Gaming"];

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send available rooms to new user
  socket.emit("availableRooms", availableRooms);

  // Handle user joining a room
  socket.on("joinRoom", (userData) => {
    const { username, roomName } = userData;

    // Validate room name
    if (!availableRooms.includes(roomName)) {
      socket.emit("error", "Invalid room selected");
      return;
    }

    // Leave previous room if any
    const previousRoom = activeUsers.get(socket.id)?.room;
    if (previousRoom) {
      socket.leave(previousRoom);
      removeUserFromRoom(socket.id, previousRoom);
    }

    // Join new room
    socket.join(roomName);

    // Store user information
    activeUsers.set(socket.id, { username, room: roomName });

    // Add user to room
    if (!roomUsers.has(roomName)) {
      roomUsers.set(roomName, new Set());
    }
    roomUsers.get(roomName).add(socket.id);

    console.log(`${username} joined ${roomName} room`);

    // Send welcome message to the user
    socket.emit("roomJoined", {
      room: roomName,
      message: `Welcome to ${roomName} room, ${username}!`,
    });

    // Notify other users in the room
    socket.to(roomName).emit("userJoined", {
      username,
      room: roomName,
      message: `${username} joined ${roomName} room`,
    });

    // Send updated user list to all users in the room
    sendRoomUserList(roomName);
  });

  // Handle incoming messages from clients
  socket.on("sendMessage", (messageData) => {
    const userInfo = activeUsers.get(socket.id);
    if (!userInfo) {
      socket.emit("error", "Please join a room first");
      return;
    }

    const { message } = messageData;
    const { username, room } = userInfo;

    console.log(`Message from ${username} in ${room}:`, message);

    // Broadcast the message only to users in the same room
    io.to(room).emit("newMessage", {
      message,
      username,
      room,
      timestamp: new Date().toLocaleTimeString(),
      userId: socket.id,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const userInfo = activeUsers.get(socket.id);
    if (userInfo) {
      const { username, room } = userInfo;

      console.log(`${username} disconnected from ${room} room`);

      // Remove user from room
      removeUserFromRoom(socket.id, room);

      // Notify other users in the room
      socket.to(room).emit("userLeft", {
        username,
        room,
        message: `${username} left ${room} room`,
      });

      // Send updated user list to remaining users
      sendRoomUserList(room);

      // Remove user from active users
      activeUsers.delete(socket.id);
    } else {
      console.log("User disconnected:", socket.id);
    }
  });

  // Handle user leaving room manually
  socket.on("leaveRoom", () => {
    const userInfo = activeUsers.get(socket.id);
    if (userInfo) {
      const { username, room } = userInfo;

      socket.leave(room);
      removeUserFromRoom(socket.id, room);

      // Notify other users
      socket.to(room).emit("userLeft", {
        username,
        room,
        message: `${username} left ${room} room`,
      });

      // Send updated user list
      sendRoomUserList(room);

      // Remove user from active users
      activeUsers.delete(socket.id);

      socket.emit("roomLeft", {
        message: `You left ${room} room`,
      });
    }
  });
});

// Helper function to remove user from room
function removeUserFromRoom(socketId, roomName) {
  const roomUserSet = roomUsers.get(roomName);
  if (roomUserSet) {
    roomUserSet.delete(socketId);
    if (roomUserSet.size === 0) {
      roomUsers.delete(roomName);
    }
  }
}

// Helper function to send user list to all users in a room
function sendRoomUserList(roomName) {
  const roomUserSet = roomUsers.get(roomName);
  if (roomUserSet) {
    const usersInRoom = Array.from(roomUserSet)
      .map((socketId) => {
        const userInfo = activeUsers.get(socketId);
        return userInfo ? userInfo.username : null;
      })
      .filter((username) => username !== null);

    io.to(roomName).emit("roomUsers", {
      room: roomName,
      users: usersInRoom,
    });
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
  console.log("Available rooms:", availableRooms.join(", "));
  console.log("Open multiple browser tabs to test room-based chat!");
});
