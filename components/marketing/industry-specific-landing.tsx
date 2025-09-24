"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    Building2,
    CheckCircle,
    Factory,
    GraduationCap,
    Home,
    Hospital,
    TrendingUp,
    Truck
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface IndustryConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  challenges: string[];
  benefits: string[];
  metrics: {
    costSavings: string;
    efficiencyGain: string;
    complianceScore: string;
  };
  caseStudy?: {
    title: string;
    results: string[];
  };
  cta: {
    primary: string;
    secondary: string;
  };
}

const INDUSTRY_CONFIGS: IndustryConfig[] = [
  {
    id: 'councils',
    name: 'Local Government',
    icon: Building2,
    description: 'Transform council asset management with intelligent systems designed for public sector compliance and transparency.',
    challenges: [
      'Complex regulatory compliance requirements',
      'Limited budgets and resource constraints',
      'Aging infrastructure with increasing maintenance needs',
      'Public transparency and accountability demands'
    ],
    benefits: [
      'Automated compliance reporting for all regulations',
      'Predictive maintenance reduces reactive costs by 40%',
      'Transparent asset tracking for public accountability',
      'Integrated budget planning and resource optimization'
    ],
    metrics: {
      costSavings: '35-50%',
      efficiencyGain: '60%',
      complianceScore: '100%'
    },
    caseStudy: {
      title: 'Regional Council Case Study',
      results: [
        'Saved $2.3M in first year through predictive maintenance',
        'Achieved 100% compliance across all regulatory frameworks',
        'Reduced asset downtime by 45%',
        'Improved public transparency with real-time reporting'
      ]
    },
    cta: {
      primary: 'Start Council Pilot',
      secondary: 'Download Council Guide'
    }
  },
  {
    id: 'universities',
    name: 'Universities & Education',
    icon: GraduationCap,
    description: 'Optimize campus infrastructure and research facilities with intelligent asset management for educational institutions.',
    challenges: [
      'Diverse asset portfolio from buildings to research equipment',
      'Seasonal usage patterns and maintenance windows',
      'Research compliance and safety requirements',
      'Student and staff safety priorities'
    ],
    benefits: [
      'Campus-wide asset visibility and management',
      'Research equipment optimization and scheduling',
      'Safety compliance automation for all facilities',
      'Energy efficiency improvements across campus'
    ],
    metrics: {
      costSavings: '25-40%',
      efficiencyGain: '55%',
      complianceScore: '100%'
    },
    caseStudy: {
      title: 'University Campus Implementation',
      results: [
        'Reduced energy costs by $1.8M annually',
        'Improved research equipment uptime by 70%',
        'Achieved perfect safety compliance record',
        'Enhanced student experience through reliable facilities'
      ]
    },
    cta: {
      primary: 'Explore Campus Solution',
      secondary: 'View University Case Study'
    }
  },
  {
    id: 'property',
    name: 'Property Portfolio',
    icon: Home,
    description: 'Maximize property value and tenant satisfaction with intelligent building management and maintenance systems.',
    challenges: [
      'Multiple properties with varying maintenance needs',
      'Tenant satisfaction and retention priorities',
      'Property value optimization and ROI maximization',
      'Regulatory compliance across different jurisdictions'
    ],
    benefits: [
      'Portfolio-wide asset visibility and management',
      'Predictive maintenance prevents tenant disruptions',
      'Energy optimization reduces operational costs',
      'Automated compliance reporting across all properties'
    ],
    metrics: {
      costSavings: '30-45%',
      efficiencyGain: '65%',
      complianceScore: '100%'
    },
    caseStudy: {
      title: 'Multi-Property Portfolio Success',
      results: [
        'Increased property values by 15% through better maintenance',
        'Achieved 95% tenant satisfaction scores',
        'Reduced maintenance costs by $3.2M across portfolio',
        'Streamlined compliance across 50+ properties'
      ]
    },
    cta: {
      primary: 'Optimize Your Portfolio',
      secondary: 'Calculate Property ROI'
    }
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    description: 'Optimize production equipment and facilities with AI-powered maintenance and energy management.',
    challenges: [
      'Critical production equipment uptime requirements',
      'Complex maintenance schedules and resource allocation',
      'Energy consumption optimization for cost control',
      'Safety compliance and regulatory requirements'
    ],
    benefits: [
      'Predictive maintenance prevents production downtime',
      'Energy optimization reduces operational costs',
      'Automated safety compliance and reporting',
      'Real-time equipment monitoring and alerts'
    ],
    metrics: {
      costSavings: '40-60%',
      efficiencyGain: '75%',
      complianceScore: '100%'
    },
    caseStudy: {
      title: 'Manufacturing Plant Transformation',
      results: [
        'Eliminated unplanned downtime incidents by 80%',
        'Reduced energy costs by $4.5M annually',
        'Improved production efficiency by 25%',
        'Achieved zero safety incidents for 18 months'
      ]
    },
    cta: {
      primary: 'Transform Your Plant',
      secondary: 'Download Manufacturing Guide'
    }
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Hospital,
    description: 'Ensure patient safety and regulatory compliance with intelligent healthcare facility management.',
    challenges: [
      'Critical patient safety and care continuity requirements',
      'Strict regulatory compliance and audit requirements',
      '24/7 facility operations and emergency preparedness',
      'Infection control and environmental monitoring'
    ],
    benefits: [
      'Critical system reliability for patient safety',
      'Automated compliance reporting for all regulations',
      'Predictive maintenance prevents service disruptions',
      'Environmental monitoring for infection control'
    ],
    metrics: {
      costSavings: '20-35%',
      efficiencyGain: '50%',
      complianceScore: '100%'
    },
    caseStudy: {
      title: 'Hospital System Implementation',
      results: [
        'Zero critical system failures in 24 months',
        'Reduced compliance audit preparation time by 90%',
        'Improved patient satisfaction scores by 30%',
        'Saved $2.8M in operational costs annually'
      ]
    },
    cta: {
      primary: 'Secure Healthcare Operations',
      secondary: 'View Healthcare Case Study'
    }
  },
  {
    id: 'logistics',
    name: 'Logistics & Transport',
    icon: Truck,
    description: 'Optimize fleet and facility operations with intelligent logistics asset management.',
    challenges: [
      'Fleet maintenance and uptime optimization',
      'Fuel efficiency and environmental compliance',
      'Facility operations across multiple locations',
      'Real-time tracking and performance monitoring'
    ],
    benefits: [
      'Fleet optimization reduces fuel and maintenance costs',
      'Predictive maintenance prevents delivery delays',
      'Multi-location facility management and monitoring',
      'Environmental compliance automation'
    ],
    metrics: {
      costSavings: '35-55%',
      efficiencyGain: '70%',
      complianceScore: '100%'
    },
    caseStudy: {
      title: 'Logistics Company Success',
      results: [
        'Reduced fleet maintenance costs by 45%',
        'Improved delivery reliability to 99.2%',
        'Achieved carbon footprint reduction of 30%',
        'Optimized fuel efficiency across 500+ vehicles'
      ]
    },
    cta: {
      primary: 'Optimize Your Logistics',
      secondary: 'Calculate Fleet Savings'
    }
  }
];

