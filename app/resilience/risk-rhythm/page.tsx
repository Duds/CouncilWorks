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
    Calendar,
    Clock,
    RefreshCw,
    Settings
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RiskProfile {
  id: string;
  assetId: string;
  assetName: string;
  assetType: string;
  servicePurpose: string;
  consequenceScore: number;
  likelihoodScore: number;
  riskScore: number;
  seasonalAdjustment: number;
  weatherAdjustment: number;
  usageAdjustment: number;
  maintenanceFrequency: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface MaintenanceSchedule {
  id: string;
  assetId: string;
  assetName: string;
  taskName: string;
  taskType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  baseFrequency: number;
  riskMultiplier: number;
  adjustedFrequency: number;
  scheduledDate: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedTo?: string;
}

interface SeasonalProfile {
  season: string;
  adjustmentFactor: number;
  description: string;
  affectedAssets: number;
}

/**
 * Risk Rhythm Component
 * Implements Aegrid Rule 2: Match Maintenance to Risk
 * Provides dynamic risk-based scheduling and prioritization
 * @component RiskRhythm
 * @example
 * ```tsx
 * <RiskRhythm />
 * ```
 * @accessibility
 * - ARIA roles: main, region, tablist, tabpanel
 * - Keyboard navigation: Tab through risk analysis sections
 * - Screen reader: Announces risk scores and schedule priorities
 */
export default function RiskRhythm() {
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [seasonalProfiles, setSeasonalProfiles] = useState<SeasonalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real data from API
  useEffect(() => {
    const loadRiskRhythmData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/resilience/risk-rhythm/data', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch risk rhythm data');
        }

        const result = await response.json();

        if (result.success) {
          setRiskProfiles(result.data.riskProfiles);
          setMaintenanceSchedules(result.data.maintenanceSchedules);
          setSeasonalProfiles(result.data.seasonalProfiles);
        } else {
          throw new Error(result.error || 'Failed to load risk rhythm data');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading risk rhythm data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load risk rhythm data');
        setLoading(false);
      }
    };

    loadRiskRhythmData();
  }, []);

  const getRiskLevel = (score: number) => {
    if (score >= 40) return { level: 'CRITICAL', color: 'destructive' };
    if (score >= 25) return { level: 'HIGH', color: 'destructive' };
    if (score >= 15) return { level: 'MEDIUM', color: 'secondary' };
    return { level: 'LOW', color: 'outline' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'OVERDUE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const highRiskAssets = riskProfiles.filter(p => p.riskScore >= 25).length;
  const overdueTasks = maintenanceSchedules.filter(s => s.status === 'OVERDUE').length;
  const avgRiskScore = riskProfiles.length > 0
    ? Math.round(riskProfiles.reduce((sum, p) => sum + p.riskScore, 0) / riskProfiles.length)
    : 0;

  if (loading) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
        title="Risk Rhythm"
        description="Dynamic risk-based scheduling and prioritization"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading Risk Rhythm..." />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
        title="Risk Rhythm"
        description="Dynamic risk-based scheduling and prioritization"
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
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Risk Rhythm"
      description="Dynamic risk-based scheduling and prioritization"
    >
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Rhythm</h1>
          <p className="text-muted-foreground">
            Dynamic risk-based scheduling aligned with Aegrid Rules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Risks
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Adjust Priorities
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRiskScore}</div>
            <p className="text-xs text-muted-foreground">
              Across {riskProfiles.length} assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Assets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskAssets}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceSchedules.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles">Risk Profiles</TabsTrigger>
          <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Adjustments</TabsTrigger>
        </TabsList>

        {/* Risk Profiles Tab */}
        <TabsContent value="profiles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {riskProfiles.map((profile) => {
              const riskLevel = getRiskLevel(profile.riskScore);
              return (
                <Card key={profile.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{profile.assetName}</CardTitle>
                        <CardDescription>{profile.servicePurpose}</CardDescription>
                      </div>
                      <Badge variant={riskLevel.color}>
                        {riskLevel.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Risk Score Visualization */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Risk Score</span>
                          <span className="font-bold">{profile.riskScore}</span>
                        </div>
                        <Progress value={(profile.riskScore / 100) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Consequence: {profile.consequenceScore}</span>
                          <span>Likelihood: {profile.likelihoodScore}</span>
                        </div>
                      </div>

                      {/* Adjustment Factors */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-medium">Seasonal</div>
                          <div className="text-blue-600">{profile.seasonalAdjustment}x</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-medium">Weather</div>
                          <div className="text-green-600">{profile.weatherAdjustment}x</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-medium">Usage</div>
                          <div className="text-purple-600">{profile.usageAdjustment}x</div>
                        </div>
                      </div>

                      {/* Maintenance Schedule */}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Maintenance Frequency:</span>
                          <span className="font-medium">{profile.maintenanceFrequency} days</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next Due:</span>
                          <span className="font-medium">
                            {profile.nextMaintenance ? new Date(profile.nextMaintenance).toLocaleDateString('en-AU') : 'Not scheduled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Maintenance Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {maintenanceSchedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{schedule.taskName}</CardTitle>
                      <CardDescription>{schedule.assetName}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(schedule.priority)}>
                        {schedule.priority}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(schedule.status)}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Task Type</div>
                      <div className="font-medium">{schedule.taskType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Frequency Adjustment</div>
                      <div className="font-medium">{schedule.riskMultiplier}x</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Due Date</div>
                      <div className="font-medium">
                        {new Date(schedule.dueDate).toLocaleDateString('en-AU')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Assigned To</div>
                      <div className="font-medium">{schedule.assignedTo || 'Unassigned'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Seasonal Adjustments Tab */}
        <TabsContent value="seasonal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonalProfiles.map((profile) => (
              <Card key={profile.season}>
                <CardHeader>
                  <CardTitle className="text-lg">{profile.season}</CardTitle>
                  <CardDescription>Adjustment Factor: {profile.adjustmentFactor}x</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {profile.description}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Affected Assets:</span>
                      <span className="font-medium">{profile.affectedAssets}</span>
                    </div>
                    <Progress
                      value={profile.adjustmentFactor * 50}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}
