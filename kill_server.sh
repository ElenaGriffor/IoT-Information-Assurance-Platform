#!/bin/bash

echo "Stopping server..."

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "Killed process on port 3001" || echo "No process on port 3001"

# Kill any node process running server.js
pkill -9 -f "node.*server.js" 2>/dev/null && echo "Killed server.js processes" || echo "No server.js processes"

# Kill parent shell processes too
ps aux | grep "node server.js" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

echo "Done!"
