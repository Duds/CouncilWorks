"use client";

import { useState, useEffect } from 'react';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';

interface ABTestConfig {
  name: string;
  variants: {
    [key: string]: {
      weight: number;
      content: React.ReactNode;
      metadata?: Record<string, any>;
    };
  };
  targeting?: {
    userAgent?: string[];
    referrer?: string[];
    utmSource?: string[];
  };
}

interface AdvancedABTestingProps {
  testName: string;
  config: ABTestConfig;
  className?: string;
}

export function useAdvancedABTesting(testName: string, config: ABTestConfig) {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getVariant = () => {
      // Check if variant is already assigned
      const storedVariant = localStorage.getItem(`ab-test-${testName}`);
      if (storedVariant && config.variants[storedVariant]) {
        setVariant(storedVariant);
        setIsLoading(false);
        return storedVariant;
      }

      // Check targeting criteria
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');

      if (config.targeting) {
        const { userAgent: uaTargets, referrer: refTargets, utmSource: utmTargets } = config.targeting;

        // Check user agent targeting
        if (uaTargets && !uaTargets.some(target => userAgent.includes(target))) {
          setVariant('control');
          setIsLoading(false);
          return 'control';
        }

        // Check referrer targeting
        if (refTargets && !refTargets.some(target => referrer.includes(target))) {
          setVariant('control');
          setIsLoading(false);
          return 'control';
        }

        // Check UTM source targeting
        if (utmTargets && utmSource && !utmTargets.includes(utmSource)) {
          setVariant('control');
          setIsLoading(false);
          return 'control';
        }
      }

      // Assign variant based on weights
      const variants = Object.keys(config.variants);
      const weights = variants.map(v => config.variants[v].weight);
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

      let random = Math.random() * totalWeight;
      let selectedVariant = 'control';

      for (let i = 0; i < variants.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          selectedVariant = variants[i];
          break;
        }
      }

      // Store variant assignment
      localStorage.setItem(`ab-test-${testName}`, selectedVariant);
      setVariant(selectedVariant);
      setIsLoading(false);

      // Track variant assignment
      trackLandingPageEvent('ab_test_assigned', {
        test_name: testName,
        variant: selectedVariant,
        user_agent: userAgent,
        referrer: referrer,
        utm_source: utmSource
      });

      return selectedVariant;
    };

    getVariant();
  }, [testName, config]);

  const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    trackLandingPageEvent(eventName, {
      ...eventData,
      test_name: testName,
      variant: variant
    });
  };

  return {
    variant,
    isLoading,
    trackEvent,
    content: variant ? config.variants[variant].content : null,
    metadata: variant ? config.variants[variant].metadata : null
  };
}

// Predefined test configurations for key landing page elements
export const HERO_AB_TESTS = {
  headline: {
    name: 'hero-headline',
    variants: {
      control: {
        weight: 50,
        content: 'Asset Management Reimagined: Four Rules That Change Everything'
      },
      benefit_focused: {
        weight: 25,
        content: 'Reduce Asset Costs by 30% with Intelligent Management'
      },
      urgency_driven: {
        weight: 15,
        content: 'Stop Losing Money on Broken Asset Management'
      },
      simplicity_focused: {
        weight: 10,
        content: 'Four Simple Rules. Massive Results. Zero Complexity.'
      }
    }
  },

  cta: {
    name: 'hero-cta',
    variants: {
      control: {
        weight: 40,
        content: 'Start Your Pilot Journey'
      },
      urgency: {
        weight: 25,
        content: 'Book Free Demo Today'
      },
      benefit: {
        weight: 20,
        content: 'See Your Savings Calculator'
      },
      risk_free: {
        weight: 15,
        content: 'Try Risk-Free Pilot'
      }
    }
  },

  social_proof: {
    name: 'social-proof',
    variants: {
      control: {
        weight: 50,
        content: 'Built for Australian Organisations'
      },
      metrics: {
        weight: 30,
        content: 'Trusted by 500+ Australian Organisations'
      },
      outcomes: {
        weight: 20,
        content: 'Average 30% Cost Reduction'
      }
    }
  }
};

export const FEATURE_AB_TESTS = {
  presentation: {
    name: 'feature-presentation',
    variants: {
      grid: {
        weight: 40,
        content: 'grid'
      },
      accordion: {
        weight: 30,
        content: 'accordion'
      },
      carousel: {
        weight: 20,
        content: 'carousel'
      },
      progressive: {
        weight: 10,
        content: 'progressive'
      }
    }
  },

  benefits_vs_features: {
    name: 'benefits-vs-features',
    variants: {
      benefits_first: {
        weight: 60,
        content: 'benefits'
      },
      features_first: {
        weight: 40,
        content: 'features'
      }
    }
  }
};

// Component for easy A/B testing
export default function AdvancedABTesting({ testName, config, className = '' }: AdvancedABTestingProps) {
  const { variant, isLoading, content } = useAdvancedABTesting(testName, config);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
