#!/bin/bash

# IdleCampus Development Startup Script
# Starts both frontend (Vite) and backend (Rails) simultaneously

set -e

cd "$(dirname "$0")"

echo "🚀 Starting IdleCampus Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}⚠️  Port $1 is in use, killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v rails &> /dev/null; then
    echo "❌ Rails is not installed. Please install Ruby on Rails first."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is running."
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Clean up ports if needed
echo -e "${BLUE}🧹 Cleaning up ports...${NC}"
kill_port 5173  # Frontend (Vite)
kill_port 3001  # Backend (Rails)
echo -e "${GREEN}✓ Ports cleaned${NC}"
echo ""

# Backend setup
echo -e "${BLUE}🔧 Setting up Rails backend...${NC}"
cd backend

# Check if database exists
if ! rails db:version &> /dev/null; then
    echo "📦 Creating database..."
    rails db:create
fi

# Run pending migrations
echo "📊 Running migrations..."
rails db:migrate

# Check if progressive flow data exists
if [ "$(rails runner 'puts ProgressiveChallenge.count')" = "0" ]; then
    echo "🌱 Loading Progressive Flow seed data..."
    rails db:seed:progressive_flow
else
    echo "✓ Progressive Flow data already seeded ($(rails runner 'puts ProgressiveChallenge.count') challenges)"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Return to root
cd ..

# Frontend setup
echo -e "${BLUE}📦 Installing frontend dependencies (if needed)...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ Dependencies already installed"
fi
echo ""

# Start both servers
echo -e "${GREEN}🎬 Starting development servers...${NC}"
echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Create log directory
mkdir -p logs

# Start backend in background
cd backend
rails server -p 3001 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend started successfully
if ! check_port 3001; then
    echo "❌ Backend failed to start. Check logs/backend.log"
    cat logs/backend.log
    exit 1
fi

echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Start frontend in foreground (so we can see output and use Ctrl+C)
echo "🎨 Starting frontend..."
npm run dev

# If we reach here, user pressed Ctrl+C
echo ""
echo "🛑 Shutting down servers..."
kill $BACKEND_PID 2>/dev/null || true
kill_port 5173
kill_port 3001
echo "👋 Goodbye!"
