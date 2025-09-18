#!/bin/bash

# PlantUML VS Code Extension Troubleshooting Script
echo "=== PlantUML VS Code Extension Troubleshooting ==="
echo ""

# Check if VS Code is running
echo "1. Checking VS Code processes..."
if pgrep -f "code" > /dev/null; then
    echo "✓ VS Code is running"
    echo "Processes:"
    pgrep -f "code" | head -5
else
    echo "✗ VS Code is not running"
fi
echo ""

# Check PlantUML extension installation
echo "2. Checking PlantUML extension..."
if [ -d "$HOME/.vscode/extensions" ]; then
    PLANTUML_EXT=$(find "$HOME/.vscode/extensions" -name "*plantuml*" -type d | head -1)
    if [ -n "$PLANTUML_EXT" ]; then
        echo "✓ PlantUML extension found:"
        echo "  $PLANTUML_EXT"
        ls -la "$PLANTUML_EXT" | head -3
    else
        echo "✗ PlantUML extension not found"
        echo "Available extensions:"
        ls "$HOME/.vscode/extensions" | grep -i plant || echo "No PlantUML extensions found"
    fi
else
    echo "✗ VS Code extensions directory not found"
fi
echo ""

# Check workspace settings
echo "3. Checking workspace settings..."
if [ -f ".vscode/settings.json" ]; then
    echo "✓ Workspace settings found"
    echo "PlantUML settings:"
    grep -A 5 -B 5 "plantuml" .vscode/settings.json || echo "No PlantUML settings found"
else
    echo "✗ Workspace settings not found"
fi
echo ""

# Check user settings
echo "4. Checking user settings..."
if [ -f "$HOME/.config/Code/User/settings.json" ]; then
    echo "✓ User settings found"
    if grep -q "plantuml" "$HOME/.config/Code/User/settings.json"; then
        echo "PlantUML settings in user config:"
        grep -A 5 -B 5 "plantuml" "$HOME/.config/Code/User/settings.json"
    else
        echo "No PlantUML settings in user config"
    fi
else
    echo "✗ User settings not found"
fi
echo ""

# Test PlantUML command line
echo "5. Testing PlantUML command line..."
if [ -f "plantuml.jar" ]; then
    echo "✓ PlantUML jar found"
    java -jar plantuml.jar -version 2>&1 | head -3
else
    echo "✗ PlantUML jar not found"
fi
echo ""

# Check Java and Graphviz
echo "6. Checking dependencies..."
echo "Java:"
java -version 2>&1 | head -1
echo "Graphviz:"
dot -V 2>&1 | head -1
echo ""

# Create test diagram
echo "7. Creating test diagram..."
cat > test-vscode.puml << 'EOF'
@startuml VS Code Test
Alice -> Bob: Hello from VS Code
Bob --> Alice: Hi there!
@enduml
EOF

java -jar plantuml.jar test-vscode.puml
if [ -f "test-vscode.png" ]; then
    echo "✓ Test diagram generated successfully"
    ls -lh test-vscode.png
else
    echo "✗ Test diagram generation failed"
fi
echo ""

# Check VS Code logs
echo "8. VS Code troubleshooting steps:"
echo "   a) Press Ctrl+Shift+P and run 'Developer: Reload Window'"
echo "   b) Press Ctrl+Shift+P and run 'PlantUML: Preview Current Diagram'"
echo "   c) Check Output panel (Ctrl+Shift+U) and select 'PlantUML'"
echo "   d) Try right-clicking on .puml file and select 'Preview PlantUML'"
echo ""

# Cleanup
rm -f test-vscode.puml test-vscode.png

echo "=== Troubleshooting Complete ==="
