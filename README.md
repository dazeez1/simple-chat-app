# Chat App

A real-time chat application built with WebSockets and Socket.IO, enabling instant messaging with modern features and a clean, responsive interface.

## Description

Simple Chat App is a real-time messaging application that allows users to communicate instantly. Built with modern web technologies, it provides a seamless chat experience with features like message status indicators, user authentication, and multi-room support.

## Features

### Real-time Communication

- Instant message delivery using WebSockets
- Real-time synchronization across all connected devices
- Message status indicators (sent, delivered, read)
- Typing indicators

### User Management

- JWT authentication (register/login/logout)
- User profiles with avatars
- Online/offline status indicators

### Technical Features

- Socket.IO for bidirectional communication
- Automatic reconnection on network issues
- Message queuing for offline users
- File/image upload support
- MongoDB for persistent storage

## Installation & Usage

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/simple-chat-app.git
   cd simple-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/simple-chatapp
   JWT_SECRET=your_secure_jwt_secret_here
   SOCKET_IO_CORS_ORIGIN=http://localhost:5000
   FILE_UPLOAD_LIMIT=5MB
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

### Usage

1. **Register/Login**: Create an account or login to start chatting
2. **Join Rooms**: Enter existing chat rooms or create new ones
3. **Start Chatting**: Send messages, share files, and interact with other users

## Technologies Used

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Testing**: Jest, Socket.IO Client for testing

## Author

**Name**

- Name: Azeez Damilare Gbenga
