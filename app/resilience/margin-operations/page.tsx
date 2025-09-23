'use client';

import AppLayout from '@/components/layout/app-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertTriangle,
    BarChart3,
    Bell,
    Clock,
    Package,
    RefreshCw,
    Shield,
    Users,
    Wrench,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResilienceSignal {
  id: string;
  signalType: 'ENVIRONMENTAL' | 'OPERATIONAL' | 'COMMUNITY' | 'TECHNICAL';
  source: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  assetId?: string;
  assetName?: string;
  servicePurpose?: string;
  detectedAt: string;
  responseStatus: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  responseRequired: boolean;
}

interface MarginOperation {
  id: string;
  operationType: 'PREVENTIVE' | 'RESPONSIVE' | 'EMERGENCY' | 'CAPACITY_BUILDING';
  resourceType: 'STAFF' | 'EQUIPMENT' | 'CONTRACTORS' | 'MATERIALS';
  currentUtilization: number;
  availableCapacity: number;
  emergencyThreshold: number;
  lastDeployed?: string;
  deploymentReason?: string;
  effectiveness?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ResilienceMetrics {
  overallScore: number;
  marginUtilization: number;
  signalResponseTime: number;
  systemStrength: number;
  learningRate: number;
  antifragileScore: number;
}

/**
 * Margin Operations Component
 * Implements Aegrid Rules 3 & 4: Respond to Real World + Operate with Margin
 * Provides signal response and margin management capabilities
 * @component MarginOperations
 * @example
 * ```tsx
 * <MarginOperations />
 * ```
 * @accessibility
 * - ARIA roles: main, region, tablist, tabpanel
 * - Keyboard navigation: Tab through operations sections
 * - Screen reader: Announces signal alerts and margin status
 */
export default function MarginOperations() {
  const [resilienceSignals, setResilienceSignals] = useState<ResilienceSignal[]>([]);
  const [marginOperations, setMarginOperations] = useState<MarginOperation[]>([]);
  const [resilienceMetrics, setResilienceMetrics] = useState<ResilienceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real data from API
  useEffect(() => {
    const loadMarginOperationsData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/resilience/margin-operations/data', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch margin operations data');
        }

        const result = await response.json();

        if (result.success) {
          setResilienceSignals(result.data.resilienceSignals);
          setMarginOperations(result.data.marginOperations);
          setResilienceMetrics(result.data.resilienceMetrics);
        } else {
          throw new Error(result.error || 'Failed to load margin operations data');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading margin operations data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load margin operations data');
        setLoading(false);
      }
    };

