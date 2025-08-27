# Simple Chat App

A real-time chat application built with WebSockets and Socket.IO, enabling instant messaging with modern features and a clean, responsive interface.

## Project Status

### **Completed: Task 56A - Mini Real-Time Chat App**

- **Real-time messaging** using Socket.io
- **Broadcast functionality** - messages appear on all connected clients
- **Modern UI** with gradient design and smooth animations
- **Connection status indicator** with visual feedback
- **Message timestamps** and auto-scroll functionality
- **Responsive design** that works on all devices

### **Currently Working Features**

- ✅ Real-time message broadcasting
- ✅ Multiple user connections
- ✅ Beautiful chat interface
- ✅ Connection status monitoring
- ✅ Message styling (sent vs received)
- ✅ Auto-scroll to latest messages
- ✅ Smooth animations and transitions

## Description

Simple Chat App is a real-time messaging application that allows users to communicate instantly. Built with modern web technologies, it provides a seamless chat experience with features like message status indicators, user authentication, and multi-room support.

## Features

### Real-time Communication

- ✅ Instant message delivery using WebSockets
- ✅ Real-time synchronization across all connected devices
- ✅ Message status indicators (sent, delivered, read)
- 🔄 Typing indicators (planned)

### User Management

- 🔄 JWT authentication (register/login/logout) - planned
- 🔄 User profiles with avatars - planned
- 🔄 Online/offline status indicators - planned

### Technical Features

- ✅ Socket.IO for bidirectional communication
- ✅ Automatic reconnection on network issues
- 🔄 Message queuing for offline users - planned
- 🔄 File/image upload support - planned
- 🔄 MongoDB for persistent storage - planned

## Quick Start (Current Working Version)

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dazeez1/simple-chat-app.git
   cd simple-chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   # or
   node server.js
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - Open multiple browser tabs to test real-time chat

### Testing Real-Time Chat

1. Start the server: `node server.js`
2. Open `http://localhost:3000` in your browser
3. Open another browser tab with the same URL
4. Start typing messages in either tab
5. Watch messages appear in real-time across both tabs!

## 📁 Project Structure

```
simple-chat-app/
├── server.js              # Express + Socket.io server ✅
├── public/
│   ├── index.html         # Chat interface ✅
│   └── client.js          # Frontend Socket.io logic ✅
├── package.json           # Dependencies and scripts ✅
├── MINI_CHAT_README.md    # Task 56A documentation ✅
├── config/                # Configuration files (planned)
├── controllers/           # Business logic handlers (planned)
├── middleware/            # Custom middleware (planned)
├── models/                # Database models (planned)
├── routes/                # API route definitions (planned)
└── tests/                 # Test files (planned)
```

## Technologies Used

### **Currently Implemented**

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with gradients and animations

### **Planned for Future**

- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Testing**: Jest, Socket.IO Client for testing

## 📝 License

This project is licensed under the ISC License.

## Author

**Azeez Damilare Gbenga**

- GitHub: [@dazeez1](https://github.com/dazeez1)
- Project: Simple Chat App

---
