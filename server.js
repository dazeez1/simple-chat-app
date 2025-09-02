const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS for production and better connection handling
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://*.onrender.com", "https://simple-chat-app.onrender.com"]
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
  allowEIO3: true,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6
});

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the main chat page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    rooms: availableRooms,
    activeUsers: activeUsers.size,
    totalConnections: io.engine.clientsCount,
  });
});

// Store active users and their room information
const activeUsers = new Map(); // socketId -> { username, room, lastSeen }
const roomUsers = new Map(); // roomName -> Set of socketIds
const userSessions = new Map(); // username -> socketId (for reconnection)

// Available rooms
const availableRooms = ["General", "Sports", "Tech", "Music", "Gaming"];

// Cleanup function to remove stale users
function cleanupStaleUsers() {
  const now = Date.now();
  const staleTimeout = 5 * 60 * 1000; // 5 minutes

  for (const [socketId, userInfo] of activeUsers.entries()) {
    if (now - userInfo.lastSeen > staleTimeout) {
      console.log(`Removing stale user: ${userInfo.username}`);
      removeUserFromRoom(socketId, userInfo.room);
      activeUsers.delete(socketId);

      // Notify other users in the room
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.to(userInfo.room).emit("userLeft", {
          username: userInfo.username,
          room: userInfo.room,
          message: `${userInfo.username} left ${userInfo.room} room (timeout)`,
        });
        sendRoomUserList(userInfo.room);
      }
    }
  }
}

// Run cleanup every minute
setInterval(cleanupStaleUsers, 60000);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send available rooms to new user
  socket.emit("availableRooms", availableRooms);

  // Handle heartbeat/ping
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Handle user joining a room
  socket.on("joinRoom", (userData) => {
    const { username, roomName } = userData;

    // Validate input
    if (!username || !roomName) {
      socket.emit("error", "Username and room name are required");
      return;
    }

    if (username.length > 20) {
      socket.emit("error", "Username must be 20 characters or less");
      return;
    }

    // Validate room name
    if (!availableRooms.includes(roomName)) {
      socket.emit("error", "Invalid room selected");
      return;
    }

    // Check if username is already taken in the room
    const existingUser = Array.from(activeUsers.values()).find(
      (user) => user.username === username && user.room === roomName
    );

    if (existingUser && existingUser.socketId !== socket.id) {
      socket.emit("error", "Username is already taken in this room");
      return;
    }

    // Handle reconnection - if user was already in this room
    const existingSession = userSessions.get(username);
    if (existingSession && existingSession !== socket.id) {
      const oldSocket = io.sockets.sockets.get(existingSession);
      if (oldSocket) {
        oldSocket.disconnect(true);
      }
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
    activeUsers.set(socket.id, {
      username,
      room: roomName,
      lastSeen: Date.now(),
    });

    // Store session for reconnection handling
    userSessions.set(username, socket.id);

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

    // Validate message
    if (!message || typeof message !== "string") {
      socket.emit("error", "Invalid message format");
      return;
    }

    if (message.length > 500) {
      socket.emit("error", "Message too long (max 500 characters)");
      return;
    }

    const { username, room } = userInfo;

    // Update last seen
    userInfo.lastSeen = Date.now();

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
  socket.on("disconnect", (reason) => {
    const userInfo = activeUsers.get(socket.id);
    if (userInfo) {
      const { username, room } = userInfo;

      console.log(
        `${username} disconnected from ${room} room (reason: ${reason})`
      );

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

      // Remove user from active users and sessions
      activeUsers.delete(socket.id);
      userSessions.delete(username);
    } else {
      console.log("User disconnected:", socket.id, "reason:", reason);
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

      // Remove user from active users and sessions
      activeUsers.delete(socket.id);
      userSessions.delete(username);

      socket.emit("roomLeft", {
        message: `You left ${room} room`,
      });
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
    socket.emit("error", "An error occurred. Please try again.");
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

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
  console.log("Available rooms:", availableRooms.join(", "));
  console.log("Open multiple browser tabs to test room-based chat!");
});
