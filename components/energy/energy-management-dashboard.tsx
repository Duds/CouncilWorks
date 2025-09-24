"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    CheckCircle,
    Clock,
    PieChart,
    Settings,
    Target,
    TrendingDown,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface EnergyManagementDashboardProps {
  data: any;
  period: string;
  onPeriodChange: (period: string) => void;
}

/**
 * Energy Management Dashboard Component - E21
 *
 * Comprehensive energy management overview implementing The Aegrid Rules
 *
 * @component EnergyManagementDashboard
 * @example
 * ```tsx
 * <EnergyManagementDashboard
 *   data={dashboardData}
 *   period="MONTHLY"
 *   onPeriodChange={setPeriod}
 * />
 * ```
 * @accessibility
 * - ARIA roles: main, progressbar, status
 * - Keyboard navigation: Tab through dashboard elements
 * - Screen reader: Announces energy metrics and status
 */
export function EnergyManagementDashboard({ data, period, onPeriodChange }: EnergyManagementDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      fetchAnalyticsData();
    }
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/energy/analytics?action=efficiency-trends&period=${period}`);
      const analytics = await response.json();

      if (analytics.success) {
        setAnalyticsData(analytics.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No energy data available</p>
      </div>
    );
  }

  const getEfficiencyStatus = (score: number) => {
    if (score >= 85) return { status: 'Excellent', color: 'bg-green-500', badge: 'success' };
    if (score >= 75) return { status: 'Good', color: 'bg-blue-500', badge: 'default' };
    if (score >= 65) return { status: 'Fair', color: 'bg-yellow-500', badge: 'warning' };
    return { status: 'Poor', color: 'bg-red-500', badge: 'destructive' };
  };

  const getAlertSeverity = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'default';
      default: return 'default';
    }
  };

  const calculateEnergyTrend = () => {
    if (!data.recentConsumption || data.recentConsumption.length < 2) return 0;

    const recent = data.recentConsumption.slice(0, 7);
    const older = data.recentConsumption.slice(7, 14);

    const recentAvg = recent.reduce((sum: number, item: any) => sum + Number(item.consumptionValue || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum: number, item: any) => sum + Number(item.consumptionValue || 0), 0) / older.length;

    return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  };

  const energyTrend = calculateEnergyTrend();

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Energy Overview</h2>
        </div>

        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOURLY">Hourly</SelectItem>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Energy Consumption Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
            {energyTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(energyTrend).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {energyTrend >= 0 ? 'Increase' : 'Decrease'} from previous period
            </p>
            <div className="mt-2">
              <Progress
                value={Math.min(Math.abs(energyTrend), 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Energy Efficiency Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {(() => {
              const avgEfficiency = data.efficiencyMetrics?.reduce((sum: number, item: any) =>
                sum + Number(item.efficiencyScore || 0), 0
              ) / (data.efficiencyMetrics?.length || 1) || 0;

              const efficiencyStatus = getEfficiencyStatus(avgEfficiency);

              return (
                <>
                  <div className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Average efficiency score
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Progress value={avgEfficiency} className="h-2 flex-1" />
                    <Badge variant={efficiencyStatus.badge as any}>
                      {efficiencyStatus.status}
                    </Badge>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>

        {/* Carbon Intensity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Intensity</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.carbonSummary?.totalEmissions ?
                (data.carbonSummary.totalEmissions / (data.recentConsumption?.reduce((sum: number, item: any) =>
                  sum + Number(item.consumptionValue || 0), 0) || 1)).toFixed(3) : '0.000'
              } kg CO₂e/kWh
            </div>
            <p className="text-xs text-muted-foreground">
              Emissions per unit energy
            </p>
            <div className="mt-2">
              <Badge variant={data.carbonSummary?.totalEmissions > 1000 ? 'destructive' : 'default'}>
                {data.carbonSummary?.totalEmissions > 1000 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts and Optimisation Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Energy Alerts</span>
              <Badge variant="outline">{data.activeAlerts?.length || 0}</Badge>
            </CardTitle>
            <CardDescription>
              Energy anomalies and issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.activeAlerts && data.activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {data.activeAlerts.slice(0, 5).map((alert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <Badge variant={getAlertSeverity(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.asset?.name || alert.meter?.name} • {new Date(alert.detectedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
                {data.activeAlerts.length > 5 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      View All {data.activeAlerts.length} Alerts
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active alerts</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optimisation Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Optimisation Actions</span>
              <Badge variant="outline">{data.optimisationActions?.length || 0}</Badge>
            </CardTitle>
            <CardDescription>
              Automated energy optimisation and efficiency improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.optimisationActions && data.optimisationActions.length > 0 ? (
              <div className="space-y-3">
                {data.optimisationActions.slice(0, 5).map((action: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium">{action.actionType.replace(/_/g, ' ')}</h4>
                        <Badge variant={
                          action.status === 'COMPLETED' ? 'default' :
                          action.status === 'EXECUTING' ? 'warning' :
                          action.status === 'PENDING' ? 'outline' : 'destructive'
                        }>
                          {action.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.asset?.name} • {new Date(action.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {action.expectedSavings && (
                        <div className="text-xs text-green-600 font-medium">
                          ${action.expectedSavings.toFixed(2)} savings
                        </div>
                      )}
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {data.optimisationActions.length > 5 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      View All {data.optimisationActions.length} Actions
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No optimisation actions scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Energy Efficiency Metrics Summary */}
      {data.efficiencyMetrics && data.efficiencyMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Energy Efficiency Overview</span>
            </CardTitle>
            <CardDescription>
              Performance metrics across all monitored assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {data.efficiencyMetrics.slice(0, 4).map((metric: any, index: number) => {
                const efficiencyStatus = getEfficiencyStatus(Number(metric.efficiencyScore));

                return (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {Number(metric.efficiencyScore).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {metric.asset?.name || 'Unknown Asset'}
                    </div>
                    <div className="space-y-2">
                      <Progress value={Number(metric.efficiencyScore)} className="h-2" />
                      <Badge variant={efficiencyStatus.badge as any} className="text-xs">
                        {efficiencyStatus.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
