#!/bin/bash

# PlantUML Performance Optimization Script
echo "=== PlantUML Performance Setup ==="
echo ""

# Function to test local rendering performance
test_local_performance() {
    echo "Testing local PlantUML performance..."
    local start_time=$(date +%s%N)
    java -DPLANTUML_LIMIT_SIZE=8192 -Xmx2g -XX:+UseG1GC -jar plantuml.jar docs/database/ERD.puml
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))
    echo "Local rendering time: ${duration}ms"
    
    if [ -f "docs/database/Aegrid Database ERD - Resilient Asset Management.png" ]; then
        echo "✅ Local rendering successful"
        ls -lh "docs/database/Aegrid Database ERD - Resilient Asset Management.png"
    else
        echo "❌ Local rendering failed"
    fi
}

# Function to start PlantUML server
start_server() {
    echo "Starting PlantUML server..."
    if docker ps | grep -q plantuml-server; then
        echo "✅ PlantUML server is already running"
    else
        docker-compose -f docker-compose.plantuml.yml up -d
        echo "⏳ Waiting for server to be ready..."
        sleep 5
        if curl -s http://localhost:8080/ > /dev/null 2>&1; then
            echo "✅ PlantUML server is ready"
        else
            echo "❌ PlantUML server failed to start"
        fi
    fi
}

# Function to test server performance
test_server_performance() {
    echo "Testing server PlantUML performance..."
    if curl -s http://localhost:8080/ > /dev/null 2>&1; then
        local start_time=$(date +%s%N)
        curl -X POST -H "Content-Type: text/plain" --data-binary "@docs/database/ERD.puml" http://localhost:8080/uml/png -o erd-server-test.png > /dev/null 2>&1
        local end_time=$(date +%s%N)
        local duration=$(( (end_time - start_time) / 1000000 ))
        echo "Server rendering time: ${duration}ms"
        
        if [ -s erd-server-test.png ]; then
            echo "✅ Server rendering successful"
            ls -lh erd-server-test.png
        else
            echo "❌ Server rendering failed (empty file)"
        fi
    else
        echo "❌ Server not available"
    fi
}

# Main execution
echo "1. Testing local rendering performance..."
test_local_performance
echo ""

echo "2. Starting PlantUML server..."
start_server
echo ""

echo "3. Testing server rendering performance..."
test_server_performance
echo ""

echo "4. Performance comparison:"
echo "   - Local rendering: Uses optimized JVM settings"
echo "   - Server rendering: Faster but may have compatibility issues"
echo "   - Current VS Code setting: Local (optimized)"
echo ""

echo "5. VS Code Integration:"
echo "   - Press Ctrl+Shift+P → 'PlantUML: Preview Current Diagram'"
echo "   - Press Alt+D to preview"
echo "   - Right-click on .puml file → 'Preview PlantUML'"
echo ""

# Cleanup
rm -f erd-server-test.png docs/simple-server-test.puml simple-server-test.png

echo "=== Setup Complete ==="

