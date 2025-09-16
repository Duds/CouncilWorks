#!/bin/bash

# Script to update release information in environment variables
# This should be run after each release to update the badge

echo "🔄 Updating release information..."

# Get current Git SHA
GIT_SHA=$(git rev-parse HEAD)
echo "📝 Current Git SHA: $GIT_SHA"

# Get current version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $VERSION"

# Update .env file with new values
if [ -f ".env" ]; then
    # Remove existing NEXT_PUBLIC_GIT_SHA and NEXT_PUBLIC_RELEASE_CHANNEL lines
    sed -i '/^NEXT_PUBLIC_GIT_SHA=/d' .env
    sed -i '/^NEXT_PUBLIC_RELEASE_CHANNEL=/d' .env
    
    # Add new values
    echo "" >> .env
    echo "# Release Information" >> .env
    echo "NEXT_PUBLIC_GIT_SHA=\"$GIT_SHA\"" >> .env
    echo "NEXT_PUBLIC_RELEASE_CHANNEL=\"dev\"" >> .env
    
    echo "✅ Updated .env file with release information"
else
    echo "❌ .env file not found"
    exit 1
fi

echo "🎯 Release badge should now show:"
echo "   Version: v$VERSION"
echo "   Git SHA: ${GIT_SHA:0:7}"
echo "   Channel: DEV"
