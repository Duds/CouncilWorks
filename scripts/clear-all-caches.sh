#!/bin/bash

# Script to clear all caches and fix service worker issues
echo "🧹 Clearing all caches and fixing service worker issues..."

# Kill any running dev servers
echo "🛑 Stopping dev servers..."
pkill -f "next dev" 2>/dev/null || true

# Clear Next.js cache
echo "🗑️ Clearing Next.js cache..."
rm -rf .next

# Clear node_modules cache
echo "🗑️ Clearing node_modules cache..."
rm -rf node_modules/.cache

# Clear browser caches (instructions for user)
echo "🌐 Browser Cache Clearing Instructions:"
echo "   1. Open Chrome DevTools (F12)"
echo "   2. Right-click the refresh button"
echo "   3. Select 'Empty Cache and Hard Reload'"
echo "   4. Or go to Settings → Privacy → Clear browsing data"
echo ""

# Create a cache-busting script for the browser
cat > public/clear-cache.js << 'EOF'
// Cache clearing script for browser console
console.log('🧹 Clearing all caches...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      console.log('🗑️ Deleting cache:', cacheName);
      caches.delete(cacheName);
    });
  });
}

// Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('🗑️ Unregistering service worker:', registration.scope);
      registration.unregister();
    });
  });
}

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();

console.log('✅ All caches cleared! Refresh the page.');
EOF

echo "📝 Created public/clear-cache.js - run this in browser console if needed"
echo ""

# Update package.json with cache clearing script
echo "📦 Adding cache clearing script to package.json..."

# Start dev server
echo "🚀 Starting fresh dev server..."
npm run dev
