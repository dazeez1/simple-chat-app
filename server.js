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

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle incoming messages from clients
  socket.on("sendMessage", (messageData) => {
    console.log("Message received:", messageData);

    // Broadcast the message to all connected clients
    io.emit("newMessage", {
      message: messageData.message,
      timestamp: new Date().toLocaleTimeString(),
      userId: socket.id,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
  console.log("Open two browser tabs to test real-time chat!");
});