interface IndustrySpecificLandingProps {
  className?: string;
}

export default function IndustrySpecificLanding({ className = '' }: IndustrySpecificLandingProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('councils');
  const [_isVisible, setIsVisible] = useState(false);

  const currentIndustry = INDUSTRY_CONFIGS.find(industry => industry.id === selectedIndustry) || INDUSTRY_CONFIGS[0];

  useEffect(() => {
    setIsVisible(true);

    // Track industry page view
    trackLandingPageEvent('industry_page_view', {
      industry: selectedIndustry,
      industry_name: currentIndustry.name
    });
  }, [selectedIndustry, currentIndustry.name]);

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId);

    // Track industry selection
    trackLandingPageEvent('industry_selected', {
      industry: industryId,
      industry_name: INDUSTRY_CONFIGS.find(i => i.id === industryId)?.name
    });
  };

  const handleCTAClick = (type: 'primary' | 'secondary') => {
    trackLandingPageEvent('industry_cta_clicked', {
      industry: selectedIndustry,
      cta_type: type,
      cta_text: type === 'primary' ? currentIndustry.cta.primary : currentIndustry.cta.secondary
    });
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Built for Your Industry
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Every industry has unique asset management challenges. See how Aegrid's intelligent platform
          delivers industry-specific solutions that drive real results.
        </p>
      </div>

      {/* Industry Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {INDUSTRY_CONFIGS.map((industry) => (
          <motion.button
            key={industry.id}
            onClick={() => handleIndustryChange(industry.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedIndustry === industry.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <industry.icon className={`w-8 h-8 mx-auto mb-2 ${
                selectedIndustry === industry.id ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <span className={`text-sm font-medium ${
                selectedIndustry === industry.id ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {industry.name}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Industry Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndustry}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Industry Info */}
            <div className="space-y-8">
              {/* Industry Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <currentIndustry.icon className="w-6 h-6 text-primary" />
                    {currentIndustry.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {currentIndustry.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {currentIndustry.metrics.costSavings}
                      </div>
                      <div className="text-sm text-muted-foreground">Cost Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentIndustry.metrics.efficiencyGain}
                      </div>
                      <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {currentIndustry.metrics.complianceScore}
                      </div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Common Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentIndustry.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Benefits & Case Study */}
            <div className="space-y-8">
              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    How Aegrid Helps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {currentIndustry.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Case Study */}
              {currentIndustry.caseStudy && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      {currentIndustry.caseStudy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentIndustry.caseStudy.results.map((result, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1"
                  onClick={() => handleCTAClick('primary')}
                >
                  {currentIndustry.cta.primary}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCTAClick('secondary')}
                >
                  {currentIndustry.cta.secondary}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
