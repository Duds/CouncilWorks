"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { 
  Shield, 
  Lock, 
  Database, 
  Zap,
  Globe,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnterpriseFeatureProps {
  className?: string;
}

interface EnterpriseFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'security' | 'scalability' | 'integration' | 'compliance';
  benefits: string[];
  certifications: string[];
  technicalSpecs: {
    availability: string;
    scalability: string;
    compliance: string;
    support: string;
  };
}

const ENTERPRISE_FEATURES: EnterpriseFeature[] = [
  {
    id: 'enterprise-security',
    title: 'Enterprise-Grade Security',
    description: 'Military-grade security with end-to-end encryption, zero-trust architecture, and comprehensive audit trails.',
    icon: Shield,
    category: 'security',
    benefits: [
      'SOC 2 Type II Certified',
      'ISO 27001 Compliant',
      'End-to-end encryption',
      'Zero-trust architecture',
      '24/7 security monitoring',
      'Automated threat detection'
    ],
    certifications: ['SOC 2', 'ISO 27001', 'ISO 27002', 'PCI DSS'],
    technicalSpecs: {
      availability: '99.99% SLA',
      scalability: 'Unlimited users/assets',
      compliance: '13 ISO Standards',
      support: '24/7 Enterprise Support'
    }
  },
  {
    id: 'advanced-integration',
    title: 'Advanced System Integration',
    description: 'Seamless integration with your existing enterprise systems, ERP, and third-party applications.',
    icon: Database,
    category: 'integration',
    benefits: [
      'RESTful APIs',
      'Real-time data sync',
      'Custom integrations',
      'ERP connectivity',
      'Legacy system support',
      'Automated workflows'
    ],
    certifications: ['ISO 20000', 'ITIL v4'],
    technicalSpecs: {
      availability: '99.95% SLA',
      scalability: '1000+ integrations',
      compliance: 'Enterprise Architecture',
      support: 'Dedicated Integration Team'
    }
  },
  {
    id: 'global-scalability',
    title: 'Global Scalability',
    description: 'Built for global enterprises with multi-region deployment, edge computing, and localized compliance.',
    icon: Globe,
    category: 'scalability',
    benefits: [
      'Multi-region deployment',
      'Edge computing support',
      'Localized compliance',
      'Global data centers',
      'CDN optimization',
      'Disaster recovery'
    ],
    certifications: ['ISO 22301', 'ISO 9001'],
    technicalSpecs: {
      availability: '99.99% Global SLA',
      scalability: 'Unlimited regions',
      compliance: 'GDPR, CCPA, Local Laws',
      support: '24/7 Global Support'
    }
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics & AI',
    description: 'Enterprise-grade analytics with AI-powered insights, predictive modeling, and executive dashboards.',
    icon: BarChart3,
    category: 'integration',
    benefits: [
      'AI-powered insights',
      'Predictive analytics',
      'Executive dashboards',
      'Custom reporting',
      'Real-time monitoring',
      'Machine learning models'
    ],
    certifications: ['ISO/IEC 42010', 'ISO/IEC 20547-3'],
    technicalSpecs: {
      availability: '99.9% SLA',
      scalability: 'Unlimited data points',
      compliance: 'Data Privacy Standards',
      support: 'AI/ML Specialist Team'
    }
  },
  {
    id: 'compliance-automation',
    title: 'Automated Compliance',
    description: 'Automated compliance monitoring, reporting, and audit preparation across all regulatory frameworks.',
    icon: Award,
    category: 'compliance',
    benefits: [
      'Automated compliance checks',
      'Regulatory reporting',
      'Audit preparation',
      'Policy management',
      'Risk assessment',
      'Compliance dashboards'
    ],
    certifications: ['ISO 31000', 'ISO 21500', 'ISO 22301'],
    technicalSpecs: {
      availability: '99.95% SLA',
      scalability: 'All regulations',
      compliance: '13 ISO Standards',
      support: 'Compliance Specialists'
    }
  },
  {
    id: 'enterprise-administration',
    title: 'Enterprise Administration',
    description: 'Comprehensive administrative controls with role-based access, audit logs, and centralized management.',
    icon: Settings,
    category: 'security',
    benefits: [
      'Role-based access control',
      'Centralized administration',
      'Audit trail logging',
      'User management',
      'Policy enforcement',
      'Administrative dashboards'
    ],
    certifications: ['ISO 27001', 'SOC 2'],
    technicalSpecs: {
      availability: '99.99% SLA',
      scalability: 'Unlimited admins',
      compliance: 'Access Control Standards',
      support: 'Administrative Support'
    }
  }
];

