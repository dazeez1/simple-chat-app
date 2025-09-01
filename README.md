# Simple Chat App

A real-time chat application built with WebSockets and Socket.IO, enabling instant messaging with modern features and a clean, responsive interface. Users can join different themed rooms and communicate in real-time with other users.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **Room-based Chat**: Join different themed rooms (General, Sports, Tech, Music, Gaming)
- **User Management**: Username-based authentication with room tracking
- **Live User Lists**: See active users in each room in real-time
- **Join/Leave Notifications**: Get notified when users enter or exit rooms
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with gradients and responsive design
- **Development**: npm for package management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dazeez1/simple-chat-app.git
cd simple-chat-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
# or
node server.js
```

### 4. Access the Application

Open your browser and navigate to: `http://localhost:3000`

## 📖 Usage

### Basic Chat Flow

1. **Enter Username**: Choose a unique username for identification
2. **Select Room**: Pick from available rooms:
   - **General** - General discussions and casual chat
   - **Sports** - Sports news, games, and athletics
   - **Tech** - Technology, programming, and software
   - **Music** - Music, artists, and entertainment
   - **Gaming** - Video games, gaming news, and discussions
3. **Join Room**: Click "Join Room" to enter the selected room
4. **Start Chatting**: Send messages that only appear in your current room
5. **View Users**: See all active users in the left sidebar
6. **Leave Room**: Click "Leave Room" to exit and return to room selection

### Testing with Multiple Users

1. Open multiple browser tabs/windows with `http://localhost:3000`
2. Join different rooms with different usernames
3. Send messages to test room isolation
4. Watch user lists update in real-time
5. Test join/leave notifications

## 🧪 Testing with Postman

### Import Postman Collection

1. Download the `Simple-Chat-App.postman_collection.json` file
2. Open Postman and click "Import"
3. Select the downloaded collection file
4. The collection will be imported with all test cases

### Available Test Categories

#### WebSocket Connection Tests

- **Connect to WebSocket Server**: Tests basic WebSocket connection
- **Get Available Rooms**: Verifies server sends available rooms on connection

#### Room Management Tests

- **Join Room - Valid Room**: Tests joining a valid room with proper notifications
- **Join Room - Invalid Room**: Tests error handling for invalid room selection
- **Leave Room**: Tests room leaving functionality

#### Messaging Tests

- **Send Message - Valid User**: Tests message sending as a valid room member
- **Send Message - No Room**: Tests error handling when sending without joining a room

#### User Management Tests

- **User Disconnection**: Tests user disconnection handling and notifications

#### HTTP Endpoint Tests

- **Get Main Page**: Tests the main chat page endpoint (200 OK)
- **Get Static Files**: Tests CSS and JavaScript file serving

### Running Tests

1. **Start the server**: `npm start`
2. **Open Postman** and load the collection
3. **Run individual tests** or the entire collection
4. **Check test results** in the Postman test runner

### Expected Status Codes

- **200**: Successful HTTP requests (main page, static files)
- **WebSocket Events**: Real-time events for room management and messaging

## 📁 Project Structure

```
simple-chat-app/
├── server.js                          # Express + Socket.io server
├── public/
│   ├── index.html                     # Main chat interface
│   ├── client.js                      # Frontend Socket.io logic
│   └── style.css                      # Styling and responsive design
├── package.json                       # Dependencies and scripts
├── Simple-Chat-App.postman_collection.json  # Postman test collection
├── README.md                          # Project documentation
├── config/                            # Configuration files
├── controllers/                       # Business logic handlers
├── middleware/                        # Custom middleware
├── models/                            # Database models
├── routes/                            # API route definitions
└── tests/                             # Test files
```

## 🔧 API Documentation

### WebSocket Events

#### Client to Server Events

| Event         | Data                   | Description                    |
| ------------- | ---------------------- | ------------------------------ |
| `joinRoom`    | `{username, roomName}` | Join a specific chat room      |
| `sendMessage` | `{message}`            | Send a message to current room |
| `leaveRoom`   | -                      | Leave current room             |

#### Server to Client Events

| Event            | Data                                           | Description                |
| ---------------- | ---------------------------------------------- | -------------------------- |
| `availableRooms` | `Array<string>`                                | List of available rooms    |
| `roomJoined`     | `{room, message}`                              | Confirmation of room join  |
| `userJoined`     | `{username, room, message}`                    | User joined notification   |
| `userLeft`       | `{username, room, message}`                    | User left notification     |
| `newMessage`     | `{message, username, room, timestamp, userId}` | New message received       |
| `roomUsers`      | `{room, users}`                                | Updated user list for room |
| `roomLeft`       | `{message}`                                    | Confirmation of room leave |
| `error`          | `string`                                       | Error message              |

### HTTP Endpoints

| Method | Endpoint     | Description       | Status Code |
| ------ | ------------ | ----------------- | ----------- |
| GET    | `/`          | Main chat page    | 200         |
| GET    | `/style.css` | CSS styles        | 200         |
| GET    | `/client.js` | JavaScript client | 200         |

## 🎯 Available Rooms

- **General**: General discussions and casual chat
- **Sports**: Sports news, games, and athletics
- **Tech**: Technology, programming, and software
- **Music**: Music, artists, and entertainment
- **Gaming**: Video games, gaming news, and discussions

## 🚀 Deployment

### Local Development

```bash
npm start
```

### Production Deployment

1. Set environment variables:

   ```bash
   export PORT=3000
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. The application will be available at `http://localhost:3000`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Test all changes with the provided Postman collection
- Ensure responsive design works on all devices
- Follow existing code style and conventions
- Add appropriate error handling
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Azeez Damilare Gbenga**

- GitHub: [@dazeez1](https://github.com/dazeez1)

## 🙏 Acknowledgments

- Socket.IO team for the excellent real-time communication library
- Express.js community for the robust web framework
- All contributors and testers who helped improve this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/dazeez1/simple-chat-app/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Provide your environment details (OS, Node.js version, etc.)

---

**Ready to chat? Start the server and join a room! 🚀**
