"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Loader2,
  RefreshCw,
  Download,
  Calendar,
  MapPin,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

interface AssetTrendData {
  assetId: string;
  assetName: string;
  assetType: string;
  currentCondition: number;
  previousCondition: number;
  trend: 'improving' | 'declining' | 'stable';
  conditionHistory: Array<{
    date: string;
    condition: number;
    notes?: string;
  }>;
  predictedCondition: number;
  maintenanceHistory: Array<{
    date: string;
    type: string;
    cost: number;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  nextMaintenance: string;
  estimatedLifespan: number;
  replacementCost: number;
}

interface TrendingSummary {
  totalAssets: number;
  assetsImproving: number;
  assetsDeclining: number;
  assetsStable: number;
  averageCondition: number;
  criticalAssets: number;
  highRiskAssets: number;
  totalReplacementValue: number;
  maintenanceCostTrend: number;
  predictedFailures: number;
}

/**
 * Asset Condition Trending Component
 * Predictive analytics and condition monitoring for assets
 */
export function AssetConditionTrending() {
  const [trendData, setTrendData] = useState<AssetTrendData[]>([]);
  const [summary, setSummary] = useState<TrendingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("12m");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [trendFilter, setTrendFilter] = useState("all");

  useEffect(() => {
    loadTrendingData();
  }, [timeRange]);

  const loadTrendingData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockTrendData: AssetTrendData[] = [
        {
          assetId: '1',
          assetName: 'Building A HVAC System',
          assetType: 'HVAC',
          currentCondition: 7.2,
          previousCondition: 6.8,
          trend: 'improving',
          conditionHistory: [
            { date: '2024-01-01', condition: 6.5, notes: 'Annual inspection' },
            { date: '2024-04-01', condition: 6.3, notes: 'Minor maintenance' },
            { date: '2024-07-01', condition: 6.8, notes: 'Major overhaul' },
            { date: '2024-10-01', condition: 7.0, notes: 'Preventive maintenance' },
            { date: '2025-01-01', condition: 7.2, notes: 'Current assessment' },
          ],
          predictedCondition: 7.5,
          maintenanceHistory: [
            { date: '2024-07-01', type: 'Major Overhaul', cost: 15000, impact: 'positive' },
            { date: '2024-10-01', type: 'Preventive Maintenance', cost: 3000, impact: 'positive' },
          ],
          riskLevel: 'medium',
          nextMaintenance: '2025-04-01',
          estimatedLifespan: 15,
          replacementCost: 45000,
        },
        {
          assetId: '2',
          assetName: 'Building B Electrical Panel',
          assetType: 'ELECTRICAL',
          currentCondition: 4.1,
          previousCondition: 4.5,
          trend: 'declining',
          conditionHistory: [
            { date: '2024-01-01', condition: 5.2, notes: 'Annual inspection' },
            { date: '2024-04-01', condition: 4.8, notes: 'Minor repairs' },
            { date: '2024-07-01', condition: 4.5, notes: 'Component replacement' },
            { date: '2024-10-01', condition: 4.3, notes: 'Safety check' },
            { date: '2025-01-01', condition: 4.1, notes: 'Current assessment' },
          ],
          predictedCondition: 3.5,
          maintenanceHistory: [
            { date: '2024-07-01', type: 'Component Replacement', cost: 8000, impact: 'neutral' },
          ],
          riskLevel: 'high',
          nextMaintenance: '2025-02-15',
          estimatedLifespan: 20,
          replacementCost: 25000,
        },
        {
          assetId: '3',
          assetName: 'Building C Water System',
          assetType: 'PLUMBING',
          currentCondition: 8.1,
          previousCondition: 8.0,
          trend: 'stable',
          conditionHistory: [
            { date: '2024-01-01', condition: 8.0, notes: 'Annual inspection' },
            { date: '2024-04-01', condition: 7.9, notes: 'Routine maintenance' },
            { date: '2024-07-01', condition: 8.0, notes: 'Pipe replacement' },
            { date: '2024-10-01', condition: 8.1, notes: 'System upgrade' },
            { date: '2025-01-01', condition: 8.1, notes: 'Current assessment' },
          ],
          predictedCondition: 7.8,
          maintenanceHistory: [
            { date: '2024-07-01', type: 'Pipe Replacement', cost: 12000, impact: 'positive' },
            { date: '2024-10-01', type: 'System Upgrade', cost: 20000, impact: 'positive' },
          ],
          riskLevel: 'low',
          nextMaintenance: '2025-06-01',
          estimatedLifespan: 25,
          replacementCost: 35000,
        },
      ];

      const mockSummary: TrendingSummary = {
        totalAssets: 1247,
        assetsImproving: 342,
        assetsDeclining: 156,
        assetsStable: 749,
        averageCondition: 6.8,
        criticalAssets: 23,
        highRiskAssets: 89,
        totalReplacementValue: 12500000,
        maintenanceCostTrend: 8.5,
        predictedFailures: 12,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTrendData(mockTrendData);
      setSummary(mockSummary);
    } catch (error) {
      console.error("Failed to load trending data:", error);
      toast.error("Failed to load trending data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrendingData();
    setRefreshing(false);
    toast.success("Trending data refreshed");
  };

  const handleExport = () => {
    toast.info("Exporting asset condition trending report...");
    // In real implementation, this would generate and download a PDF/Excel report
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'improving': return <Badge variant="secondary">Improving</Badge>;
      case 'declining': return <Badge variant="destructive">Declining</Badge>;
      case 'stable': return <Badge variant="outline">Stable</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <Badge variant="secondary">Low Risk</Badge>;
      case 'medium': return <Badge variant="outline">Medium Risk</Badge>;
      case 'high': return <Badge variant="destructive">High Risk</Badge>;
      case 'critical': return <Badge variant="destructive">Critical Risk</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 8) return 'text-green-600';
    if (condition >= 6) return 'text-yellow-600';
    if (condition >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredTrendData = trendData.filter(asset => {
    const matchesAssetType = assetTypeFilter === "all" || asset.assetType === assetTypeFilter;
    const matchesTrend = trendFilter === "all" || asset.trend === trendFilter;
    return matchesAssetType && matchesTrend;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading asset condition trending...</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
        <h3 className="text-lg font-medium mb-2">Failed to load trending data</h3>
        <p className="text-muted-foreground mb-4">Unable to retrieve asset condition data</p>
        <Button onClick={loadTrendingData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Condition Trending</h1>
          <p className="text-muted-foreground">
            Predictive analytics and condition monitoring for asset lifecycle management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="2y">Last 2 years</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Condition</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.averageCondition.toFixed(1)}/10
            </div>
            <Progress value={summary.averageCondition * 10} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Portfolio condition score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Improving</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.assetsImproving}
            </div>
            <p className="text-xs text-muted-foreground">
              {((summary.assetsImproving / summary.totalAssets) * 100).toFixed(1)}% of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Declining</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary.assetsDeclining}
            </div>
            <p className="text-xs text-muted-foreground">
              {((summary.assetsDeclining / summary.totalAssets) * 100).toFixed(1)}% of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Assets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary.highRiskAssets}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Asset Types</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                  <SelectItem value="PLUMBING">Plumbing</SelectItem>
                  <SelectItem value="STRUCTURAL">Structural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Select value={trendFilter} onValueChange={setTrendFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trends</SelectItem>
                  <SelectItem value="improving">Improving</SelectItem>
                  <SelectItem value="declining">Declining</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Asset Condition Trends
          </CardTitle>
          <CardDescription>
            Detailed condition analysis with predictive insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredTrendData.map((asset) => (
              <Card key={asset.assetId} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{asset.assetName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {asset.assetType} • Asset ID: {asset.assetId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(asset.trend)}
                    {getTrendBadge(asset.trend)}
                    {getRiskBadge(asset.riskLevel)}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Condition</span>
                      <span className={`font-semibold ${getConditionColor(asset.currentCondition)}`}>
                        {asset.currentCondition.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={asset.currentCondition * 10} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Predicted Condition</span>
                      <span className={`font-semibold ${getConditionColor(asset.predictedCondition)}`}>
                        {asset.predictedCondition.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={asset.predictedCondition * 10} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Replacement Cost</span>
                      <span className="font-semibold">
                        ${asset.replacementCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Est. Lifespan: {asset.estimatedLifespan} years
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Recent Maintenance</h4>
                    <div className="space-y-2">
                      {asset.maintenanceHistory.slice(-3).map((maintenance, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <div className="font-medium">{maintenance.type}</div>
                            <div className="text-muted-foreground">
                              {new Date(maintenance.date).toLocaleDateString("en-AU")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${maintenance.cost.toLocaleString()}</div>
                            <Badge variant={maintenance.impact === 'positive' ? 'default' : 'secondary'}>
                              {maintenance.impact}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Condition History</h4>
                    <div className="space-y-2">
                      {asset.conditionHistory.slice(-4).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <div className="font-medium">{entry.condition.toFixed(1)}/10</div>
                            <div className="text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString("en-AU")}
                            </div>
                          </div>
                          <div className="text-right">
                            <Progress value={entry.condition * 10} className="w-16 h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Next Maintenance: {new Date(asset.nextMaintenance).toLocaleDateString("en-AU")}
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical Risk</span>
                <div className="flex items-center gap-2">
                  <Progress value={10} className="w-20" />
                  <span className="text-sm font-medium">{summary.criticalAssets}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High Risk</span>
                <div className="flex items-center gap-2">
                  <Progress value={25} className="w-20" />
                  <span className="text-sm font-medium">{summary.highRiskAssets}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Risk</span>
                <div className="flex items-center gap-2">
                  <Progress value={35} className="w-20" />
                  <span className="text-sm font-medium">{summary.assetsDeclining}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Risk</span>
                <div className="flex items-center gap-2">
                  <Progress value={60} className="w-20" />
                  <span className="text-sm font-medium">{summary.assetsStable}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {summary.predictedFailures}
                </div>
                <div className="text-sm font-medium">Predicted Failures</div>
                <div className="text-xs text-muted-foreground">
                  Next 6 months
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {summary.maintenanceCostTrend}%
                </div>
                <div className="text-sm font-medium">Cost Trend</div>
                <div className="text-xs text-muted-foreground">
                  Maintenance spending
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ${(summary.totalReplacementValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm font-medium">Replacement Value</div>
                <div className="text-xs text-muted-foreground">
                  Total portfolio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
