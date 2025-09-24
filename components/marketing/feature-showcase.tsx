"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { BarChart3, Brain, CheckCircle, ChevronDown, ChevronUp, Settings, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
  metrics?: { label: string; value: string; color: string }[];
  category: 'core' | 'advanced' | 'enterprise';
  popular?: boolean;
}

interface FeatureShowcaseProps {
  maxVisible?: number;
  variant?: 'grid' | 'accordion' | 'carousel';
  className?: string;
}

const FEATURES: Feature[] = [
  {
    id: 'iso-compliance',
    title: 'ISO 55000 Compliance',
    description: 'Full compliance with international asset management standards, providing the framework for strategic asset management excellence.',
    icon: Shield,
    benefits: [
      'Strategic asset management framework',
      'Risk-based decision making',
      'Performance measurement & reporting',
      'Continuous improvement processes'
    ],
    metrics: [
      { label: 'Compliance Score', value: '100%', color: 'text-green-600' },
      { label: 'Audit Preparation Time', value: '-85%', color: 'text-blue-600' }
    ],
    category: 'core',
    popular: true
  },
  {
    id: 'energy-management',
    title: 'Energy Management',
    description: 'Advanced energy consumption analysis and optimisation capabilities for sustainable asset operations.',
    icon: Zap,
    benefits: [
      'Real-time energy consumption monitoring',
      'Energy efficiency trend analysis',
      'Carbon footprint tracking',
      'Cost optimisation recommendations'
    ],
    metrics: [
      { label: 'Cost Reduction', value: '23%', color: 'text-green-600' },
      { label: 'Energy Efficiency', value: '+18%', color: 'text-blue-600' }
    ],
    category: 'core',
    popular: true
  },
  {
    id: 'ai-optimisation',
    title: 'AI Optimisation',
    description: 'Intelligent anomaly detection and predictive analytics powered by advanced AI algorithms.',
    icon: Brain,
    benefits: [
      'Predictive maintenance scheduling',
      'Anomaly detection & alerting',
      'Performance optimisation recommendations',
      'Machine learning insights'
    ],
    metrics: [
      { label: 'Failure Prevention', value: '95%', color: 'text-green-600' },
      { label: 'Downtime Reduction', value: '67%', color: 'text-purple-600' }
    ],
    category: 'advanced',
    popular: true
  },
  {
    id: 'analytics-reporting',
    title: 'Advanced Analytics',
    description: 'Comprehensive reporting and analytics with real-time dashboards and custom insights.',
    icon: BarChart3,
    benefits: [
      'Real-time performance dashboards',
      'Custom report generation',
      'Trend analysis & forecasting',
      'Executive summary reports'
    ],
    metrics: [
      { label: 'Report Generation', value: '-90%', color: 'text-green-600' },
      { label: 'Data Accuracy', value: '99.9%', color: 'text-blue-600' }
    ],
    category: 'advanced'
  },
  {
    id: 'mobile-operations',
    title: 'Mobile Operations',
    description: 'Field-ready mobile interface with offline capabilities and GPS integration.',
    icon: Settings,
    benefits: [
      'Offline inspection capabilities',
      'GPS location tracking',
      'Photo & document capture',
      'Real-time synchronization'
    ],
    metrics: [
      { label: 'Field Efficiency', value: '+45%', color: 'text-green-600' },
      { label: 'Data Accuracy', value: '+78%', color: 'text-blue-600' }
    ],
    category: 'core'
  },
  {
    id: 'integration-capabilities',
    title: 'Enterprise Integration',
    description: 'Seamless integration with existing enterprise systems and third-party applications.',
    icon: Settings,
    benefits: [
      'ERP system integration',
      'API-first architecture',
      'Single sign-on (SSO)',
      'Data synchronization'
    ],
    metrics: [
      { label: 'Integration Time', value: '-70%', color: 'text-green-600' },
      { label: 'Data Consistency', value: '100%', color: 'text-blue-600' }
    ],
    category: 'enterprise'
  }
];

export default function FeatureShowcase({
  maxVisible = 3,
  variant = 'grid',
  className = ''
}: FeatureShowcaseProps) {
  const [visibleFeatures, setVisibleFeatures] = useState(
    FEATURES.slice(0, maxVisible)
  );
  const [showAll, setShowAll] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const handleShowMore = () => {
    setVisibleFeatures(FEATURES);
    setShowAll(true);
    trackLandingPageEvent('feature_interaction', {
      action: 'show_all_features',
      total_features: FEATURES.length
    });
  };

  const handleFeatureClick = (featureId: string) => {
    if (variant === 'accordion') {
      setExpandedFeature(expandedFeature === featureId ? null : featureId);
    }

    trackLandingPageEvent('feature_interaction', {
      action: 'feature_click',
      feature_id: featureId,
      feature_title: FEATURES.find(f => f.id === featureId)?.title
    });
  };

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <Card
      className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        feature.popular ? 'ring-2 ring-green-200 bg-green-50/50' : ''
      }`}
      onClick={() => handleFeatureClick(feature.id)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              feature.category === 'core' ? 'bg-green-100 text-green-600' :
              feature.category === 'advanced' ? 'bg-blue-100 text-blue-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              {feature.popular && (
                <Badge variant="secondary" className="mt-1 text-xs bg-green-100 text-green-700">
                  Popular
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="mb-4 text-sm leading-relaxed">
          {feature.description}
        </CardDescription>

        <div className="space-y-3">
          <div className="space-y-2">
            {feature.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{benefit}</span>
              </div>
            ))}
            {feature.benefits.length > 3 && !showAll && (
              <div className="text-xs text-gray-500 pl-6">
                +{feature.benefits.length - 3} more benefits
              </div>
            )}
          </div>

          {feature.metrics && (
            <div className="pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                {feature.metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-lg font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const AccordionFeature = ({ feature }: { feature: Feature }) => {
    const isExpanded = expandedFeature === feature.id;

    return (
      <Card className="mb-4">
        <CardHeader
          className="cursor-pointer"
          onClick={() => handleFeatureClick(feature.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                feature.category === 'core' ? 'bg-green-100 text-green-600' :
                feature.category === 'advanced' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                {feature.popular && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Popular
                  </Badge>
                )}
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <CardDescription className="mb-4 text-sm leading-relaxed">
              {feature.description}
            </CardDescription>

            <div className="space-y-4">
              <div className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>

              {feature.metrics && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  {feature.metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-xl font-bold ${metric.color}`}>
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Why 500+ Australian organisations choose Aegrid
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Three core capabilities that transform asset management, plus advanced features for enterprise needs
          </p>
        </div>

        {/* Features Display */}
        {variant === 'accordion' ? (
          <div className="max-w-4xl mx-auto">
            {visibleFeatures.map((feature) => (
              <AccordionFeature key={feature.id} feature={feature} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        )}

        {/* Show More Button */}
        {!showAll && FEATURES.length > maxVisible && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              onClick={handleShowMore}
              className="px-8"
            >
              See all {FEATURES.length} features
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Feature Categories Summary */}
        {showAll && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Core Features</h3>
              <p className="text-sm text-green-600">
                Essential capabilities for every organisation
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Advanced Features</h3>
              <p className="text-sm text-blue-600">
                AI-powered intelligence and analytics
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Enterprise Features</h3>
              <p className="text-sm text-purple-600">
                Integration and scalability for large organisations
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
