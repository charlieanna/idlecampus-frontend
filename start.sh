#!/bin/bash

# CKAD Interactive Learning - Quick Start Script

cd "$(dirname "$0")"

echo "🚀 Starting CKAD Interactive Learning..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

echo "🌐 Starting development server..."
echo "The app will open at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

