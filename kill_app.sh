#!/bin/bash

echo "Stopping 4pages application..."

# Kill React development server (usually runs on port 3000)
echo "Killing React development server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"

# Kill Node.js backend server (usually runs on port 5001)
echo "Killing Node.js backend server..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || echo "No process found on port 5001"

# Kill any remaining node processes related to react-scripts or nodemon
echo "Killing remaining node processes..."
pkill -f "react-scripts" 2>/dev/null || echo "No react-scripts processes found"
pkill -f "nodemon" 2>/dev/null || echo "No nodemon processes found"
pkill -f "node.*server.js" 2>/dev/null || echo "No server.js processes found"

echo "Application stopped successfully!"