#!/bin/bash

# PlantUML Test Script for CouncilWorks
echo "=== PlantUML Extension Test Script ==="
echo ""

# Check Java installation
echo "1. Checking Java installation..."
if command -v java &> /dev/null; then
    java -version
    echo "✓ Java is installed"
else
    echo "✗ Java is not installed"
    exit 1
fi
echo ""

# Check Graphviz installation
echo "2. Checking Graphviz installation..."
if command -v dot &> /dev/null; then
    dot -V
    echo "✓ Graphviz is installed"
else
    echo "✗ Graphviz is not installed"
    exit 1
fi
echo ""

# Check PlantUML jar
echo "3. Checking PlantUML jar..."
if [ -f "plantuml.jar" ]; then
    echo "✓ Plantuml.jar found"
    ls -lh plantuml.jar
else
    echo "✗ Plantuml.jar not found"
    exit 1
fi
echo ""

# Test simple diagram
echo "4. Testing simple diagram..."
java -jar plantuml.jar docs/simple-test.puml
if [ -f "docs/simple-test.png" ]; then
    echo "✓ Simple diagram generated successfully"
    ls -lh docs/simple-test.png
else
    echo "✗ Simple diagram generation failed"
fi
echo ""

# Test ERD diagram
echo "5. Testing ERD diagram..."
java -jar plantuml.jar docs/database/ERD.puml
if [ -f "docs/database/Aegrid Database ERD - Resilient Asset Management.png" ]; then
    echo "✓ ERD diagram generated successfully"
    ls -lh "docs/database/Aegrid Database ERD - Resilient Asset Management.png"
else
    echo "✗ ERD diagram generation failed"
fi
echo ""

# Check VS Code settings
echo "6. Checking VS Code settings..."
if [ -f ".vscode/settings.json" ]; then
    echo "✓ VS Code settings file found"
    echo "PlantUML settings:"
    grep -A 10 -B 2 "plantuml" .vscode/settings.json
else
    echo "✗ VS Code settings file not found"
fi
echo ""

echo "=== Test Complete ==="
echo ""
echo "Next steps:"
echo "1. Restart VS Code"
echo "2. Open docs/database/ERD.puml"
echo "3. Press Alt+D to preview"
echo "4. Or right-click and select 'Preview PlantUML'"
