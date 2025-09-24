"use client";

import { useEffect, useState } from 'react';

interface AdvancedAnalyticsProps {
  className?: string;
}

export default function AdvancedAnalytics({ className = '' }: AdvancedAnalyticsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [funnelData, _setFunnelData] = useState<any[]>([]);
  const [conversionRate, _setConversionRate] = useState(0);

  useEffect(() => {
    // Only show in development and only on client side
    if (typeof window !== 'undefined') {
      setIsVisible(process.env.NODE_ENV === 'development');

      // Update time on page every second
      const interval = setInterval(() => {
        setTimeOnPage(Math.floor(Date.now() / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-sm z-50 ${className}`}>
      <h3 className="font-semibold mb-2 text-sm">Conversion Analytics</h3>
      <div className="space-y-1 text-xs">
        <div>Events: {funnelData.length}</div>
        <div>Conversion Rate: {conversionRate.toFixed(1)}%</div>
        <div>Time on Page: {timeOnPage}s</div>
      </div>

      <div className="mt-3 max-h-24 overflow-y-auto">
        {funnelData.slice(-3).map((event, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            {event.stage}
          </div>
        ))}
      </div>
    </div>
  );
}
