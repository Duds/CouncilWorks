/**
 * Antifragile System React Component
 * 
 * UI component for monitoring and interacting with the antifragile system
 * Aligned with The Aegrid Rules for resilient asset management
 * 
 * @file components/resilience/antifragile-system.tsx
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Activity, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  AntifragilePattern, 
  StressEvent, 
  StressAdaptationType 
} from '@/types/resilience';

interface AntifragileSystemProps {
  className?: string;
}

interface AntifragileStatus {
  activePatterns: AntifragilePattern[];
  recentAdaptations: number;
  successRate: number;
  antifragileScore: number;
}

interface AntifragileData {
  status: AntifragileStatus;
  patterns: AntifragilePattern[];
  stressEvents: StressEvent[];
  adaptationHistory: Array<{
    timestamp: Date;
    adaptationType: StressAdaptationType;
    performanceImpact: number;
    success: boolean;
  }>;
}

export function AntifragileSystem({ className }: AntifragileSystemProps) {
  const [data, setData] = useState<AntifragileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAntifragileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resilience/antifragile');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Failed to fetch antifragile data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAntifragileData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAntifragileData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAdaptationIcon = (type: StressAdaptationType) => {
    switch (type) {
      case StressAdaptationType.CAPACITY_SCALING:
        return <TrendingUp className="h-4 w-4" />;
      case StressAdaptationType.EFFICIENCY_IMPROVEMENT:
        return <Zap className="h-4 w-4" />;
      case StressAdaptationType.REDUNDANCY_ENHANCEMENT:
        return <Target className="h-4 w-4" />;
      case StressAdaptationType.STRESS_LEARNING:
        return <Brain className="h-4 w-4" />;
      case StressAdaptationType.THRESHOLD_ADAPTATION:
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getAdaptationColor = (type: StressAdaptationType) => {
    switch (type) {
      case StressAdaptationType.CAPACITY_SCALING:
        return 'bg-blue-100 text-blue-800';
      case StressAdaptationType.EFFICIENCY_IMPROVEMENT:
        return 'bg-green-100 text-green-800';
      case StressAdaptationType.REDUNDANCY_ENHANCEMENT:
        return 'bg-purple-100 text-purple-800';
      case StressAdaptationType.STRESS_LEARNING:
        return 'bg-orange-100 text-orange-800';
      case StressAdaptationType.THRESHOLD_ADAPTATION:
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Antifragile System
          </CardTitle>
          <CardDescription>
            Systems that get stronger under stress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading antifragile system...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Antifragile System
          </CardTitle>
          <CardDescription>
            Systems that get stronger under stress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load antifragile system: {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={fetchAntifragileData} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Antifragile System
            </CardTitle>
            <CardDescription>
              Systems that get stronger under stress
            </CardDescription>
          </div>
          <Button 
            onClick={fetchAntifragileData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Antifragile Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Antifragile Score
                      </p>
                      <p className="text-2xl font-bold">
                        {data.status.antifragileScore}
                      </p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-500" />
                  </div>
                  <Progress 
                    value={data.status.antifragileScore} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Patterns
                      </p>
                      <p className="text-2xl font-bold">
                        {data.status.activePatterns.length}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Success Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {Math.round(data.status.successRate * 100)}%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recent adaptations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Adaptations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Adaptations</CardTitle>
                <CardDescription>
                  Last {Math.min(5, data.adaptationHistory.length)} adaptations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.adaptationHistory.slice(-5).reverse().map((adaptation, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getAdaptationIcon(adaptation.adaptationType)}
                        <div>
                          <p className="font-medium">
                            {adaptation.adaptationType.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {adaptation.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={adaptation.success ? "default" : "destructive"}
                        >
                          {adaptation.success ? 'Success' : 'Failed'}
                        </Badge>
                        <span className="text-sm font-medium">
                          +{adaptation.performanceImpact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="grid gap-4">
              {data.patterns.map((pattern) => (
                <Card key={pattern.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pattern.name}</CardTitle>
                      <Badge variant={pattern.isActive ? "default" : "secondary"}>
                        {pattern.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription>{pattern.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Trigger Conditions
                        </p>
                        <p className="text-sm">
                          Min Stress: {pattern.triggerConditions.minStressLevel}%
                        </p>
                        <p className="text-sm">
                          Duration: {pattern.triggerConditions.durationThreshold / 1000}s
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Adaptations
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pattern.adaptations.map((adaptation, index) => (
                            <Badge 
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {adaptation.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Performance
                        </p>
                        <p className="text-sm">
                          Activations: {pattern.activationCount}
                        </p>
                        <p className="text-sm">
                          Success Rate: {Math.round(pattern.successRate * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="space-y-4">
              {data.stressEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Stress Event - {event.timestamp.toLocaleString()}
                      </CardTitle>
                      <Badge variant={event.outcome.success ? "default" : "destructive"}>
                        {event.outcome.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Stress Level: {event.stressLevel}% | Duration: {event.duration}ms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          System Response
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            Response Time: {event.systemResponse.performanceMetrics.responseTime}ms
                          </p>
                          <p className="text-sm">
                            Throughput: {event.systemResponse.performanceMetrics.throughput} req/s
                          </p>
                          <p className="text-sm">
                            Error Rate: {(event.systemResponse.performanceMetrics.errorRate * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Outcome
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            Performance Improvement: +{event.outcome.performanceImprovement}%
                          </p>
                          <p className="text-sm">
                            Lessons Learned: {event.outcome.lessonsLearned.length}
                          </p>
                          <p className="text-sm">
                            System Improvements: {event.outcome.systemImprovements.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-2">
              {data.adaptationHistory.map((adaptation, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getAdaptationIcon(adaptation.adaptationType)}
                    <div>
                      <p className="font-medium">
                        {adaptation.adaptationType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {adaptation.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={adaptation.success ? "default" : "destructive"}
                    >
                      {adaptation.success ? 'Success' : 'Failed'}
                    </Badge>
                    <span className="text-sm font-medium">
                      +{adaptation.performanceImpact}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