const ENTERPRISE_METRICS = {
  uptime: '99.99%',
  users: '10,000+',
  assets: '1M+',
  compliance: '13 ISO Standards',
  security: 'SOC 2 Certified',
  support: '24/7 Enterprise'
};

export default function EnterpriseFeatures({ className = '' }: EnterpriseFeatureProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    // Track enterprise features view
    trackLandingPageEvent('enterprise_features_view', {
      timestamp: Date.now(),
      user_agent: navigator.userAgent
    });
  }, []);

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
    trackLandingPageEvent('enterprise_feature_selected', {
      feature_id: featureId,
      feature_title: ENTERPRISE_FEATURES.find(f => f.id === featureId)?.title
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    trackLandingPageEvent('enterprise_category_filtered', {
      category: category
    });
  };

  const filteredFeatures = selectedCategory === 'all' 
    ? ENTERPRISE_FEATURES 
    : ENTERPRISE_FEATURES.filter(feature => feature.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Features', icon: Star },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'scalability', label: 'Scalability', icon: Globe },
    { id: 'integration', label: 'Integration', icon: Database },
    { id: 'compliance', label: 'Compliance', icon: Award }
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Enterprise-Grade Platform
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Built for large organizations with enterprise-grade security, scalability, and compliance requirements
        </p>
      </div>

      {/* Enterprise Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <Card className="text-center">
          <CardContent className="p-4">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{ENTERPRISE_METRICS.uptime}</div>
            <div className="text-xs text-muted-foreground">Uptime SLA</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{ENTERPRISE_METRICS.users}</div>
            <div className="text-xs text-muted-foreground">Concurrent Users</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{ENTERPRISE_METRICS.assets}</div>
            <div className="text-xs text-muted-foreground">Assets Managed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{ENTERPRISE_METRICS.compliance}</div>
            <div className="text-xs text-muted-foreground">Compliance</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Lock className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{ENTERPRISE_METRICS.security}</div>
            <div className="text-xs text-muted-foreground">Security</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{ENTERPRISE_METRICS.support}</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => handleCategoryChange(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedFeature === feature.id ? 'border-primary shadow-md' : ''
              }`}
              onClick={() => handleFeatureSelect(feature.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge variant="outline" className="text-xs capitalize">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                  {selectedFeature === feature.id && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Benefits</h4>
                  <div className="space-y-1">
                    {feature.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                    {feature.benefits.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{feature.benefits.length - 3} more benefits
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-1">
                    {feature.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Feature Details */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const feature = ENTERPRISE_FEATURES.find(f => f.id === selectedFeature);
              if (!feature) return null;

              return (
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Complete Benefits</h4>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Technical Specifications</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Availability:</span>
                            <span className="font-medium">{feature.technicalSpecs.availability}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Scalability:</span>
                            <span className="font-medium">{feature.technicalSpecs.scalability}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Compliance:</span>
                            <span className="font-medium">{feature.technicalSpecs.compliance}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Support:</span>
                            <span className="font-medium">{feature.technicalSpecs.support}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="flex-1"
                        onClick={() => trackLandingPageEvent('enterprise_demo_request', {
                          feature_id: feature.id,
                          feature_title: feature.title
                        })}
                      >
                        Request Enterprise Demo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => trackLandingPageEvent('enterprise_consultation', {
                          feature_id: feature.id,
                          feature_title: feature.title
                        })}
                      >
                        Schedule Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
