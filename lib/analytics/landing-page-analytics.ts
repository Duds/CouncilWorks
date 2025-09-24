/**
 * Landing Page Analytics System
 * Enhanced analytics tracking for landing page interactions and conversions
 */

export interface LandingPageEvent {
  type: 'page_view' | 'cta_click' | 'section_view' | 'scroll_depth' | 'time_on_page' | 'feature_interaction';
  variant?: string;
  section?: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  userAgent?: string;
  url?: string;
  referrer?: string;
}

export interface SocialProofData {
  userCount: number;
  rating: number;
  testimonialCount: number;
  customerLogos: string[];
  lastUpdated: Date;
}

export interface ConversionEvent {
  type: 'lead' | 'demo_request' | 'contact_form' | 'pricing_view';
  value?: number;
  properties?: Record<string, any>;
  funnelStage: 'awareness' | 'consideration' | 'decision' | 'action';
}

export class LandingPageAnalytics {
  private sessionId: string;
  private startTime: number;
  private scrollDepth: number = 0;
  private sectionsViewed: Set<string> = new Set();
  private maxScrollDepth: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    // Track page view
    this.track('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // Track scroll depth
    this.trackScrollDepth();

    // Track section views
    this.trackSectionViews();

    // Track time on page
    this.trackTimeOnPage();
  }

  track(type: LandingPageEvent['type'], properties?: Record<string, any>) {
    const event: LandingPageEvent = {
      type,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined
    };

    // Send to analytics service
    this.sendEvent(event);
  }

  trackConversion(event: ConversionEvent) {
    this.track('cta_click', {
      conversion: true,
      ...event,
      timeOnPage: Date.now() - this.startTime,
      sectionsViewed: Array.from(this.sectionsViewed),
      maxScrollDepth: this.maxScrollDepth
    });
  }

  private async sendEvent(event: LandingPageEvent) {
    try {
      // Send to internal analytics API
      await fetch('/api/analytics/landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      // Also send to console for development
      if (process.env.NODE_ENV === 'development') {
        console.debug('Analytics Event:', event);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  private trackScrollDepth() {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);

      // Track milestone scroll depths
      if (scrollPercent >= 25 && !this.sectionsViewed.has('25%')) {
        this.sectionsViewed.add('25%');
        this.track('scroll_depth', { depth: 25 });
      } else if (scrollPercent >= 50 && !this.sectionsViewed.has('50%')) {
        this.sectionsViewed.add('50%');
        this.track('scroll_depth', { depth: 50 });
      } else if (scrollPercent >= 75 && !this.sectionsViewed.has('75%')) {
        this.sectionsViewed.add('75%');
        this.track('scroll_depth', { depth: 75 });
      } else if (scrollPercent >= 90 && !this.sectionsViewed.has('90%')) {
        this.sectionsViewed.add('90%');
        this.track('scroll_depth', { depth: 90 });
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  private trackSectionViews() {
    if (typeof window === 'undefined') return;

    const sections = [
      'hero', 'core-features', 'interactive-demos', 'founder',
      'how', 'personas', 'faqs', 'security-compliance'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && !this.sectionsViewed.has(sectionId)) {
              this.sectionsViewed.add(sectionId);
              this.track('section_view', { section: sectionId });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
  }

  private trackTimeOnPage() {
    if (typeof window === 'undefined') return;

    const trackTimeMilestones = () => {
      const timeOnPage = Date.now() - this.startTime;

      // Track time milestones
      if (timeOnPage >= 30000 && !this.sectionsViewed.has('30s')) {
        this.sectionsViewed.add('30s');
        this.track('time_on_page', { duration: 30 });
      } else if (timeOnPage >= 60000 && !this.sectionsViewed.has('1m')) {
        this.sectionsViewed.add('1m');
        this.track('time_on_page', { duration: 60 });
      } else if (timeOnPage >= 120000 && !this.sectionsViewed.has('2m')) {
        this.sectionsViewed.add('2m');
        this.track('time_on_page', { duration: 120 });
      }
    };

    // Check every 10 seconds
    const interval = setInterval(trackTimeMilestones, 10000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
      const finalTime = Date.now() - this.startTime;
      this.track('time_on_page', {
        duration: Math.round(finalTime / 1000),
        final: true
      });
    });
  }

  // Static method to get social proof data
  static async getSocialProofData(): Promise<SocialProofData> {
    try {
      const response = await fetch('/api/analytics/social-proof');
      if (!response.ok) throw new Error('Failed to fetch social proof data');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch social proof data:', error);
      // Return fallback data
      return {
        userCount: 500,
        rating: 4.8,
        testimonialCount: 47,
        customerLogos: [],
        lastUpdated: new Date()
      };
    }
  }
}

// Global instance for easy access
let analyticsInstance: LandingPageAnalytics | null = null;

export function initializeLandingPageAnalytics(): LandingPageAnalytics {
  if (typeof window === 'undefined') {
    throw new Error('Analytics can only be initialized on the client side');
  }

  if (!analyticsInstance) {
    analyticsInstance = new LandingPageAnalytics();
  }

  return analyticsInstance;
}

export function getLandingPageAnalytics(): LandingPageAnalytics | null {
  return analyticsInstance;
}

// Export the track function for easy use
export function trackLandingPageEvent(type: LandingPageEvent['type'], properties?: Record<string, any>) {
  const analytics = getLandingPageAnalytics();
  if (analytics) {
    analytics.track(type, properties);
  }
}

export function trackConversion(event: ConversionEvent) {
  const analytics = getLandingPageAnalytics();
  if (analytics) {
    analytics.trackConversion(event);
  }
}
