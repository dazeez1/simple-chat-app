// Initialize Socket.io connection
const socket = io('http://localhost:3000');

// DOM elements
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesArea = document.getElementById("messagesArea");
const statusIndicator = document.getElementById("statusIndicator");
const statusText = document.getElementById("statusText");

// Current user's socket ID
let currentUserId = null;

// Connection status handling
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
  currentUserId = socket.id;
  updateConnectionStatus(true);

  // Add welcome message
  addMessageToChat(
    "Welcome to the chat! Start typing to send messages.",
    "system"
  );
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  updateConnectionStatus(false);
});

// Handle incoming messages from other users
socket.on("newMessage", (messageData) => {
  console.log("Received message:", messageData);

  // Determine if this message is from the current user or another user
  const isOwnMessage = messageData.userId === currentUserId;
  const messageType = isOwnMessage ? "sent" : "received";

  addMessageToChat(messageData.message, messageType, messageData.timestamp);
});

// Handle form submission for sending messages
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageText = messageInput.value.trim();

  if (messageText) {
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

// Function to add messages to the chat area
function addMessageToChat(messageText, messageType, timestamp = null) {
  const messageElement = document.createElement("div");
  messageElement.className = `messageItem ${messageType}`;

  const messageContent = document.createElement("div");
  messageContent.className = "messageText";
  messageContent.textContent = messageText;

  messageElement.appendChild(messageContent);

  // Add timestamp if provided
  if (timestamp) {
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
console.log("Chat client initialized");
console.log("Open another browser tab to test real-time messaging!");
