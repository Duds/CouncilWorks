/**
 * Advanced Analytics & AI Dashboard UI
 *
 * Implements comprehensive dashboard for predictive analytics, AI intelligence, and decision support
 *
 * @fileoverview Advanced analytics and AI dashboard UI component
 */

'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Brain,
    CheckCircle,
    Download,
    Eye,
    EyeOff,
    Lightbulb,
    Pause,
    Play,
    Plus,
    RefreshCw,
    Settings,
    Target,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PredictiveModel {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  accuracy: number;
  lastTrained: string;
}

interface AssetIntelligence {
  id: string;
  assetId: string;
  intelligenceType: string;
  confidence: number;
  severity: string;
  title: string;
  description: string;
  status: string;
  timestamp: string;
}

interface DecisionScenario {
  id: string;
  name: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  status: string;
  lastRun?: string;
  nextRun?: string;
}

export default function AdvancedAnalyticsDashboard() {
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [intelligence, setIntelligence] = useState<AssetIntelligence[]>([]);
  const [scenarios, setScenarios] = useState<DecisionScenario[]>([]);
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch models
      const modelsResponse = await fetch('/api/analytics/models');
      if (!modelsResponse.ok) throw new Error('Failed to fetch models');
      const modelsData = await modelsResponse.json();
      setModels(modelsData.models || []);

      // Fetch intelligence
      const intelligenceResponse = await fetch('/api/analytics/intelligence');
      if (!intelligenceResponse.ok) throw new Error('Failed to fetch intelligence');
      const intelligenceData = await intelligenceResponse.json();
      setIntelligence(intelligenceData.intelligence || []);

      // Fetch scenarios
      const scenariosResponse = await fetch('/api/analytics/decisions');
      if (!scenariosResponse.ok) throw new Error('Failed to fetch scenarios');
      const scenariosData = await scenariosResponse.json();
      setScenarios(scenariosData.scenarios || []);

      // Fetch workflows
      const workflowsResponse = await fetch('/api/analytics/workflows');
      if (!workflowsResponse.ok) throw new Error('Failed to fetch workflows');
      const workflowsData = await workflowsResponse.json();
      setWorkflows(workflowsData.workflows || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'ready': return 'bg-blue-500';
      case 'training': return 'bg-yellow-500';
      case 'retired': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'acknowledged': return 'bg-blue-500';
      case 'resolved': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'analyzing': return 'bg-blue-500';
      case 'recommended': return 'bg-green-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics & AI</h1>

        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={fetchAnalyticsData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictive Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.length}</div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intelligence.length}</div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decision Scenarios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scenarios.length}</div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>

          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Predictive Models</TabsTrigger>
          <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
          <TabsTrigger value="decisions">Decision Support</TabsTrigger>
          <TabsTrigger value="workflows">AI Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent AI Insights
                </CardTitle>
                <CardDescription>Latest AI-powered asset intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>

                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getSeverityColor(item.severity)}>
                            {item.severity}
                          </Badge>
                          <Badge variant="outline">
                            {item.intelligenceType}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(item.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Model Performance
                </CardTitle>
                <CardDescription>Performance metrics for deployed models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {models.filter(m => m.status === 'deployed').map((model) => (
                    <div key={model.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{model.name}</h4>
                        <Badge className={getStatusColor(model.status)}>
                          {model.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Accuracy</span>
                          <span>{Math.round(model.accuracy * 100)}%</span>
                        </div>
                        <Progress value={model.accuracy * 100} className="h-2" />
                      </div>

                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recent Decision Scenarios
              </CardTitle>
              <CardDescription>Latest decision support scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarios.slice(0, 3).map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{scenario.name}</h4>

                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getPriorityColor(scenario.priority)}>
                          {scenario.priority}
                        </Badge>
                        <Badge variant="outline">
                          {scenario.type}
                        </Badge>
                        <Badge className={getStatusColor(scenario.status)}>
                          {scenario.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Predictive Models
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Model
                </Button>
              </CardTitle>
              <CardDescription>Manage predictive analytics models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{model.name}</h4>

                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">{model.type}</Badge>
                        <Badge className={getStatusColor(model.status)}>
                          {model.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Accuracy: {Math.round(model.accuracy * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI Intelligence
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Insights
                </Button>
              </CardTitle>
              <CardDescription>AI-powered asset intelligence and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intelligence.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>

                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                        <Badge variant="outline">
                          {item.intelligenceType}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(item.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Decision Support
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </CardTitle>
              <CardDescription>Intelligent decision support scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{scenario.name}</h4>

                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getPriorityColor(scenario.priority)}>
                          {scenario.priority}
                        </Badge>
                        <Badge variant="outline">
                          {scenario.type}
                        </Badge>
                        <Badge className={getStatusColor(scenario.status)}>
                          {scenario.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Created: {new Date(scenario.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Workflows
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </CardTitle>
              <CardDescription>Automated AI workflows and processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{workflow.name}</h4>

                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        {workflow.lastRun && (
                          <span className="text-sm text-muted-foreground">
                            Last run: {new Date(workflow.lastRun).toLocaleDateString()}
                          </span>
                        )}
                        {workflow.nextRun && (
                          <span className="text-sm text-muted-foreground">
                            Next run: {new Date(workflow.nextRun).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
