#!/bin/bash

# Stop Development Servers Script
# Kills all Next.js development servers and related processes

set -e

echo "🛑 Stopping all development servers..."

# Kill Next.js dev servers
echo "   Killing Next.js development servers..."
pkill -f "next dev" 2>/dev/null || true

# Kill Next.js server processes
echo "   Killing Next.js server processes..."
pkill -f "next-server" 2>/dev/null || true

# Kill npm run dev processes
echo "   Killing npm run dev processes..."
pkill -f "npm run dev" 2>/dev/null || true

# Kill yarn dev processes (if any)
echo "   Killing yarn dev processes..."
pkill -f "yarn.*dev" 2>/dev/null || true

# Kill pnpm dev processes (if any)
echo "   Killing pnpm dev processes..."
pkill -f "pnpm.*dev" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 1

# Check if any development servers are still running
remaining=$(ps aux | grep -E "(next|npm.*dev|yarn.*dev|pnpm.*dev)" | grep -v grep | grep -v "typescript/lib/typingsInstaller" | grep -v "mcp-server" | wc -l)

if [ "$remaining" -gt 0 ]; then
    echo "⚠️  Some processes may still be running:"
    ps aux | grep -E "(next|npm.*dev|yarn.*dev|pnpm.*dev)" | grep -v grep | grep -v "typescript/lib/typingsInstaller" | grep -v "mcp-server"
    echo ""
    echo "💡 You may need to manually kill these processes with:"
    echo "   kill -9 <PID>"
else
    echo "✅ All development servers have been stopped successfully!"
fi

echo ""
echo "🚀 To restart development servers, run:"
echo "   npm run dev"
