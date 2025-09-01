// Initialize Socket.io connection
const socket = io();

// DOM elements
const joinForm = document.getElementById("joinForm");
const usernameInput = document.getElementById("usernameInput");
const roomSelect = document.getElementById("roomSelect");
const joinButton = document.getElementById("joinButton");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesArea = document.getElementById("messagesArea");
const statusIndicator = document.getElementById("statusIndicator");
const statusText = document.getElementById("statusText");
const leaveRoomButton = document.getElementById("leaveRoomButton");
const chatTitle = document.getElementById("chatTitle");
const roomInfo = document.getElementById("roomInfo");
const currentRoomName = document.getElementById("currentRoomName");
const roomStatus = document.getElementById("roomStatus");
const userListSection = document.getElementById("userListSection");
const userList = document.getElementById("userList");

// Current user state
let currentUser = {
  username: null,
  room: null,
  socketId: null,
};

// Connection status handling
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
  currentUser.socketId = socket.id;
  updateConnectionStatus(true);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  updateConnectionStatus(false);
});

// Handle available rooms
socket.on("availableRooms", (rooms) => {
  console.log("Available rooms:", rooms);
  // Rooms are already populated in HTML select
});

// Handle room joining
socket.on("roomJoined", (data) => {
  console.log("Joined room:", data);
  currentUser.room = data.room;

  // Update UI for joined room
  showRoomInterface();
  addMessageToChat(data.message, "system");

  // Update chat title
  chatTitle.textContent = `${data.room} Room`;
  currentRoomName.textContent = data.room;
});

// Handle room leaving
socket.on("roomLeft", (data) => {
  console.log("Left room:", data);
  currentUser.room = null;

  // Reset UI
  showJoinInterface();
  addMessageToChat(data.message, "system");

  // Clear messages
  messagesArea.innerHTML = "";

  // Update chat title
  chatTitle.textContent = "Welcome to Chat App";
});

// Handle user joining room (other users)
socket.on("userJoined", (data) => {
  console.log("User joined:", data);
  addMessageToChat(data.message, "system");
});

// Handle user leaving room (other users)
socket.on("userLeft", (data) => {
  console.log("User left:", data);
  addMessageToChat(data.message, "system");
});

// Handle incoming messages from other users
socket.on("newMessage", (messageData) => {
  console.log("Received message:", messageData);

  // Determine if this message is from the current user or another user
  const isOwnMessage = messageData.userId === currentUser.socketId;
  const messageType = isOwnMessage ? "sent" : "received";

  addMessageToChat(
    messageData.message,
    messageType,
    messageData.timestamp,
    messageData.username
  );
});

// Handle room user list updates
socket.on("roomUsers", (data) => {
  console.log("Room users updated:", data);
  updateUserList(data.users);
});

// Handle errors
socket.on("error", (errorMessage) => {
  console.error("Server error:", errorMessage);
  addMessageToChat(`Error: ${errorMessage}`, "system");
});

// Handle join form submission
joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const roomName = roomSelect.value;

  if (username && roomName) {
    // Disable join button during processing
    joinButton.disabled = true;
    joinButton.textContent = "Joining...";

    // Send join room request
    socket.emit("joinRoom", {
      username: username,
      roomName: roomName,
    });

    // Store username
    currentUser.username = username;
  }
});

// Handle message form submission
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageText = messageInput.value.trim();

  if (messageText && currentUser.room) {
    // Send message to server
    socket.emit("sendMessage", {
      message: messageText,
    });

    // Clear input field
    messageInput.value = "";

    // Focus back to input for better UX
    messageInput.focus();
  }
});

// Handle Enter key press in input field
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    messageForm.dispatchEvent(new Event("submit"));
  }
});

// Handle leave room button
leaveRoomButton.addEventListener("click", () => {
  if (currentUser.room) {
    socket.emit("leaveRoom");
  }
});

// Function to show room interface (after joining)
function showRoomInterface() {
  // Hide join section
  document.querySelector(".joinSection").style.display = "none";

  // Show room info and user list
  roomInfo.style.display = "block";
  userListSection.style.display = "block";

  // Enable message input
  messageInput.disabled = false;
  sendButton.disabled = false;

  // Show leave room button
  leaveRoomButton.style.display = "block";

  // Focus on message input
  messageInput.focus();
}

// Function to show join interface (after leaving)
function showJoinInterface() {
  // Show join section
  document.querySelector(".joinSection").style.display = "block";

  // Hide room info and user list
  roomInfo.style.display = "none";
  userListSection.style.display = "none";

  // Disable message input
  messageInput.disabled = true;
  sendButton.disabled = true;

  // Hide leave room button
  leaveRoomButton.style.display = "none";

  // Reset join button
  joinButton.disabled = false;
  joinButton.textContent = "Join Room";

  // Clear user list
  userList.innerHTML = "";
}

// Function to add messages to the chat area
function addMessageToChat(
  messageText,
  messageType,
  timestamp = null,
  username = null
) {
  const messageElement = document.createElement("div");
  messageElement.className = `messageItem ${messageType}`;

  // Add message header for user messages
  if (messageType !== "system" && username) {
    const messageHeader = document.createElement("div");
    messageHeader.className = "messageHeader";

    const usernameElement = document.createElement("div");
    usernameElement.className = "messageUsername";
    usernameElement.textContent = username;

    const timeElement = document.createElement("div");
    timeElement.className = "messageTime";
    timeElement.textContent = timestamp || new Date().toLocaleTimeString();

    messageHeader.appendChild(usernameElement);
    messageHeader.appendChild(timeElement);
    messageElement.appendChild(messageHeader);
  }

  const messageContent = document.createElement("div");
  messageContent.className = "messageText";
  messageContent.textContent = messageText;
  messageElement.appendChild(messageContent);

  // Add timestamp for system messages
  if (messageType === "system" && timestamp) {
    const timeElement = document.createElement("div");
    timeElement.className = "messageTime";
    timeElement.textContent = timestamp;
    messageElement.appendChild(timeElement);
  }

  // Add message to chat area
  messagesArea.appendChild(messageElement);

  // Auto-scroll to bottom
  messagesArea.scrollTop = messagesArea.scrollHeight;

  // Add smooth animation
  messageElement.style.opacity = "0";
  messageElement.style.transform = "translateY(10px)";

  setTimeout(() => {
    messageElement.style.transition = "all 0.3s ease";
    messageElement.style.opacity = "1";
    messageElement.style.transform = "translateY(0)";
  }, 10);
}

// Function to update user list
function updateUserList(users) {
  userList.innerHTML = "";

  users.forEach((username) => {
    const userItem = document.createElement("li");
    userItem.className = "userItem";

    const userAvatar = document.createElement("div");
    userAvatar.className = "userAvatar";
    userAvatar.textContent = username.charAt(0).toUpperCase();

    const userName = document.createElement("div");
    userName.className = "userName";
    userName.textContent = username;

    userItem.appendChild(userAvatar);
    userItem.appendChild(userName);
    userList.appendChild(userItem);
  });
}

// Function to update connection status
function updateConnectionStatus(isConnected) {
  if (isConnected) {
    statusIndicator.className = "statusIndicator connected";
    statusText.textContent = "Connected";
  } else {
    statusIndicator.className = "statusIndicator disconnected";
    statusText.textContent = "Disconnected - Trying to reconnect...";
  }
}

// Add some helpful console messages
console.log("Room-based chat client initialized");
console.log("Enter a username and select a room to start chatting!");
