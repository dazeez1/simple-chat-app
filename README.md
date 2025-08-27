# Simple Chat App

A real-time chat application built with WebSockets and Socket.IO, enabling instant messaging with modern features and a clean, responsive interface.

## Project Status

### **Completed: Full Chat App with Rooms + User List**

- **Room-based messaging** with 5 different chat rooms (General, Sports, Tech, Music, Gaming)
- **User management** with usernames and room tracking
- **Real-time user lists** showing active users in each room
- **Join/Leave notifications** when users enter or exit rooms
- **Room-specific messaging** - messages only appear in the selected room
- **Enhanced UI** with sidebar layout and modern styling
- **Responsive design** that works on all devices

## Description

Simple Chat App is a real-time messaging application that allows users to communicate instantly in different themed rooms. Built with modern web technologies, it provides a seamless chat experience with room-based messaging, user management, and real-time user tracking.

## Features

### Real-time Communication

- ✅ Instant message delivery using WebSockets
- ✅ Room-based messaging with Socket.io rooms
- ✅ Real-time synchronization across all connected devices
- ✅ Message status indicators (sent, delivered, read)
- 🔄 Typing indicators (planned)

### User Management

- ✅ Username-based authentication
- ✅ Room joining and leaving
- ✅ Real-time user lists per room
- ✅ Join/Leave notifications

### Technical Features

- ✅ Socket.IO for bidirectional communication
- ✅ Room management with socket.join() and socket.leave()
- ✅ Automatic reconnection on network issues
- ✅ User tracking per room

## Quick Start

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
   - Open multiple browser tabs to test room-based chat

### Testing Room-Based Chat

1. **Start the server:** `node server.js`
2. **Open multiple browser tabs** with `http://localhost:3000`
3. **Join different rooms:**
   - Enter a username (e.g., "Alice", "Bob", "Charlie")
   - Select a room (General, Sports, Tech, Music, Gaming)
   - Click "Join Room"
4. **Test room functionality:**
   - Send messages in different rooms
   - See messages only appear in the same room
   - Watch user lists update in real-time
   - Test join/leave notifications
   - Try switching between rooms

### How to Use Rooms

1. **Enter Username:** Choose a unique username
2. **Select Room:** Pick from available rooms:
   - **General** - General discussions
   - **Sports** - Sports and athletics
   - **Tech** - Technology and programming
   - **Music** - Music and entertainment
   - **Gaming** - Video games and gaming
3. **Join Room:** Click "Join Room" to enter the selected room
4. **Start Chatting:** Send messages that only appear in your current room
5. **View Users:** See all active users in the left sidebar
6. **Leave Room:** Click "Leave Room" to exit and return to room selection

## Project Structure

```
simple-chat-app/
├── server.js              # Express + Socket.io server with room management
├── public/
│   ├── index.html         # Room-based chat interface
│   ├── client.js          # Frontend Socket.io logic with room handling
│   └── style.css          # Enhanced styling for room interface
├── package.json           # Dependencies and scripts
├── config/                # Configuration files
├── controllers/           # Business logic handlers
├── middleware/            # Custom middleware
├── models/                # Database models
├── routes/                # API route definitions
└── tests/                 # Test files
```

## Technologies Used

### **Currently Implemented**

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO with room management
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with gradients, animations, and responsive design
- **Room Management**: Socket.io rooms with user tracking

## Room Features

### **Available Rooms**

- **General** - General discussions and casual chat
- **Sports** - Sports news, games, and athletics
- **Tech** - Technology, programming, and software
- **Music** - Music, artists, and entertainment
- **Gaming** - Video games, gaming news, and discussions

### **Room Functionality**

- **Isolated Messaging**: Messages only appear in the selected room
- **User Tracking**: Real-time list of active users in each room
- **Join Notifications**: System messages when users join
- **Leave Notifications**: System messages when users leave
- **Room Switching**: Users can leave and join different rooms
- **Connection Status**: Visual indicator of connection state

## Contributing

This project is currently in active development. Feel free to contribute by:

1. Testing the room-based features
2. Reporting bugs or issues
3. Suggesting new room themes or features
4. Contributing code improvements

## License

This project is licensed under the ISC License.

## Author

**Azeez Damilare Gbenga**

- GitHub: [@dazeez1](https://github.com/dazeez1)
