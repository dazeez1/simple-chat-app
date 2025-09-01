const http = require('http');
const io = require('socket.io-client');

// Test configuration
const SERVER_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

console.log('🧪 Starting Simple Chat App Tests...\n');

// Test 1: Check if server is running
function testServerConnection() {
  return new Promise((resolve, reject) => {
    console.log('1. Testing server connection...');
    
    const req = http.get(SERVER_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Server is running and responding');
        resolve(true);
      } else {
        console.log(`❌ Server returned status: ${res.statusCode}`);
        reject(new Error(`Server returned status: ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      console.log('❌ Server connection failed:', err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Server connection timeout');
      reject(new Error('Connection timeout'));
    });
  });
}

// Test 2: Test WebSocket connection
function testWebSocketConnection() {
  return new Promise((resolve, reject) => {
    console.log('2. Testing WebSocket connection...');
    
    const socket = io(SERVER_URL);
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      socket.disconnect();
      resolve(true);
    });
    
    socket.on('connect_error', (error) => {
      console.log('❌ WebSocket connection failed:', error.message);
      reject(error);
    });
    
    setTimeout(() => {
      console.log('❌ WebSocket connection timeout');
      reject(new Error('WebSocket connection timeout'));
    }, 5000);
  });
}

// Test 3: Test room functionality
function testRoomFunctionality() {
  return new Promise((resolve, reject) => {
    console.log('3. Testing room functionality...');
    
    const socket = io(SERVER_URL);
    let testsPassed = 0;
    const totalTests = 3;
    
    socket.on('connect', () => {
      // Test available rooms
      socket.on('availableRooms', (rooms) => {
        if (Array.isArray(rooms) && rooms.length > 0) {
          console.log('✅ Available rooms received:', rooms);
          testsPassed++;
        } else {
          console.log('❌ Invalid available rooms data');
        }
        
        // Test joining a room
        socket.emit('joinRoom', { username: 'TestUser', roomName: 'General' });
      });
      
      // Test room join confirmation
      socket.on('roomJoined', (data) => {
        if (data.room === 'General' && data.message.includes('Welcome')) {
          console.log('✅ Room joined successfully');
          testsPassed++;
        } else {
          console.log('❌ Invalid room join response');
        }
        
        // Test sending a message
        socket.emit('sendMessage', { message: 'Hello, world!' });
      });
      
      // Test message sending
      socket.on('newMessage', (data) => {
        if (data.message === 'Hello, world!' && data.username === 'TestUser') {
          console.log('✅ Message sent and received successfully');
          testsPassed++;
        } else {
          console.log('❌ Invalid message data');
        }
        
        // Clean up
        socket.emit('leaveRoom');
        socket.disconnect();
        
        if (testsPassed === totalTests) {
          resolve(true);
        } else {
          reject(new Error(`Only ${testsPassed}/${totalTests} room tests passed`));
        }
      });
    });
    
    socket.on('connect_error', (error) => {
      console.log('❌ WebSocket connection failed:', error.message);
      reject(error);
    });
    
    setTimeout(() => {
      console.log('❌ Room functionality test timeout');
      reject(new Error('Room functionality test timeout'));
    }, 10000);
  });
}

// Test 4: Test static files
function testStaticFiles() {
  return new Promise((resolve, reject) => {
    console.log('4. Testing static files...');
    
    const files = ['/style.css', '/client.js'];
    let filesChecked = 0;
    
    files.forEach(file => {
      const req = http.get(`${SERVER_URL}${file}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ ${file} served successfully`);
        } else {
          console.log(`❌ ${file} returned status: ${res.statusCode}`);
        }
        
        filesChecked++;
        if (filesChecked === files.length) {
          resolve(true);
        }
      });
      
      req.on('error', (err) => {
        console.log(`❌ Failed to get ${file}:`, err.message);
        filesChecked++;
        if (filesChecked === files.length) {
          reject(err);
        }
      });
    });
  });
}

// Run all tests
async function runAllTests() {
  try {
    await testServerConnection();
    await testWebSocketConnection();
    await testRoomFunctionality();
    await testStaticFiles();
    
    console.log('\n🎉 All tests passed! The Simple Chat App is ready to use.');
    console.log('\n📋 Next steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Import the Postman collection for detailed testing');
    console.log('3. Open multiple browser tabs to test multi-user functionality');
    
    process.exit(0);
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm start');
    console.log('2. Check if port 3000 is available');
    console.log('3. Verify all dependencies are installed: npm install');
    
    process.exit(1);
  }
}

// Start tests
runAllTests();
