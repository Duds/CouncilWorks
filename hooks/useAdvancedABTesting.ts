"use client";

import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { useEffect, useState } from 'react';

export interface ABTestConfig {
  name: string;
  variants: Record<string, any>;
  weights?: Record<string, number>;
  targeting?: {
    userAgent?: string[];
    referrer?: string[];
    utm_source?: string[];
  };
  metrics: string[];
}

export interface ABTestResult {
  variant: string | null;
  isLoading: boolean;
  config: any;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

export function useAdvancedABTesting(config: ABTestConfig): ABTestResult {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const assignVariant = async () => {
      try {
        // Check for existing assignment
        const existing = localStorage.getItem(`ab_${config.name}`);
        if (existing && config.variants[existing]) {
          setVariant(existing);
          setIsLoading(false);
          return;
        }

        // Check targeting criteria
        if (config.targeting && !meetsTargetingCriteria(config.targeting)) {
          setVariant('control');
          setIsLoading(false);
          return;
        }

        // Assign new variant based on weights
        const assignedVariant = assignVariantWithWeights(config);

        // Store assignment
        localStorage.setItem(`ab_${config.name}`, assignedVariant);

        // Track assignment
        trackLandingPageEvent('ab_test_assigned', {
          test: config.name,
          variant: assignedVariant,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        });

        setVariant(assignedVariant);
      } catch (error) {
        console.error('A/B testing assignment failed:', error);
        setVariant('control');
      } finally {
        setIsLoading(false);
      }
    };

    assignVariant();
  }, [config]);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    trackLandingPageEvent('feature_interaction', {
      ab_test: config.name,
      variant: variant,
      event_name: eventName,
      ...properties
    });
  };

  return {
    variant,
    isLoading,
    config: config.variants[variant || 'control'],
    trackEvent
  };
}

function meetsTargetingCriteria(targeting: ABTestConfig['targeting']): boolean {
  if (!targeting) return true;

  // Check user agent targeting
  if (targeting.userAgent && targeting.userAgent.length > 0) {
    const userAgent = navigator.userAgent.toLowerCase();
    const matchesUserAgent = targeting.userAgent.some(pattern =>
      userAgent.includes(pattern.toLowerCase())
    );
    if (!matchesUserAgent) return false;
  }

  // Check referrer targeting
  if (targeting.referrer && targeting.referrer.length > 0) {
    const referrer = document.referrer.toLowerCase();
    const matchesReferrer = targeting.referrer.some(pattern =>
      referrer.includes(pattern.toLowerCase())
    );
    if (!matchesReferrer) return false;
  }

  // Check UTM source targeting
  if (targeting.utm_source && targeting.utm_source.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source')?.toLowerCase();
    if (utmSource) {
      const matchesUtmSource = targeting.utm_source.some(pattern =>
        utmSource.includes(pattern.toLowerCase())
      );
      if (!matchesUtmSource) return false;
    }
  }

  return true;
}

function assignVariantWithWeights(config: ABTestConfig): string {
  const variants = Object.keys(config.variants);
  const weights = config.weights || {};

  // Default to equal weights if not specified
  const totalWeight = variants.reduce((sum, variant) => {
    return sum + (weights[variant] || 1);
  }, 0);

  const random = Math.random() * totalWeight;
  let currentWeight = 0;

  for (const variant of variants) {
    currentWeight += weights[variant] || 1;
    if (random <= currentWeight) {
      return variant;
    }
  }

  // Fallback to first variant
  return variants[0];
}

// Predefined A/B test configurations
export const AB_TEST_CONFIGS = {
  hero_section: {
    name: 'hero_section',
    variants: {
      control: {
        headline: 'ISO 55000 Compliant Asset Intelligence: Energy Management, AI Optimisation & Predictive Analytics',
        subheadline: 'Aegrid delivers ISO 55000 compliant asset intelligence with advanced energy management, AI-powered optimisation, and predictive analytics. Built on the revolutionary Aegrid Rules framework, we help universities, property portfolios, and enterprise organisations achieve predictable asset outcomes through intelligent maintenance strategies.',
        primaryCTA: 'Explore a Pilot Partnership',
        secondaryCTA: 'Learn about the Aegrid Rules'
      },
      variant_a: {
        headline: 'Transform Your Asset Management with AI-Powered Intelligence',
        subheadline: 'Join 500+ Australian organisations using Aegrid to reduce maintenance costs by 23% and prevent equipment failures before they happen. ISO 55000 compliant, energy-optimised, and built for the future.',
        primaryCTA: 'Start Free Pilot',
        secondaryCTA: 'Watch Demo'
      },
      variant_b: {
        headline: 'The Future of Asset Management is Here',
        subheadline: 'Stop guessing. Start knowing. Aegrid\'s AI-powered platform helps you predict, prevent, and optimise. See why leading organisations trust us with their most critical assets.',
        primaryCTA: 'Get Started Today',
        secondaryCTA: 'View Case Studies'
      }
    },
    weights: {
      control: 0.33,
      variant_a: 0.33,
      variant_b: 0.34
    },
    targeting: {
      utm_source: ['google', 'linkedin', 'direct']
    },
    metrics: ['conversion_rate', 'time_on_page', 'scroll_depth']
  },

  cta_buttons: {
    name: 'cta_buttons',
    variants: {
      control: {
        primaryCTA: 'Explore a Pilot Partnership',
        secondaryCTA: 'Learn about the Aegrid Rules',
        primaryStyle: 'default',
        secondaryStyle: 'secondary'
      },
      variant_a: {
        primaryCTA: 'Start Free Pilot',
        secondaryCTA: 'Watch Demo',
        primaryStyle: 'default',
        secondaryStyle: 'outline'
      },
      variant_b: {
        primaryCTA: 'Get Started',
        secondaryCTA: 'Learn More',
        primaryStyle: 'default',
        secondaryStyle: 'ghost'
      }
    },
    weights: {
      control: 0.4,
      variant_a: 0.3,
      variant_b: 0.3
    },
    metrics: ['cta_click_rate', 'conversion_rate']
  }
};

// Hook for hero section A/B testing
export function useHeroABTesting() {
  return useAdvancedABTesting(AB_TEST_CONFIGS.hero_section);
}

// Hook for CTA button A/B testing
export function useCTAABTesting() {
  return useAdvancedABTesting(AB_TEST_CONFIGS.cta_buttons);
}
