"use client";

import { HeroCTA } from '@/components/marketing/cta-group';
import SocialProofBar from '@/components/marketing/social-proof-bar';
import { Badge } from '@/components/ui/badge';
import { useHeroABTesting } from '@/hooks/useAdvancedABTesting';
import { initializeLandingPageAnalytics } from '@/lib/analytics/landing-page-analytics';
import { Shield, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const { variant, isLoading, config, trackEvent } = useHeroABTesting();
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !analyticsInitialized) {
      initializeLandingPageAnalytics();
      setAnalyticsInitialized(true);
    }
  }, [analyticsInitialized]);

  const getHeadline = () => {
    if (isLoading) return 'Loading...';
    return config.headline || 'Transform Your Asset Management with AI-Powered Intelligence';
  };

  const getSubheadline = () => {
    if (isLoading) return 'Loading...';
    return config.subheadline || 'Join 500+ Australian organisations using Aegrid to reduce maintenance costs by 23% and prevent equipment failures before they happen. ISO 55000 compliant, energy-optimised, and built for the future.';
  };

  const getTrustIndicators = () => {
    const indicators = [
      { icon: Shield, text: 'ISO 55000 Compliant', color: 'text-green-600' },
      { icon: Zap, text: 'AI-Powered Intelligence', color: 'text-blue-600' },
      { icon: Sparkles, text: '500+ Organisations', color: 'text-purple-600' }
    ];

    return indicators.map((indicator, index) => (
      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
        <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
        <span>{indicator.text}</span>
      </div>
    ));
  };

  if (isLoading) {
    return <HeroSectionSkeleton className={className} />;
  }

  return (
    <section className={`relative isolate bg-gradient-to-br from-background via-background to-muted/20 ${className}`}>
      {/* Social Proof Bar */}
      <SocialProofBar variant="minimal" />

      {/* Main Hero Content */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          {/* Trust Badge */}
          <div className="mb-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 500+ Australian organisations
            </Badge>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
            onClick={() => trackEvent('headline_view', { variant })}
          >
            {getHeadline()}
          </h1>

          {/* Subheadline */}
          <p
            className="mt-6 text-lg sm:text-xl lg:text-2xl leading-8 text-muted-foreground max-w-4xl mx-auto"
            onClick={() => trackEvent('subheadline_view', { variant })}
          >
            {getSubheadline()}
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            {getTrustIndicators()}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10" onClick={() => trackEvent('cta_section_view', { variant })}>
            <HeroCTA variant={variant as 'A' | 'B' | 'C' | 'control'} />
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">23%</div>
                <div className="text-sm text-gray-600">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$500k</div>
                <div className="text-sm text-gray-600">Saved in Downtime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.8★</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

function HeroSectionSkeleton({ className }: { className: string }) {
  return (
    <section className={`relative isolate bg-gradient-to-br from-background via-background to-muted/20 ${className}`}>
      {/* Social Proof Skeleton */}
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex items-center justify-center gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          {/* Badge Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-full animate-pulse w-64 mx-auto"></div>
          </div>

          {/* Headline Skeleton */}
          <div className="mb-6">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-full max-w-4xl mx-auto"></div>
          </div>

          {/* Subheadline Skeleton */}
          <div className="mt-6 space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-full max-w-4xl mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 max-w-3xl mx-auto"></div>
          </div>

          {/* Trust Indicators Skeleton */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            ))}
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse w-40"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
