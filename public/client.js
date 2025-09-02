// Initialize Socket.io connection with very lenient reconnection options
const socket = io({
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 200,
  reconnectionDelayMax: 1000,
  timeout: 5000,
  autoConnect: true,
  transports: ["websocket", "polling"],
  forceNew: false,
  multiplex: false,
});

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
const clearChatButton = document.getElementById("clearChatButton");
const chatTitle = document.getElementById("chatTitle");
const roomInfo = document.getElementById("roomInfo");
const currentRoomName = document.getElementById("currentRoomName");
const roomStatus = document.getElementById("roomStatus");
const userListSection = document.getElementById("userListSection");
const userList = document.getElementById("userList");

// Local storage keys
const STORAGE_KEYS = {
  USERNAME: "chat_username",
  ROOM: "chat_room",
  MESSAGES: "chat_messages",
  USER_STATE: "chat_user_state",
};

// Current user state
let currentUser = {
  username: null,
  room: null,
  socketId: null,
};

// Chat messages storage
let chatMessages = [];

// Connection monitoring - VERY LENIENT for stability
let heartbeatInterval;
let connectionMonitorInterval;
let lastPongTime = Date.now();
let connectionEstablished = false;

// Initialize app with saved state
function initializeApp() {
  loadSavedState();
  loadSavedMessages();

  // If user was previously in a room, auto-join
  if (currentUser.username && currentUser.room) {
    autoJoinRoom();
  }

  // Start minimal connection monitoring after 15 seconds
  setTimeout(() => {
    startMinimalConnectionMonitoring();
  }, 15000);
}

// Start minimal connection monitoring - very lenient
function startMinimalConnectionMonitoring() {
  // Only send heartbeat every 3 minutes (very infrequent)
  heartbeatInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit("ping");
    }
  }, 180000); // 3 minutes

  // Only check connection health every 10 minutes (very infrequent)
  connectionMonitorInterval = setInterval(() => {
    const now = Date.now();
    const timeSinceLastPong = now - lastPongTime;

    // Only reconnect if no pong received for more than 15 minutes (very lenient)
    if (
      timeSinceLastPong > 900000 &&
      socket.connected &&
      connectionEstablished
    ) {
      console.log("Very long time without heartbeat, gentle reconnection...");
      // Don't disconnect, just try to reconnect gently
      if (!socket.connected) {
        socket.connect();
      }
    }
  }, 600000); // 10 minutes
}

// Stop connection monitoring
function stopConnectionMonitoring() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  if (connectionMonitorInterval) {
    clearInterval(connectionMonitorInterval);
  }
}

// Load saved user state from localStorage
function loadSavedState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEYS.USER_STATE);
    if (savedState) {
      const state = JSON.parse(savedState);
      currentUser.username = state.username;
      currentUser.room = state.room;

      // Pre-fill form fields
      if (currentUser.username) {
        usernameInput.value = currentUser.username;
      }
      if (currentUser.room) {
        roomSelect.value = currentUser.room;
      }
    }
  } catch (error) {
    console.error("Error loading saved state:", error);
  }
}

// Save user state to localStorage
function saveUserState() {
  try {
    const state = {
      username: currentUser.username,
      room: currentUser.room,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.USER_STATE, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving user state:", error);
  }
}

// Load saved messages from localStorage
function loadSavedMessages() {
  try {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedMessages) {
      chatMessages = JSON.parse(savedMessages);
      // Display saved messages
      chatMessages.forEach((msg) => {
        addMessageToChat(
          msg.message,
          msg.type,
          msg.timestamp,
          msg.username,
          false // Don't save again since we're loading
        );
      });
    }
  } catch (error) {
    console.error("Error loading saved messages:", error);
    chatMessages = [];
  }
}

// Save messages to localStorage
function saveMessages() {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(chatMessages));
  } catch (error) {
    console.error("Error saving messages:", error);
  }
}

// Clear all chat data
function clearChatData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.USER_STATE);
    chatMessages = [];
    messagesArea.innerHTML = "";
    addMessageToChat("Chat history cleared.", "system");
  } catch (error) {
    console.error("Error clearing chat data:", error);
  }
}

// Auto-join room if user was previously connected
function autoJoinRoom() {
  if (currentUser.username && currentUser.room) {
    console.log("Auto-joining room:", currentUser.room);

    // Update UI to show loading state
    joinButton.disabled = true;
    joinButton.textContent = "Reconnecting...";

    // Send join room request
    socket.emit("joinRoom", {
      username: currentUser.username,
      roomName: currentUser.room,
    });
  }
}

