"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { 
  Clock, 
  Users, 
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ConversionOptimizationProps {
  className?: string;
}

interface ConversionOpportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  estimatedLift: string;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
  category: string;
}

const CONVERSION_OPPORTUNITIES: ConversionOpportunity[] = [
  {
    id: 'urgency-timer',
    title: 'Limited-Time Pilot Offer',
    description: 'Create urgency with a time-limited pilot program offer',
    impact: 'high',
    effort: 'low',
    estimatedLift: '+25% conversions',
    icon: Clock,
    cta: 'Activate Urgency Timer',
    category: 'Psychological Triggers'
  },
  {
    id: 'social-proof-popup',
    title: 'Live Social Proof',
    description: 'Show real-time activity from other organizations',
    impact: 'high',
    effort: 'medium',
    estimatedLift: '+30% trust',
    icon: Users,
    cta: 'Enable Live Activity',
    category: 'Social Proof'
  },
  {
    id: 'roi-calculator',
    title: 'Interactive ROI Calculator',
    description: 'Let visitors calculate their potential savings instantly',
    impact: 'medium',
    effort: 'medium',
    estimatedLift: '+20% engagement',
    icon: DollarSign,
    cta: 'Launch Calculator',
    category: 'Value Demonstration'
  },
  {
    id: 'exit-intent-offer',
    title: 'Exit-Intent Offer',
    description: 'Capture leaving visitors with a special offer',
    impact: 'medium',
    effort: 'low',
    estimatedLift: '+15% recovery',
    icon: AlertTriangle,
    cta: 'Set Up Exit Intent',
    category: 'Recovery'
  },
  {
    id: 'progressive-profiling',
    title: 'Progressive Profiling',
    description: 'Gradually collect visitor information over multiple visits',
    impact: 'high',
    effort: 'high',
    estimatedLift: '+40% lead quality',
    icon: Target,
    cta: 'Implement Profiling',
    category: 'Lead Nurturing'
  },
  {
    id: 'micro-commitments',
    title: 'Micro-Commitments',
    description: 'Small, low-risk actions that lead to larger commitments',
    impact: 'medium',
    effort: 'medium',
    estimatedLift: '+35% progression',
    icon: Zap,
    cta: 'Create Micro-CTAs',
    category: 'Behavioral Psychology'
  }
];

const CONVERSION_METRICS = {
  current: {
    conversionRate: 3.2,
    avgTimeOnPage: 145,
    bounceRate: 42,
    demoRequests: 23
  },
  optimized: {
    conversionRate: 4.8,
    avgTimeOnPage: 198,
    bounceRate: 28,
    demoRequests: 41
  }
};

export default function ConversionOptimization({ className = '' }: ConversionOptimizationProps) {
  const [activeOptimizations, setActiveOptimizations] = useState<string[]>([]);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Show optimizations after a delay to simulate analysis
    const timer = setTimeout(() => {
      setShowOptimizations(true);
      trackLandingPageEvent('conversion_optimization_analysis_complete', {
        opportunities_found: CONVERSION_OPPORTUNITIES.length,
        current_conversion_rate: CONVERSION_METRICS.current.conversionRate
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOptimizationToggle = (optimizationId: string) => {
    setActiveOptimizations(prev => {
      const newActive = prev.includes(optimizationId) 
        ? prev.filter(id => id !== optimizationId)
        : [...prev, optimizationId];
      
      trackLandingPageEvent('optimization_toggled', {
        optimization_id: optimizationId,
        action: prev.includes(optimizationId) ? 'deactivated' : 'activated',
        total_active: newActive.length
      });
      
      return newActive;
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredOpportunities = selectedCategory === 'all' 
    ? CONVERSION_OPPORTUNITIES 
    : CONVERSION_OPPORTUNITIES.filter(opp => opp.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(CONVERSION_OPPORTUNITIES.map(opp => opp.category)))];

  if (!showOptimizations) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="h-6 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="flex justify-center gap-4">
                <div className="h-20 bg-muted rounded w-20"></div>
                <div className="h-20 bg-muted rounded w-20"></div>
                <div className="h-20 bg-muted rounded w-20"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Conversion Optimization Analysis
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AI-powered analysis has identified {CONVERSION_OPPORTUNITIES.length} opportunities to improve your conversion rate by up to 50%
        </p>
      </div>

      {/* Current vs Optimized Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {CONVERSION_METRICS.current.conversionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Current Rate</div>
            <div className="text-xs text-green-600 mt-1">
              → {CONVERSION_METRICS.optimized.conversionRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {CONVERSION_METRICS.current.avgTimeOnPage}s
            </div>
            <div className="text-sm text-muted-foreground">Time on Page</div>
            <div className="text-xs text-green-600 mt-1">
              → {CONVERSION_METRICS.optimized.avgTimeOnPage}s
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {CONVERSION_METRICS.current.bounceRate}%
            </div>
            <div className="text-sm text-muted-foreground">Bounce Rate</div>
            <div className="text-xs text-green-600 mt-1">
              → {CONVERSION_METRICS.optimized.bounceRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {CONVERSION_METRICS.current.demoRequests}
            </div>
            <div className="text-sm text-muted-foreground">Demo Requests</div>
            <div className="text-xs text-green-600 mt-1">
              → {CONVERSION_METRICS.optimized.demoRequests}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Opportunities' : category}
          </Button>
        ))}
      </div>

      {/* Optimization Opportunities */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`transition-all duration-200 ${
              activeOptimizations.includes(opportunity.id) 
                ? 'border-primary shadow-md' 
                : 'hover:shadow-sm'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <opportunity.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {opportunity.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(opportunity.impact)}>
                      {opportunity.impact} impact
                    </Badge>
                    <span className={`text-xs ${getEffortColor(opportunity.effort)}`}>
                      {opportunity.effort} effort
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {opportunity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Estimated lift: </span>
                    <span className="font-medium text-green-600">{opportunity.estimatedLift}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={activeOptimizations.includes(opportunity.id) ? "outline" : "default"}
                    onClick={() => handleOptimizationToggle(opportunity.id)}
                  >
                    {activeOptimizations.includes(opportunity.id) ? 'Active' : opportunity.cta}
                    {activeOptimizations.includes(opportunity.id) && (
                      <CheckCircle className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Optimizations Summary */}
      {activeOptimizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">Active Optimizations</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {activeOptimizations.length} optimization{activeOptimizations.length !== 1 ? 's' : ''} currently active
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeOptimizations.map((id) => {
                      const opportunity = CONVERSION_OPPORTUNITIES.find(opp => opp.id === id);
                      return (
                        <Badge key={id} variant="secondary">
                          {opportunity?.title}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    +{Math.round((activeOptimizations.length * 8.5))}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expected conversion lift
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
