# Simple Chat App

A real-time, room-based chat application built with Node.js, Express, and Socket.io. Features persistent chat history, automatic reconnection, and a modern UI.

## ✨ Features

### Core Features

- **Room-based Chat**: Join different chat rooms (General, Sports, Tech, Music, Gaming)
- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Management**: See active users in each room
- **Modern UI**: Clean, responsive design with smooth animations

### 🚀 New Improvements (Latest Update)

#### 1. **Connection Stability**

- **Automatic Reconnection**: Client automatically reconnects if connection is lost
- **Heartbeat Mechanism**: Regular ping/pong to detect connection issues
- **Connection Monitoring**: Proactive connection health checks
- **Graceful Error Handling**: Better error messages and recovery

#### 2. **Local Storage & Persistence**

- **Chat History Persistence**: Messages are saved locally and restored on page reload
- **User State Persistence**: Username and room selection are remembered
- **Auto-rejoin**: Automatically rejoin the last room when reconnecting
- **Clear Chat Function**: Option to clear chat history when needed

#### 3. **Enhanced User Experience**

- **Connection Status Indicator**: Visual indicator showing connection status
- **Loading States**: Better feedback during connection and room joining
- **Page Visibility Handling**: Maintains connection when switching tabs
- **Input Validation**: Username and message length validation

#### 4. **Server Improvements**

- **Stale User Cleanup**: Automatically removes inactive users
- **Session Management**: Prevents duplicate usernames in rooms
- **Graceful Shutdown**: Proper server shutdown handling
- **Enhanced Logging**: Better debugging and monitoring

## 🛠️ Technical Details

### Connection Stability Features

```javascript
// Socket.io configuration with reconnection
const socket = io({
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
});

// Heartbeat mechanism
setInterval(() => {
  if (socket.connected) {
    socket.emit("ping");
  }
}, 30000);
```

### Local Storage Implementation

```javascript
// Save user state
const state = {
  username: currentUser.username,
  room: currentUser.room,
  timestamp: Date.now(),
};
localStorage.setItem("chat_user_state", JSON.stringify(state));

// Save messages
localStorage.setItem("chat_messages", JSON.stringify(chatMessages));
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd simple-chat-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   npm start
   # or
   node server.js
   ```

4. **Open the application**
   - Main app: http://localhost:3000
   - Test page: http://localhost:3000/test-improvements.html

## 📱 Usage

### Basic Usage

1. Enter your username (max 20 characters)
2. Select a chat room
3. Click "Join Room" to start chatting
4. Type messages and press Enter to send

### Advanced Features

- **Auto-reconnection**: If you lose connection, the app will automatically reconnect
- **Persistent Chat**: Your messages and room selection are saved locally
- **Clear Chat**: Use the "Clear Chat" button to remove chat history
- **Connection Status**: Monitor your connection status in the header

### Testing the Improvements

1. Open the test page: `test-improvements.html`
2. Run the connection and local storage tests
3. Test the main app with multiple browser tabs
4. Try refreshing the page to see persistence in action

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Available Rooms

- General
- Sports
- Tech
- Music
- Gaming

## 🐛 Troubleshooting

### Common Issues

1. **Connection Issues**

   - Check if the server is running on port 3000
   - Verify firewall settings
   - Try refreshing the page

2. **Local Storage Issues**

   - Ensure cookies are enabled
   - Check browser storage settings
   - Try clearing browser data

3. **Message Not Sending**
   - Check connection status indicator
   - Verify you're in a room
   - Try reconnecting

### Debug Mode

Open browser console to see detailed connection logs and error messages.

## 📊 Performance

### Optimizations

- **Message Limit**: Only last 100 messages are stored locally
- **Connection Pooling**: Efficient Socket.io connection management
- **Memory Management**: Automatic cleanup of stale connections
- **Error Recovery**: Graceful handling of network issues

## 🔒 Security

### Features

- **Input Validation**: Username and message length limits
- **XSS Protection**: Content sanitization
- **CORS Configuration**: Proper cross-origin settings
- **Session Management**: Prevents duplicate usernames

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the browser console for errors
3. Test with the provided test page
4. Create an issue with detailed information

---

**Note**: This chat app is designed for development and testing purposes. For production use, consider adding authentication, database persistence, and additional security measures.
