"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle,
    Pause,
    Play,
    RotateCcw,
    Shield,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  data?: {
    assets: number;
    alerts: number;
    savings: string;
    efficiency: string;
  };
  highlight?: string;
}

interface InteractiveDemoProps {
  className?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'See all your assets at a glance with intelligent prioritization',
    icon: Shield,
    duration: 3000,
    data: {
      assets: 1247,
      alerts: 3,
      savings: '$47,500',
      efficiency: '94%'
    },
    highlight: 'Every Asset Has a Purpose'
  },
  {
    id: 'risk-analysis',
    title: 'Risk Analysis',
    description: 'AI-powered risk assessment showing critical assets needing attention',
    icon: AlertTriangle,
    duration: 4000,
    data: {
      assets: 1247,
      alerts: 12,
      savings: '$89,200',
      efficiency: '87%'
    },
    highlight: 'Risk Sets the Rhythm'
  },
  {
    id: 'maintenance-optimization',
    title: 'Maintenance Optimization',
    description: 'Smart scheduling based on actual risk and condition data',
    icon: TrendingUp,
    duration: 3500,
    data: {
      assets: 1247,
      alerts: 8,
      savings: '$156,800',
      efficiency: '91%'
    },
    highlight: 'Respond to the Real World'
  },
  {
    id: 'energy-optimization',
    title: 'Energy Optimization',
    description: 'Real-time energy monitoring with anomaly detection',
    icon: Zap,
    duration: 3000,
    data: {
      assets: 1247,
      alerts: 5,
      savings: '$203,400',
      efficiency: '96%'
    },
    highlight: 'Operate with Margin'
  }
];

export default function InteractiveDemo({ className = '' }: InteractiveDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentDemo = DEMO_STEPS[currentStep];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      const startTime = Date.now();
      const totalDuration = currentDemo.duration;

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          setProgress(0);
          setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length);

          // Track demo progression
          trackLandingPageEvent('demo_step_completed', {
            step: currentDemo.id,
            step_title: currentDemo.title,
            total_steps: DEMO_STEPS.length,
            current_step: currentStep + 1
          });
        }
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentDemo.duration, currentDemo.id, currentDemo.title, currentStep]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      trackLandingPageEvent('demo_paused', {
        step: currentDemo.id,
        progress: progress
      });
    } else {
      setIsPlaying(true);
      trackLandingPageEvent('demo_started', {
        step: currentDemo.id,
        is_resume: progress > 0
      });
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    trackLandingPageEvent('demo_reset', {
      step: currentDemo.id
    });
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setIsPlaying(false);
    trackLandingPageEvent('demo_step_selected', {
      step: DEMO_STEPS[stepIndex].id,
      step_title: DEMO_STEPS[stepIndex].title
    });
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          See Aegrid in Action
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch how The Aegrid Rules transform complex asset management into intelligent, resilient systems
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Demo Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentDemo.icon className="w-5 h-5" />
                {currentDemo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {currentDemo.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayPause}
                  variant={isPlaying ? "outline" : "default"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Play
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              {/* Step Navigation */}
              <div className="grid grid-cols-2 gap-2">
                {DEMO_STEPS.map((step, index) => (
                  <Button
                    key={step.id}
                    variant={currentStep === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStepClick(index)}
                    className="text-xs"
                  >
                    {step.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Highlight Badge */}
          <div className="text-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              {currentDemo.highlight}
            </Badge>
          </div>
        </div>

        {/* Demo Visualization */}
        <div className="relative">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative">
                {/* Mock Dashboard */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDemo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-4 bg-white rounded-lg shadow-lg p-6"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Aegrid Dashboard</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-muted-foreground">Live</span>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-600">
                            {currentDemo.data?.assets.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Assets</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-orange-600">
                            {currentDemo.data?.alerts}
                          </div>
                          <div className="text-sm text-muted-foreground">Active Alerts</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-600">
                            {currentDemo.data?.savings}
                          </div>
                          <div className="text-sm text-muted-foreground">Annual Savings</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-600">
                            {currentDemo.data?.efficiency}
                          </div>
                          <div className="text-sm text-muted-foreground">Efficiency</div>
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div className="bg-muted/30 rounded-lg h-20 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <currentDemo.icon className="w-5 h-5" />
                          <span className="text-sm">{currentDemo.title} Visualization</span>
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>System Healthy</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span>{currentDemo.data?.alerts} Issues</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* CTA Overlay */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <Button className="flex items-center gap-2 shadow-lg">
              Start Your Pilot Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
