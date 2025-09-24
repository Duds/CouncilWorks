"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle,
    Award,
    BarChart3,
    CheckCircle,
    PieChart,
    Target,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";

interface EnergyEfficiencyMetricsProps {
  data: any[];
  period: string;
}

/**
 * Energy Efficiency Metrics Component - E21
 *
 * Energy efficiency tracking and benchmarking
 *
 * @component EnergyEfficiencyMetrics
 * @example
 * ```tsx
 * <EnergyEfficiencyMetrics
 *   data={efficiencyData}
 *   period="MONTHLY"
 * />
 * ```
 * @accessibility
 * - ARIA roles: main, progressbar, status
 * - Keyboard navigation: Tab through efficiency metrics
 * - Screen reader: Announces efficiency scores and benchmarks
 */
export function EnergyEfficiencyMetrics({ data, period }: EnergyEfficiencyMetricsProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("efficiency");

  useEffect(() => {
    if (data && data.length > 0) {
      fetchAnalyticsData();
    }
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/energy/analytics?action=benchmarking&period=${period}`);
      const analytics = await response.json();

      if (analytics.success) {
        setAnalyticsData(analytics.data);
      }
    } catch (error) {
      console.error('Failed to fetch efficiency analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEfficiencyStatus = (score: number) => {
    if (score >= 85) return { status: 'Excellent', color: 'bg-green-500', badge: 'default', icon: Award };
    if (score >= 75) return { status: 'Good', color: 'bg-blue-500', badge: 'default', icon: CheckCircle };
    if (score >= 65) return { status: 'Fair', color: 'bg-yellow-500', badge: 'warning', icon: AlertTriangle };
    return { status: 'Poor', color: 'bg-red-500', badge: 'destructive', icon: AlertTriangle };
  };

  const calculateOverallEfficiency = () => {
    if (!data || data.length === 0) return 0;

    return data.reduce((sum, item) => sum + Number(item.efficiencyScore || 0), 0) / data.length;
  };

  const getTopPerformers = () => {
    if (!data || data.length === 0) return [];

    return data
      .filter(item => Number(item.efficiencyScore) >= 80)
      .sort((a, b) => Number(b.efficiencyScore) - Number(a.efficiencyScore))
      .slice(0, 5);
  };

  const getUnderPerformers = () => {
    if (!data || data.length === 0) return [];

    return data
      .filter(item => Number(item.efficiencyScore) < 70)
      .sort((a, b) => Number(a.efficiencyScore) - Number(b.efficiencyScore))
      .slice(0, 5);
  };

  const getEfficiencyTrend = () => {
    if (!data || data.length < 2) return 0;

    const sortedData = [...data].sort((a, b) =>
      new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime()
    );

    const recent = sortedData.slice(-3);
    const older = sortedData.slice(-6, -3);

    if (recent.length === 0 || older.length === 0) return 0;

    const recentAvg = recent.reduce((sum, item) => sum + Number(item.efficiencyScore || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + Number(item.efficiencyScore || 0), 0) / older.length;

    return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  };

  const overallEfficiency = calculateOverallEfficiency();
  const topPerformers = getTopPerformers();
  const underPerformers = getUnderPerformers();
  const efficiencyTrend = getEfficiencyTrend();
  const efficiencyStatus = getEfficiencyStatus(overallEfficiency);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Efficiency Data</h3>
        <p className="text-muted-foreground">
          Energy efficiency metrics will appear here once data is available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Energy Efficiency Metrics</span>
          </h2>
          <p className="text-muted-foreground">
            Performance tracking and benchmarking across assets
          </p>
        </div>

        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="efficiency">Efficiency Score</SelectItem>
            <SelectItem value="carbon">Carbon Intensity</SelectItem>
            <SelectItem value="cost">Cost Efficiency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
            <efficiencyStatus.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all assets
            </p>
            <div className="mt-2">
              <Progress value={overallEfficiency} className="h-2" />
            </div>
            <Badge variant={efficiencyStatus.badge} className="mt-2">
              {efficiencyStatus.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Trend</CardTitle>
            {efficiencyTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(efficiencyTrend).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {efficiencyTrend >= 0 ? 'Improvement' : 'Decline'} vs previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers.length}</div>
            <p className="text-xs text-muted-foreground">
              Assets above 80% efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{underPerformers.length}</div>
            <p className="text-xs text-muted-foreground">
              Assets below 70% efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Top Performers</span>
              <Badge variant="outline">{topPerformers.length}</Badge>
            </CardTitle>
            <CardDescription>
              Assets with the highest energy efficiency scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformers.length > 0 ? (
              <div className="space-y-4">
                {topPerformers.map((item, index) => {
                  const status = getEfficiencyStatus(Number(item.efficiencyScore));

                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">
                            {item.asset?.name || 'Unknown Asset'}
                          </h4>
                          <Badge variant={status.badge}>
                            {item.efficiencyScore.toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.asset?.assetNumber || 'No asset number'}
                        </p>
                        <div className="mt-2">
                          <Progress value={Number(item.efficiencyScore)} className="h-2" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {item.benchmarkScore ? `${item.benchmarkScore}% benchmark` : 'No benchmark'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.periodStart).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No top performers yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assets Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Need Attention</span>
              <Badge variant="destructive">{underPerformers.length}</Badge>
            </CardTitle>
            <CardDescription>
              Assets with low energy efficiency requiring improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {underPerformers.length > 0 ? (
              <div className="space-y-4">
                {underPerformers.map((item, index) => {
                  const status = getEfficiencyStatus(Number(item.efficiencyScore));

                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-red-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">
                            {item.asset?.name || 'Unknown Asset'}
                          </h4>
                          <Badge variant={status.badge}>
                            {item.efficiencyScore.toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.asset?.assetNumber || 'No asset number'}
                        </p>
                        <div className="mt-2">
                          <Progress value={Number(item.efficiencyScore)} className="h-2" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          {item.benchmarkScore ?
                            `${(Number(item.benchmarkScore) - Number(item.efficiencyScore)).toFixed(1)}% below benchmark` :
                            'Below standard'
                          }
                        </div>
                        <Button size="sm" variant="outline" className="mt-1">
                          Optimize
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All assets performing well</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Efficiency Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>All Assets Efficiency</span>
          </CardTitle>
          <CardDescription>
            Complete efficiency metrics for all monitored assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Asset</th>
                  <th className="text-right p-2">Efficiency</th>
                  <th className="text-right p-2">Benchmark</th>
                  <th className="text-right p-2">Carbon Intensity</th>
                  <th className="text-right p-2">Cost/Unit</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Period</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const status = getEfficiencyStatus(Number(item.efficiencyScore));

                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">
                            {item.asset?.name || 'Unknown Asset'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.asset?.assetNumber || 'No asset number'}
                          </div>
                        </div>
                      </td>
                      <td className="text-right p-2">
                        <div className="font-medium">{item.efficiencyScore.toFixed(1)}%</div>
                      </td>
                      <td className="text-right p-2">
                        {item.benchmarkScore ? `${item.benchmarkScore.toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="text-right p-2">
                        {item.carbonIntensity.toFixed(3)} kg CO₂e/kWh
                      </td>
                      <td className="text-right p-2">
                        ${item.costPerUnit.toFixed(4)}/kWh
                      </td>
                      <td className="p-2">
                        <Badge variant={status.badge}>
                          {status.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">
                        {new Date(item.periodStart).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Benchmarking Data */}
      {analyticsData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Industry Benchmarking</span>
            </CardTitle>
            <CardDescription>
              Comparison against industry standards and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData.organisationAverage?.toFixed(1) || '0'}%
                </div>
                <p className="text-sm text-muted-foreground">Organisation Average</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.industryBenchmarks?.buildings || '75'}%
                </div>
                <p className="text-sm text-muted-foreground">Industry Standard</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analyticsData.industryBenchmarks?.buildings ?
                    (analyticsData.organisationAverage - analyticsData.industryBenchmarks.buildings).toFixed(1) : '0'
                  }%
                </div>
                <p className="text-sm text-muted-foreground">
                  {analyticsData.organisationAverage > (analyticsData.industryBenchmarks?.buildings || 0) ?
                    'Above' : 'Below'
                  } Industry Standard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
