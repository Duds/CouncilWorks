"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { 
  User, 
  Building2, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  id: string;
  name: string;
  industry: string;
  companySize: string;
  role: string;
  interests: string[];
  visitCount: number;
  lastVisit: Date;
  preferences: {
    notifications: boolean;
    demoRequests: boolean;
    industryUpdates: boolean;
  };
}

interface PersonalizedExperienceProps {
  className?: string;
}

const DEMO_USER_PROFILES: UserProfile[] = [
  {
    id: 'council-manager',
    name: 'Sarah Chen',
    industry: 'Local Government',
    companySize: '500-1000 employees',
    role: 'Asset Manager',
    interests: ['Predictive Maintenance', 'Compliance', 'Cost Reduction'],
    visitCount: 3,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    preferences: {
      notifications: true,
      demoRequests: true,
      industryUpdates: true
    }
  },
  {
    id: 'university-facilities',
    name: 'Dr. Michael Rodriguez',
    industry: 'Higher Education',
    companySize: '1000+ employees',
    role: 'Facilities Director',
    interests: ['Energy Management', 'Campus Infrastructure', 'Research Equipment'],
    visitCount: 7,
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    preferences: {
      notifications: true,
      demoRequests: false,
      industryUpdates: true
    }
  },
  {
    id: 'manufacturing-ops',
    name: 'Jennifer Walsh',
    industry: 'Manufacturing',
    companySize: '200-500 employees',
    role: 'Operations Manager',
    interests: ['Production Optimization', 'Equipment Reliability', 'Safety Compliance'],
    visitCount: 2,
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    preferences: {
      notifications: false,
      demoRequests: true,
      industryUpdates: false
    }
  }
];

const PERSONALIZED_RECOMMENDATIONS = {
  'Local Government': {
    title: 'Council Asset Management Solutions',
    description: 'Optimize your public infrastructure with compliance-focused asset management',
    features: ['Regulatory Compliance', 'Public Transparency', 'Budget Optimization', 'Predictive Maintenance'],
    metrics: ['35% Cost Reduction', '100% Compliance Score', '45% Downtime Reduction']
  },
  'Higher Education': {
    title: 'Campus Infrastructure Intelligence',
    description: 'Transform your university facilities with intelligent asset management',
    features: ['Campus-wide Visibility', 'Research Equipment Optimization', 'Energy Efficiency', 'Student Safety'],
    metrics: ['30% Energy Savings', '70% Equipment Uptime', '25% Maintenance Cost Reduction']
  },
  'Manufacturing': {
    title: 'Production Asset Optimization',
    description: 'Maximize production efficiency with AI-powered asset management',
    features: ['Production Optimization', 'Equipment Reliability', 'Safety Compliance', 'Energy Management'],
    metrics: ['40% Production Efficiency', '60% Equipment Reliability', '50% Safety Compliance']
  }
};

export default function PersonalizedExperience({ className = '' }: PersonalizedExperienceProps) {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate user detection and personalization
    const simulateUserDetection = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly select a demo profile
      const randomProfile = DEMO_USER_PROFILES[Math.floor(Math.random() * DEMO_USER_PROFILES.length)];
      setCurrentProfile(randomProfile);
      setShowPersonalization(true);
      setIsLoading(false);

      // Track personalization event
      trackLandingPageEvent('personalization_detected', {
        user_type: randomProfile.role,
        industry: randomProfile.industry,
        company_size: randomProfile.companySize,
        visit_count: randomProfile.visitCount
      });
    };

    simulateUserDetection();
  }, []);

  const handlePersonalizedAction = (action: string, data: any) => {
    trackLandingPageEvent('personalized_action', {
      action,
      user_profile: currentProfile?.id,
      ...data
    });
  };

  const getRecommendation = () => {
    if (!currentProfile) return null;
    return PERSONALIZED_RECOMMENDATIONS[currentProfile.industry as keyof typeof PERSONALIZED_RECOMMENDATIONS];
  };

  if (isLoading) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentProfile || !showPersonalization) {
    return null;
  }

  const recommendation = getRecommendation();

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Welcome back, {currentProfile.name}!</CardTitle>
                  <p className="text-muted-foreground">
                    We've personalized your experience based on your {currentProfile.industry} role
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Profile Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">{currentProfile.industry}</div>
                  <div className="text-xs text-muted-foreground">{currentProfile.companySize}</div>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">{currentProfile.role}</div>
                  <div className="text-xs text-muted-foreground">Your Role</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">{currentProfile.visitCount} visits</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">
                    {Math.floor((Date.now() - currentProfile.lastVisit.getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                  <div className="text-xs text-muted-foreground">Last Visit</div>
                </div>
              </div>

              {/* Personalized Recommendations */}
              {recommendation && (
                <div className="bg-white/50 rounded-lg p-4 border">
                  <h3 className="font-semibold text-lg mb-2">{recommendation.title}</h3>
                  <p className="text-muted-foreground mb-4">{recommendation.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Key Features for You
                      </h4>
                      <ul className="space-y-1">
                        {recommendation.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        Expected Results
                      </h4>
                      <div className="space-y-2">
                        {recommendation.metrics.map((metric, index) => (
                          <Badge key={index} variant="secondary" className="mr-2">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interest Tags */}
              <div>
                <h4 className="font-medium mb-2">Based on Your Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Personalized CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => handlePersonalizedAction('personalized_demo', {
                    industry: currentProfile.industry,
                    role: currentProfile.role
                  })}
                >
                  Get Personalized Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handlePersonalizedAction('industry_case_study', {
                    industry: currentProfile.industry
                  })}
                >
                  View {currentProfile.industry} Case Study
                </Button>
              </div>

              {/* Preferences */}
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${currentProfile.preferences.notifications ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Industry Updates: {currentProfile.preferences.notifications ? 'Enabled' : 'Disabled'}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentProfile.preferences.demoRequests ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Demo Requests: {currentProfile.preferences.demoRequests ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
