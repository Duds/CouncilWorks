"use client";

import { initializeLandingPageAnalytics } from '@/lib/analytics/landing-page-analytics';
import { useEffect } from 'react';

/**
 * Analytics Initializer Component
 * Initializes the landing page analytics system on the client side
 */
export default function AnalyticsInitializer() {
  useEffect(() => {
    // Initialize analytics only on the client side
    if (typeof window !== 'undefined') {
      try {
        initializeLandingPageAnalytics();
        console.debug('Landing page analytics initialized');
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}
