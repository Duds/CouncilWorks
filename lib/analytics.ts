"use client";

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  try {
    // Lightweight client-side event tracker placeholder
    console.debug("analytics:event", { name, properties, ts: Date.now() });
    // Future: sendBeacon to /api/analytics
  } catch (err) {
    // Swallow to avoid breaking UX
  }
}
