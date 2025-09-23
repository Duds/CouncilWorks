"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Activity,
  Zap,
  Loader2,
  RefreshCw,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface ResilienceMetrics {
  overallScore: number;
  criticalControls: number;
  marginUtilization: number;
  riskTrend: 'up' | 'down' | 'stable';
  signalResponse: number;
  antifragileScore: number;
}

interface CriticalControl {
  id: string;
  name: string;
  assetType: string;
  status: 'healthy' | 'warning' | 'critical';
  lastInspection: string;
  nextInspection: string;
  riskScore: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface MarginStatus {
  timeMargin: number;
  capacityMargin: number;
  materialMargin: number;
  financialMargin: number;
  totalAvailable: number;
  utilizationRate: number;
}

interface RiskTrend {
  period: string;
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

/**
 * Manager Dashboard Component
 * Executive-level dashboard showcasing The Aegrid Rules in action
 */
export function ManagerDashboard() {
  const [metrics, setMetrics] = useState<ResilienceMetrics | null>(null);
  const [criticalControls, setCriticalControls] = useState<CriticalControl[]>([]);
  const [marginStatus, setMarginStatus] = useState<MarginStatus | null>(null);
  const [riskTrends, setRiskTrends] = useState<RiskTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("7d");

  useEffect(() => {
    loadManagerData();
  }, [timeRange]);

  const loadManagerData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load resilience metrics
      const metricsResponse = await fetch(`/api/manager/metrics?timeRange=${timeRange}`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.metrics);
      }

      // Load critical controls
      const controlsResponse = await fetch("/api/manager/critical-controls");
      if (controlsResponse.ok) {
        const controlsData = await controlsResponse.json();
        setCriticalControls(controlsData.controls);
      }

      // Load margin status
      const marginResponse = await fetch("/api/manager/margin-status");
      if (marginResponse.ok) {
        const marginData = await marginResponse.json();
        setMarginStatus(marginData.margin);
      }

      // Load risk trends
      const trendsResponse = await fetch(`/api/manager/risk-trends?timeRange=${timeRange}`);
      if (trendsResponse.ok) {
        const trendsData = await trendsResponse.json();
        setRiskTrends(trendsData.trends);
      }
    } catch (error) {
      setError("Failed to load manager dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "healthy": return "default";
      case "warning": return "outline";
      case "critical": return "destructive";
      default: return "default";
    }
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case "low": return "secondary";
      case "medium": return "outline";
      case "high": return "destructive";
      case "critical": return "destructive";
      default: return "default";
    }
  };

  const getRiskTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-green-600" />;
      case "stable": return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading manager dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadManagerData} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manager Dashboard</h2>
          
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadManagerData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Resilience Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Resilience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{metrics.overallScore}%</div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.riskTrend === 'up' ? 'Risk increasing' : 
                     metrics.riskTrend === 'down' ? 'Risk decreasing' : 'Risk stable'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">{metrics.criticalControls}</div>
                  <div className="text-xs text-muted-foreground">Active monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Margin Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{metrics.marginUtilization}%</div>
                  <div className="text-xs text-muted-foreground">Available capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Controls Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Controls Monitoring
          </CardTitle>
          <CardDescription>
            High-consequence assets requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalControls.map((control) => (
              <div key={control.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {control.status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {control.status === 'warning' && <Clock className="h-4 w-4 text-yellow-600" />}
                    {control.status === 'healthy' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    <div>
                      <h4 className="font-medium">{control.name}</h4>
                      
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Risk Score: {control.riskScore}</div>
                    <div className="text-xs text-muted-foreground">
                      Next: {new Date(control.nextInspection).toLocaleDateString("en-AU")}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(control.status)}>
                      {control.status.toUpperCase()}
                    </Badge>
                    <Badge variant={getImpactBadgeVariant(control.impactLevel)}>
                      {control.impactLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Margin Status */}
      {marginStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Margin Management Status
            </CardTitle>
            <CardDescription>
              Operational slack and antifragile system capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{marginStatus.timeMargin}%</div>
                
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{marginStatus.capacityMargin}%</div>
                
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{marginStatus.materialMargin}%</div>
                
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{marginStatus.financialMargin}%</div>
                
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Margin Utilization</span>
                <span className="text-sm font-medium">{marginStatus.utilizationRate}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="progress-bar bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ '--width': marginStatus.utilizationRate } as React.CSSProperties}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Risk Trend Analysis
          </CardTitle>
          <CardDescription>
            Risk patterns and trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getRiskTrendIcon(trend.trend)}
                  <div>
                    <div className="font-medium">{trend.period}</div>
                    <div className="text-sm text-muted-foreground">Risk Score: {trend.riskScore}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    trend.change > 0 ? 'text-red-600' : 
                    trend.change < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trend.trend === 'up' ? 'Increasing' : 
                     trend.trend === 'down' ? 'Decreasing' : 'Stable'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
