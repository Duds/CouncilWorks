"use client";

import { useEffect } from "react";
import { MobileDashboard } from "@/components/mobile/mobile-dashboard";

/**
 * Mobile Dashboard Page
 * Main dashboard for mobile PWA users
 * Uses separate mobile layout without main app authentication
 */
export default function MobileDashboardPage() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Initialize offline storage
    import('@/lib/offline-storage').then(({ offlineStorage }) => {
      offlineStorage.init().catch(console.error);
    });
  }, []);

  return <MobileDashboard />;
}
