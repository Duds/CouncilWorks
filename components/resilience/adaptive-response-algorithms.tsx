'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AdaptiveAlgorithmType,
  ResponseStrategyType,
  LearningModeType,
  LearningEvent,
  MachineLearningModel,
  AdaptiveResponseResult
} from '@/types/resilience';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Cpu, 
  TrendingUp, 
  BookOpen, 
  Settings, 
  RefreshCw,
  Activity,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface AdaptiveAlgorithmStatus {
  activeModels: number;
  learningEvents: number;
  averageAccuracy: number;
  algorithmTypes: AdaptiveAlgorithmType[];
}

interface AdaptiveData {
  status: AdaptiveAlgorithmStatus;
  learningEvents: LearningEvent[];
  models: MachineLearningModel[];
}

const AdaptiveResponseAlgorithmMonitor: React.FC = () => {
  const [adaptiveData, setAdaptiveData] = useState<AdaptiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdaptiveData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resilience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_adaptive' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        // Convert date strings back to Date objects
        const processedData: AdaptiveData = {
          ...result.data,
          learningEvents: result.data.learningEvents.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp),
            originalSignals: event.originalSignals.map((signal: any) => ({
              ...signal,
              timestamp: new Date(signal.timestamp),
            })),
          })),
          models: result.data.models.map((model: any) => ({
            ...model,
            trainingData: {
              ...model.trainingData,
              lastUpdated: new Date(model.trainingData.lastUpdated),
            },
            performance: {
              ...model.performance,
              lastEvaluated: new Date(model.performance.lastEvaluated),
            },
          })),
        };
        setAdaptiveData(processedData);
      } else {
        setError(result.error || 'Failed to fetch adaptive algorithm data');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdaptiveData();
    const interval = setInterval(fetchAdaptiveData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchAdaptiveData]);

  const getAlgorithmTypeIcon = (type: AdaptiveAlgorithmType) => {
    switch (type) {
      case AdaptiveAlgorithmType.MACHINE_LEARNING:
        return <Brain className="h-4 w-4" />;
      case AdaptiveAlgorithmType.RULE_BASED:
        return <Target className="h-4 w-4" />;
      case AdaptiveAlgorithmType.PATTERN_MATCHING:
        return <Activity className="h-4 w-4" />;
      case AdaptiveAlgorithmType.STATISTICAL_ANALYSIS:
        return <BarChart3 className="h-4 w-4" />;
      case AdaptiveAlgorithmType.HYBRID:
        return <Zap className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'degraded':
        return 'bg-orange-100 text-orange-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading adaptive algorithm data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <span>Error: {error}</span>
        <Button onClick={fetchAdaptiveData} variant="outline" className="ml-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!adaptiveData) {
    return (
      <div className="flex items-center justify-center p-8">
        <span>No adaptive algorithm data available</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Adaptive Response Algorithms</h2>
          <p className="text-gray-600">Machine learning and pattern recognition for intelligent response generation</p>
        </div>
        <Button onClick={fetchAdaptiveData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Active Models</p>
                <p className="text-2xl font-bold">{adaptiveData.status.activeModels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Learning Events</p>
                <p className="text-2xl font-bold">{adaptiveData.status.learningEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Avg Accuracy</p>
                <p className="text-2xl font-bold">{(adaptiveData.status.averageAccuracy * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Algorithm Types</p>
                <p className="text-2xl font-bold">{adaptiveData.status.algorithmTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="learning">Learning Events</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algorithm Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Available Algorithm Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {adaptiveData.status.algorithmTypes.map((type) => (
                    <div key={type} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        {getAlgorithmTypeIcon(type)}
                        <span className="font-medium">{type.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Learning Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recent Learning Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {adaptiveData.learningEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="p-2 border rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {event.originalSignals.length} signals processed
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(event.timestamp)} ago
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Success: {event.actualOutcome.success ? 'Yes' : 'No'} | 
                          Effectiveness: {event.actualOutcome.effectiveness.toFixed(1)}%
                        </div>
                        {event.insights.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {event.insights[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {adaptiveData.models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{model.name || model.type}</span>
                    <Badge className={getModelStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Performance Metrics</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-600">Accuracy</p>
                        <Progress value={model.performance.accuracy * 100} className="h-2" />
                        <p className="text-xs">{(model.performance.accuracy * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">F1 Score</p>
                        <Progress value={model.performance.f1Score * 100} className="h-2" />
                        <p className="text-xs">{(model.performance.f1Score * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Training Data</p>
                    <div className="text-xs text-gray-600">
                      <p>Features: {model.trainingData.features.length}</p>
                      <p>Samples: {model.trainingData.samples}</p>
                      <p>Last Updated: {format(model.trainingData.lastUpdated, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Model Info</p>
                    <div className="text-xs text-gray-600">
                      <p>Type: {model.type}</p>
                      <p>Version: {model.version}</p>
                      <p>Last Evaluated: {format(model.performance.lastEvaluated, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Events Tab */}
        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Learning Event History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {adaptiveData.learningEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Learning Event {event.id.split('-').pop()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(event.timestamp, 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Signals Processed</p>
                          <p className="font-medium">{event.originalSignals.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Actions Generated</p>
                          <p className="font-medium">{event.responseActions.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Success</p>
                          <Badge className={event.actualOutcome.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {event.actualOutcome.success ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-gray-600">Effectiveness</p>
                          <p className="font-medium">{event.actualOutcome.effectiveness.toFixed(1)}%</p>
                        </div>
                      </div>

                      {event.insights.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-blue-600">Insights</p>
                          <ul className="text-sm text-gray-600 mt-1">
                            {event.insights.map((insight, index) => (
                              <li key={index}>• {insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Algorithms Tab */}
        <TabsContent value="algorithms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {adaptiveData.status.algorithmTypes.map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getAlgorithmTypeIcon(type)}
                    <span className="ml-2">{type.replace('_', ' ')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {getAlgorithmDescription(type)}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Available</Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getAlgorithmDescription = (type: AdaptiveAlgorithmType): string => {
  switch (type) {
    case AdaptiveAlgorithmType.MACHINE_LEARNING:
      return 'Uses machine learning models to predict optimal responses based on historical data and patterns.';
    case AdaptiveAlgorithmType.RULE_BASED:
      return 'Applies predefined rules and logic to determine appropriate responses based on signal characteristics.';
    case AdaptiveAlgorithmType.PATTERN_MATCHING:
      return 'Identifies patterns in signal sequences and generates responses based on similar historical patterns.';
    case AdaptiveAlgorithmType.STATISTICAL_ANALYSIS:
      return 'Uses statistical analysis to identify trends and correlations for data-driven response generation.';
    case AdaptiveAlgorithmType.HYBRID:
      return 'Combines multiple algorithm approaches for comprehensive and robust response generation.';
    default:
      return 'Advanced algorithm for intelligent response generation.';
  }
};

export default AdaptiveResponseAlgorithmMonitor;