// Connection status handling - very lenient
socket.on("connect_error", (error) => {
  console.log("Connection error:", error);

  // Don't show error message immediately, let reconnection handle it
  if (!connectionEstablished) {
    statusText.textContent = "Connecting...";
  }
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
  console.log("Transport:", socket.io.engine.transport.name);
  currentUser.socketId = socket.id;
  lastPongTime = Date.now(); // Reset pong timer
  updateConnectionStatus(true);
  connectionEstablished = true; // Set flag when connection is established

  // If we have saved state, try to rejoin room
  if (currentUser.username && currentUser.room) {
    autoJoinRoom();
  }
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from server, reason:", reason);
  connectionEstablished = false; // Reset flag on disconnect

  // Only show disconnection message for actual network issues, not normal disconnects
  if (reason === "io server disconnect" || reason === "transport close") {
    updateConnectionStatus(false);
  }
  // For other reasons (like page unload), don't show disconnection message
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Reconnected after", attemptNumber, "attempts");
  lastPongTime = Date.now(); // Reset pong timer
  updateConnectionStatus(true);
  connectionEstablished = true; // Set flag on successful reconnect

  // Auto-rejoin room after reconnection
  if (currentUser.username && currentUser.room) {
    setTimeout(() => {
      autoJoinRoom();
    }, 500);
  }
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("Reconnection attempt", attemptNumber);
  // Only show reconnection message for first few attempts
  if (attemptNumber <= 3) {
    statusText.textContent = `Connecting... (${attemptNumber})`;
  } else if (attemptNumber <= 5) {
    statusText.textContent = `Reconnecting... (${attemptNumber})`;
  }
  // After 5 attempts, don't keep showing the message
});

socket.on("reconnect_failed", () => {
  console.log("Reconnection failed");
  statusText.textContent = "Connection issue - Please refresh if needed";
});

// Handle heartbeat response
socket.on("pong", () => {
  lastPongTime = Date.now();
  console.log("Heartbeat response received");
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

  // Save user state
  saveUserState();

  // Update UI for joined room
  showRoomInterface();
  addMessageToChat(data.message, "system");

  // Update chat title
  chatTitle.textContent = `${data.room} Room`;
  currentRoomName.textContent = data.room;

  // Reset join button
  joinButton.disabled = false;
  joinButton.textContent = "Join Room";
});

// Handle room leaving
socket.on("roomLeft", (data) => {
  console.log("Left room:", data);
  currentUser.room = null;

  // Clear saved state
  localStorage.removeItem(STORAGE_KEYS.USER_STATE);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);

  // Reset UI
  showJoinInterface();
  addMessageToChat(data.message, "system");

  // Clear messages
  messagesArea.innerHTML = "";
  chatMessages = [];

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

  // Reset join button on error
  joinButton.disabled = false;
  joinButton.textContent = "Join Room";
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

    // Save user state
    saveUserState();
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

// Handle clear chat button
clearChatButton.addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to clear the chat history? This will remove all saved messages."
    )
  ) {
    clearChatData();
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

  // Show buttons
  leaveRoomButton.style.display = "block";
  clearChatButton.style.display = "block";

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

  // Hide buttons
  leaveRoomButton.style.display = "none";
  clearChatButton.style.display = "none";

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
  username = null,
  saveToStorage = true
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

  // Save message to localStorage if needed
  if (saveToStorage && messageType !== "system") {
    const messageData = {
      message: messageText,
      type: messageType,
      timestamp: timestamp || new Date().toLocaleTimeString(),
      username: username,
      room: currentUser.room,
    };

    chatMessages.push(messageData);

    // Keep only last 100 messages to prevent localStorage overflow
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }

    saveMessages();
  }
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
    // Only show disconnection message if we were previously connected
    if (currentUser.socketId) {
      statusText.textContent = "Disconnected - Trying to reconnect...";
    } else {
      statusText.textContent = "Connecting...";
    }
  }
}

// Handle page visibility changes to maintain connection
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Page became visible, check connection
    if (!socket.connected) {
      console.log("Page became visible, reconnecting...");
      socket.connect();
    }
  }
});

// Handle beforeunload to clean up
window.addEventListener("beforeunload", () => {
  stopConnectionMonitoring();
});

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);

// Add some helpful console messages
console.log("Room-based chat client initialized");
console.log("Enter a username and select a room to start chatting!");
