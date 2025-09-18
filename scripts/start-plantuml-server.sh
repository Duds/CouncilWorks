#!/bin/bash

# PlantUML Server Startup Script for VS Code
echo "Starting PlantUML Server..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if PlantUML server is already running
if docker ps | grep -q plantuml-server; then
    echo "✅ PlantUML server is already running"
    docker ps | grep plantuml-server
else
    echo "🚀 Starting PlantUML server..."
    docker-compose -f docker-compose.plantuml.yml up -d
    
    # Wait for server to be ready
    echo "⏳ Waiting for server to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/ > /dev/null 2>&1; then
            echo "✅ PlantUML server is ready!"
            break
        fi
        sleep 1
        echo -n "."
    done
    
    if ! curl -s http://localhost:8080/ > /dev/null 2>&1; then
        echo "❌ PlantUML server failed to start"
        exit 1
    fi
fi

echo "🌐 PlantUML server is available at: http://localhost:8080"
echo "📊 Server status:"
docker ps | grep plantuml-server

