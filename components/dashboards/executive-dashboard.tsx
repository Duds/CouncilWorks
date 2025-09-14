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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Wrench,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface KPIMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'currency' | 'percentage';
  icon: React.ReactNode;
  description: string;
}

interface DashboardData {
  totalAssets: number;
  totalValue: number;
  maintenanceCost: number;
  complianceRate: number;
  riskScore: number;
  workOrdersCompleted: number;
  workOrdersPending: number;
  workOrdersOverdue: number;
  inspectionsCompleted: number;
  inspectionsPending: number;
  teamUtilization: number;
  budgetUtilization: number;
}

/**
 * Executive KPI Dashboard Component
 * High-level metrics and KPIs for executive leadership
 */
export function ExecutiveDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real implementation, this would fetch from multiple endpoints
      const mockData: DashboardData = {
        totalAssets: 1247,
        totalValue: 12500000,
        maintenanceCost: 450000,
        complianceRate: 94.2,
        riskScore: 7.8,
        workOrdersCompleted: 156,
        workOrdersPending: 23,
        workOrdersOverdue: 8,
        inspectionsCompleted: 89,
        inspectionsPending: 12,
        teamUtilization: 87.5,
        budgetUtilization: 78.3,
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-AU', {
          style: 'currency',
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-AU').format(value);
      default:
        return value.toString();
    }
  };

  const getKPIMetrics = (): KPIMetric[] => {
    if (!dashboardData) return [];

    return [
      {
        id: 'total-assets',
        title: 'Total Assets',
        value: dashboardData.totalAssets,
        change: 5.2,
        changeType: 'increase',
        format: 'number',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Assets under management',
      },
      {
        id: 'total-value',
        title: 'Asset Value',
        value: dashboardData.totalValue,
        change: 2.8,
        changeType: 'increase',
        format: 'currency',
        icon: <DollarSign className="h-5 w-5" />,
        description: 'Total asset portfolio value',
      },
      {
        id: 'maintenance-cost',
        title: 'Maintenance Cost',
        value: dashboardData.maintenanceCost,
        change: -3.1,
        changeType: 'decrease',
        format: 'currency',
        icon: <Wrench className="h-5 w-5" />,
        description: 'Monthly maintenance expenditure',
      },
      {
        id: 'compliance-rate',
        title: 'Compliance Rate',
        value: dashboardData.complianceRate,
        change: 1.2,
        changeType: 'increase',
        format: 'percentage',
        icon: <CheckCircle className="h-5 w-5" />,
        description: 'Regulatory compliance percentage',
      },
      {
        id: 'risk-score',
        title: 'Risk Score',
        value: dashboardData.riskScore,
        change: -0.5,
        changeType: 'decrease',
        format: 'number',
        icon: <AlertTriangle className="h-5 w-5" />,
        description: 'Overall portfolio risk (1-10 scale)',
      },
      {
        id: 'work-orders-completed',
        title: 'Work Orders Completed',
        value: dashboardData.workOrdersCompleted,
        change: 12.5,
        changeType: 'increase',
        format: 'number',
        icon: <CheckCircle className="h-5 w-5" />,
        description: 'Completed this month',
      },
      {
        id: 'team-utilization',
        title: 'Team Utilization',
        value: dashboardData.teamUtilization,
        change: 2.3,
        changeType: 'increase',
        format: 'percentage',
        icon: <Users className="h-5 w-5" />,
        description: 'Staff productivity rate',
      },
      {
        id: 'budget-utilization',
        title: 'Budget Utilization',
        value: dashboardData.budgetUtilization,
        change: -1.8,
        changeType: 'decrease',
        format: 'percentage',
        icon: <BarChart3 className="h-5 w-5" />,
        description: 'Annual budget usage',
      },
    ];
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading executive dashboard...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
        <h3 className="text-lg font-medium mb-2">Failed to load dashboard</h3>
        <p className="text-muted-foreground mb-4">Unable to retrieve dashboard data</p>
        <Button onClick={loadDashboardData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const kpiMetrics = getKPIMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            High-level KPIs and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
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
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="text-muted-foreground">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(metric.value, metric.format)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {getChangeIcon(metric.changeType)}
                <span className={getChangeColor(metric.changeType)}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Work Orders Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{dashboardData.workOrdersCompleted}</Badge>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dashboardData.workOrdersPending}</Badge>
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{dashboardData.workOrdersOverdue}</Badge>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspections Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{dashboardData.inspectionsCompleted}</Badge>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dashboardData.inspectionsPending}</Badge>
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <Badge variant="secondary">
                  {((dashboardData.inspectionsCompleted / (dashboardData.inspectionsCompleted + dashboardData.inspectionsPending)) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance Rate</span>
                <Badge variant={dashboardData.complianceRate >= 95 ? "default" : "secondary"}>
                  {dashboardData.complianceRate}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Score</span>
                <Badge variant={dashboardData.riskScore <= 5 ? "default" : dashboardData.riskScore <= 7 ? "secondary" : "destructive"}>
                  {dashboardData.riskScore}/10
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Utilization</span>
                <Badge variant={dashboardData.teamUtilization >= 85 ? "default" : "secondary"}>
                  {dashboardData.teamUtilization}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common executive tasks and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Financial Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Risk Analysis</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Team Performance</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="h-6 w-6" />
              <span className="text-sm">Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
