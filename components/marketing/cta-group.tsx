"use client";

import { Button } from '@/components/ui/button';
import { trackConversion } from '@/lib/analytics/landing-page-analytics';
import { ArrowRight, BookOpen, Calendar, Play, Users } from 'lucide-react';

interface CTAConfig {
  text: string;
  href: string;
  variant: 'default' | 'secondary' | 'outline' | 'ghost';
  icon?: React.ComponentType<{ className?: string }>;
  size?: 'default' | 'sm' | 'lg';
  animation?: 'pulse' | 'glow' | 'none';
}

interface CTAGroupProps {
  variant: 'A' | 'B' | 'C' | 'control';
  location: 'hero' | 'features' | 'testimonials' | 'footer';
  onCTAClick?: (cta: string, href: string) => void;
  className?: string;
}

export default function CTAGroup({
  variant,
  location,
  onCTAClick,
  className = ''
}: CTAGroupProps) {
  const getCTAs = (): { primary: CTAConfig; secondary: CTAConfig } => {
    const configs = {
      hero: {
        control: {
          primary: {
            text: "Explore a Pilot Partnership",
            href: "/contact",
            variant: "default" as const,
            size: "lg" as const,
            icon: Users,
            animation: "pulse" as const
          },
          secondary: {
            text: "Learn about the Aegrid Rules",
            href: "/docs/aegrid-rules",
            variant: "secondary" as const,
            size: "lg" as const,
            icon: BookOpen,
            animation: "none" as const
          }
        },
        A: {
          primary: {
            text: "Start Free Pilot",
            href: "/contact",
            variant: "default" as const,
            size: "lg" as const,
            icon: ArrowRight,
            animation: "pulse" as const
          },
          secondary: {
            text: "Watch Demo",
            href: "/demo",
            variant: "outline" as const,
            size: "lg" as const,
            icon: Play,
            animation: "none" as const
          }
        },
        B: {
          primary: {
            text: "Get Started Today",
            href: "/contact",
            variant: "default" as const,
            size: "lg" as const,
            icon: ArrowRight,
            animation: "glow" as const
          },
          secondary: {
            text: "View Case Studies",
            href: "/case-studies",
            variant: "outline" as const,
            size: "lg" as const,
            icon: BookOpen,
            animation: "none" as const
          }
        },
        C: {
          primary: {
            text: "Book Discovery Call",
            href: "/contact",
            variant: "default" as const,
            size: "lg" as const,
            icon: Calendar,
            animation: "pulse" as const
          },
          secondary: {
            text: "Learn More",
            href: "/docs",
            variant: "ghost" as const,
            size: "lg" as const,
            animation: "none" as const
          }
        }
      },
      features: {
        control: {
          primary: {
            text: "See All Features",
            href: "/features",
            variant: "outline" as const,
            size: "default" as const,
            icon: ArrowRight,
            animation: "none" as const
          },
          secondary: {
            text: "Request Demo",
            href: "/demo",
            variant: "default" as const,
            size: "default" as const,
            icon: Play,
            animation: "none" as const
          }
        },
        A: {
          primary: {
            text: "Explore Platform",
            href: "/demo",
            variant: "default" as const,
            size: "default" as const,
            icon: Play,
            animation: "none" as const
          },
          secondary: {
            text: "View Features",
            href: "/features",
            variant: "outline" as const,
            size: "default" as const,
            animation: "none" as const
          }
        },
        B: {
          primary: {
            text: "Start Free Trial",
            href: "/contact",
            variant: "default" as const,
            size: "default" as const,
            icon: ArrowRight,
            animation: "none" as const
          },
          secondary: {
            text: "Learn More",
            href: "/docs",
            variant: "ghost" as const,
            size: "default" as const,
            animation: "none" as const
          }
        },
        C: {
          primary: {
            text: "Get Started",
            href: "/contact",
            variant: "default" as const,
            size: "default" as const,
            icon: ArrowRight,
            animation: "none" as const
          },
          secondary: {
            text: "Watch Demo",
            href: "/demo",
            variant: "outline" as const,
            size: "default" as const,
            icon: Play,
            animation: "none" as const
          }
        }
      }
    };

    const locationConfig = configs[location] || configs.hero;
    return locationConfig[variant] || locationConfig.control;
  };

  const ctas = getCTAs();

  const handleCTAClick = (cta: CTAConfig) => {
    // Track conversion event
    trackConversion({
      type: 'lead',
      funnelStage: location === 'hero' ? 'awareness' : 'consideration',
      properties: {
        cta_text: cta.text,
        cta_href: cta.href,
        variant: variant,
        location: location
      }
    });

    // Call parent callback if provided
    if (onCTAClick) {
      onCTAClick(cta.text, cta.href);
    }
  };

  const EnhancedButton = ({ cta }: { cta: CTAConfig }) => {
    const ButtonComponent = (
      <Button
        variant={cta.variant}
        size={cta.size}
        onClick={() => handleCTAClick(cta)}
        className={`relative overflow-hidden ${
          cta.animation === 'pulse' ? 'animate-pulse' : ''
        } ${cta.animation === 'glow' ? 'shadow-lg shadow-primary/25' : ''}`}
      >
        {cta.icon && <cta.icon className="mr-2 h-4 w-4" />}
        {cta.text}
        {cta.animation === 'glow' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
      </Button>
    );

    return ButtonComponent;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
      <EnhancedButton cta={ctas.primary} />
      <EnhancedButton cta={ctas.secondary} />
    </div>
  );
}

// Specialized CTA components for different contexts
export function HeroCTA({ variant }: { variant: 'A' | 'B' | 'C' | 'control' }) {
  return <CTAGroup variant={variant} location="hero" />;
}

export function FeatureCTA({ variant }: { variant: 'A' | 'B' | 'C' | 'control' }) {
  return <CTAGroup variant={variant} location="features" />;
}

// Single CTA component for inline use
export function SingleCTA({
  text,
  href,
  variant = "default",
  size = "default",
  icon,
  onClick
}: {
  text: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  const handleClick = () => {
    trackConversion({
      type: 'lead',
      funnelStage: 'consideration',
      properties: {
        cta_text: text,
        cta_href: href
      }
    });

    if (onClick) {
      onClick();
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick}>
      {icon && <icon className="mr-2 h-4 w-4" />}
      {text}
    </Button>
  );
}
