"use client";

import { HeroCTA } from '@/components/marketing/cta-group';
import { Badge } from '@/components/ui/badge';
import { initializeLandingPageAnalytics } from '@/lib/analytics/landing-page-analytics';
import { Shield, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  // Simplified version without A/B testing for better performance
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !analyticsInitialized) {
      initializeLandingPageAnalytics();
      setAnalyticsInitialized(true);
    }
  }, [analyticsInitialized]);

  const getHeadline = () => {
    return 'Asset Management Reimagined: Four Rules That Change Everything';
  };

  const getSubheadline = () => {
    return 'Built on revolutionary simplicity: Every Asset Has a Purpose, Risk Sets the Rhythm, Respond to the Real World, Operate with Margin. No complexity. No bureaucracy. Just intelligent asset management that works.';
  };

  const getTrustIndicators = () => {
    const indicators = [
      { icon: Shield, text: 'Every Asset Has a Purpose', color: 'text-green-600' },
      { icon: Zap, text: 'Risk Sets the Rhythm', color: 'text-blue-600' },
      { icon: Sparkles, text: 'Respond to the Real World', color: 'text-purple-600' }
    ];

    return indicators.map((indicator, index) => (
      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
        <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
        <span>{indicator.text}</span>
      </div>
    ));
  };

  // Removed loading check for better performance

  return (
    <section className={`relative isolate bg-gradient-to-br from-background via-background to-muted/20 min-h-screen flex items-center ${className}`}>
      {/* Main Hero Content */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24 w-full">
        <div className="text-center">
          {/* Trust Badge */}
          <div className="mb-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <Shield className="w-4 h-4 mr-2" />
              Built on The Aegrid Rules
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl mb-6">
            {getHeadline()}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl leading-8 text-muted-foreground max-w-4xl mx-auto">
            {getSubheadline()}
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            {getTrustIndicators()}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10">
            <HeroCTA variant="control" />
          </div>

          {/* The Aegrid Rules Value Propositions */}
          <div className="mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Purpose</div>
                <div className="text-sm text-gray-600">Function-Based Anchoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Risk</div>
                <div className="text-sm text-gray-600">Sets the Rhythm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Margin</div>
                <div className="text-sm text-gray-600">Operational Slack</div>
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

function _HeroSectionSkeleton({ className }: { className: string }) {
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
