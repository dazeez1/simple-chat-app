#!/bin/bash

# Simple Chat App Setup Script
# This script automates the setup and testing process

echo "🚀 Simple Chat App Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if port 3000 is available
echo "🔍 Checking if port 3000 is available..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Please stop any running services on port 3000."
    echo "   You can use: lsof -ti:3000 | xargs kill -9"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Port 3000 is available"
fi

echo ""

# Start the server in the background
echo "🚀 Starting the server..."
node server.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ Server is running on http://localhost:3000"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test

TEST_RESULT=$?

echo ""

# Stop the server
echo "🛑 Stopping the server..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the server: npm start"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Import the Postman collection for detailed testing"
echo "4. Open multiple browser tabs to test multi-user functionality"
echo ""

if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ All tests passed! The application is ready to use."
    exit 0
else
    echo "⚠️  Some tests failed. Please check the output above."
    exit 1
fi
