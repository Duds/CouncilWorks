import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { useEffect, useState } from 'react';

interface ConversionFunnel {
  stage: string;
  timestamp: number;
  data: Record<string, any>;
}

interface HeatmapData {
  element: string;
  clicks: number;
  views: number;
  hoverTime: number;
  scrollDepth: number;
}

interface AdvancedAnalyticsProps {
  className?: string;
}

class AdvancedConversionTracker {
  private funnel: ConversionFunnel[] = [];
  private heatmapData: Map<string, HeatmapData> = new Map();
  private sessionStart: number = Date.now();
  private scrollDepth: number = 0;
  private timeOnPage: number = 0;

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    // Track page load
    this.trackEvent('page_load', {
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // Track scroll depth
    this.trackScrollDepth();

    // Track time on page
    this.trackTimeOnPage();

    // Track form interactions
    this.trackFormInteractions();

    // Track button clicks
    this.trackButtonClicks();

    // Track exit intent
    this.trackExitIntent();
  }

  private trackScrollDepth() {
    let maxScroll = 0;

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercent = Math.round((scrollTop + windowHeight) / documentHeight * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track milestone scroll depths
        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
          this.trackEvent('scroll_depth', {
            depth: scrollPercent,
            timestamp: Date.now()
          });
        }
      }
    };

    window.addEventListener('scroll', updateScrollDepth, { passive: true });
  }

  private trackTimeOnPage() {
    const updateTimeOnPage = () => {
      this.timeOnPage = Date.now() - this.sessionStart;
    };

    setInterval(updateTimeOnPage, 1000);

    // Track time milestones
    const timeMilestones = [30, 60, 120, 300, 600]; // seconds
    timeMilestones.forEach(milestone => {
      setTimeout(() => {
        this.trackEvent('time_on_page', {
          seconds: milestone,
          timestamp: Date.now()
        });
      }, milestone * 1000);
    });
  }

  private trackFormInteractions() {
    const forms = document.querySelectorAll('form');

    forms.forEach((form, index) => {
      const formId = form.id || `form-${index}`;

      // Track form views
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('form_view', {
              form_id: formId,
              timestamp: Date.now()
            });
          }
        });
      });

      observer.observe(form);

      // Track form interactions
      form.addEventListener('focusin', (e) => {
        this.trackEvent('form_field_focus', {
          form_id: formId,
          field_name: (e.target as HTMLInputElement)?.name,
          timestamp: Date.now()
        });
      });

      form.addEventListener('submit', (e) => {
        this.trackEvent('form_submit', {
          form_id: formId,
          timestamp: Date.now()
        });
      });
    });
  }

  private trackButtonClicks() {
    const buttons = document.querySelectorAll('button, a[role="button"]');

    buttons.forEach((button, index) => {
      const buttonId = button.id || button.className || `button-${index}`;
      const buttonText = button.textContent?.trim() || '';

      button.addEventListener('click', () => {
        this.trackEvent('button_click', {
          button_id: buttonId,
          button_text: buttonText,
          timestamp: Date.now()
        });
      });

      // Track button hover
      button.addEventListener('mouseenter', () => {
        this.trackEvent('button_hover', {
          button_id: buttonId,
          button_text: buttonText,
          timestamp: Date.now()
        });
      });
    });
  }

  private trackExitIntent() {
    let exitIntentTriggered = false;

    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        this.trackEvent('exit_intent', {
          timestamp: Date.now(),
          time_on_page: this.timeOnPage,
          scroll_depth: this.scrollDepth
        });
      }
    });
  }

  public trackEvent(eventName: string, data: Record<string, any>) {
    const event = {
      stage: eventName,
      timestamp: Date.now(),
      data: {
        ...data,
        session_duration: this.timeOnPage,
        max_scroll_depth: this.scrollDepth
      }
    };

    this.funnel.push(event);

    // Send to analytics
    trackLandingPageEvent(eventName, data);

    // Store locally for debugging
    this.storeLocally(event);
  }

  public trackConversion(stage: string, data: Record<string, any>) {
    this.trackEvent(`conversion_${stage}`, {
      stage,
      funnel_position: this.funnel.length,
      ...data
    });
  }

  public getFunnelData() {
    return this.funnel;
  }

  public getConversionRate() {
    const totalEvents = this.funnel.length;
    const conversionEvents = this.funnel.filter(event =>
      event.stage.startsWith('conversion_')
    ).length;

    return totalEvents > 0 ? (conversionEvents / totalEvents) * 100 : 0;
  }

  private storeLocally(event: ConversionFunnel) {
    try {
      const stored = localStorage.getItem('aegrid_conversion_funnel');
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(event);

      // Keep only last 100 events
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }

      localStorage.setItem('aegrid_conversion_funnel', JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to store conversion data locally:', error);
    }
  }

  public getHeatmapData() {
    return Array.from(this.heatmapData.values());
  }

  public trackElementInteraction(elementId: string, interactionType: 'click' | 'hover' | 'view') {
    const existing = this.heatmapData.get(elementId) || {
      element: elementId,
      clicks: 0,
      views: 0,
      hoverTime: 0,
      scrollDepth: 0
    };

    switch (interactionType) {
      case 'click':
        existing.clicks++;
        break;
      case 'hover':
        existing.hoverTime += 100; // Approximate hover time
        break;
      case 'view':
        existing.views++;
        existing.scrollDepth = Math.max(existing.scrollDepth, this.scrollDepth);
        break;
    }

    this.heatmapData.set(elementId, existing);
  }
}

// Hook for using advanced analytics
function useAdvancedAnalytics() {
  const [tracker] = useState(() => new AdvancedConversionTracker());
  const [funnelData, setFunnelData] = useState<ConversionFunnel[]>([]);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const updateData = () => {
      setFunnelData(tracker.getFunnelData());
      setConversionRate(tracker.getConversionRate());
    };

    // Update data every 5 seconds
    const interval = setInterval(updateData, 5000);

    // Update on page unload
    window.addEventListener('beforeunload', updateData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', updateData);
    };
  }, [tracker]);

  return {
    tracker,
    funnelData,
    conversionRate,
    trackConversion: tracker.trackConversion.bind(tracker),
    trackEvent: tracker.trackEvent.bind(tracker)
  };
}

// Export the analytics class and hook for use in components
export { AdvancedConversionTracker, useAdvancedAnalytics };