    loadMarginOperationsData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'ESCALATED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'STAFF':
        return Users;
      case 'EQUIPMENT':
        return Wrench;
      case 'CONTRACTORS':
        return Users;
      case 'MATERIALS':
        return Package;
      default:
        return Package;
    }
  };

  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return 'destructive';
      case 'RESPONSIVE':
        return 'secondary';
      case 'PREVENTIVE':
        return 'default';
      case 'CAPACITY_BUILDING':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const criticalSignals = resilienceSignals.filter(s => s.severity === 'CRITICAL').length;
  const pendingResponses = resilienceSignals.filter(s => s.responseStatus === 'PENDING').length;
  const avgResponseTime = resilienceMetrics?.signalResponseTime || 0;
  const marginUtilization = resilienceMetrics?.marginUtilization || 0;

  if (loading) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
        title="Margin Operations"
        description="Signal response and margin management dashboard"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading Margin Operations..." />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
        title="Margin Operations"
        description="Signal response and margin management dashboard"
      >
        <Alert variant="destructive" className="m-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Margin Operations"
      description="Signal response and margin management dashboard"
    >
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Margin Operations</h1>
          <p className="text-muted-foreground">
            Signal response and margin management aligned with Aegrid Rules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Signals
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Deploy Emergency Resources
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resilience Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resilienceMetrics?.overallScore}%</div>
            <p className="text-xs text-muted-foreground">
              Overall system resilience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Signals</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalSignals}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}h</div>
            <p className="text-xs text-muted-foreground">
              Average signal response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margin Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marginUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              Operational margin usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="signals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="signals">Signal Processing</TabsTrigger>
          <TabsTrigger value="margin">Margin Utilization</TabsTrigger>
          <TabsTrigger value="metrics">Resilience Metrics</TabsTrigger>
        </TabsList>

        {/* Signal Processing Tab */}
        <TabsContent value="signals" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {resilienceSignals.map((signal) => {
              const timeAgo = new Date(signal.detectedAt).toLocaleString('en-AU');
              return (
                <Card key={signal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{signal.description}</CardTitle>
                        <CardDescription>
                          {signal.assetName} • {signal.servicePurpose}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(signal.severity)}>
                          {signal.severity}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(signal.responseStatus)}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Signal Type</div>
                        <div className="font-medium">{signal.signalType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Source</div>
                        <div className="font-medium">{signal.source}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Detected</div>
                        <div className="font-medium">{timeAgo}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Response Status</div>
                        <div className="font-medium">{signal.responseStatus}</div>
                      </div>
                    </div>
                    {signal.responseRequired && (
                      <div className="mt-4">
                        <Button size="sm" variant="outline">
                          <Zap className="h-4 w-4 mr-2" />
                          Deploy Response
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Margin Utilization Tab */}
        <TabsContent value="margin" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marginOperations.map((operation) => {
              const ResourceIcon = getResourceIcon(operation.resourceType);
              const utilizationPercent = operation.currentUtilization;
              const capacityPercent = operation.availableCapacity;
              const isNearThreshold = capacityPercent <= operation.emergencyThreshold + 10;

              return (
                <Card key={operation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ResourceIcon className="h-5 w-5" />
                        <CardTitle className="text-lg">{operation.resourceType}</CardTitle>
                      </div>
                      <Badge variant={getOperationTypeColor(operation.operationType)}>
                        {operation.operationType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Utilization Visualization */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Current Utilization</span>
                          <span className="font-bold">{utilizationPercent}%</span>
                        </div>
                        <Progress
                          value={utilizationPercent}
                          className={`h-2 ${isNearThreshold ? 'bg-yellow-500' : ''}`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Available Capacity</span>
                          <span className="font-bold">{capacityPercent}%</span>
                        </div>
                        <Progress value={capacityPercent} className="h-2" />
                      </div>

                      {/* Operation Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Emergency Threshold</div>
                          <div className="font-medium">{operation.emergencyThreshold}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Effectiveness</div>
                          <div className="font-medium">
                            {operation.effectiveness ? `${Math.round(operation.effectiveness * 100)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Last Deployment */}
                      {operation.lastDeployed && (
                        <div className="border-t pt-3">
                          <div className="text-sm text-muted-foreground mb-1">Last Deployed</div>
                          <div className="font-medium text-sm">
                            {new Date(operation.lastDeployed).toLocaleDateString('en-AU')}
                          </div>
                          {operation.deploymentReason && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {operation.deploymentReason}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Emergency Deploy Button */}
                      {isNearThreshold && (
                        <Button size="sm" variant="destructive" className="w-full">
                          <Zap className="h-4 w-4 mr-2" />
                          Emergency Deploy
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Resilience Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          {resilienceMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Strength</CardTitle>
                  <CardDescription>Overall system resilience under stress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{resilienceMetrics.systemStrength}%</div>
                  <Progress value={resilienceMetrics.systemStrength} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Rate</CardTitle>
                  <CardDescription>System improvement from events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{Math.round(resilienceMetrics.learningRate * 100)}%</div>
                  <Progress value={resilienceMetrics.learningRate * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Antifragile Score</CardTitle>
                  <CardDescription>System benefits from stress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{resilienceMetrics.antifragileScore}%</div>
                  <Progress value={resilienceMetrics.antifragileScore} className="h-2" />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}
