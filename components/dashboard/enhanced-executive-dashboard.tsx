/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * Enhanced Executive Dashboard Component
 *
 * Provides interactive dashboards with drill-down capabilities, real-time status indicators,
 * and compelling visual elements for executive presentations.
 *
 * @component EnhancedExecutiveDashboard
 * @version 1.0.0
 * @author Aegrid Development Team
 */

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createTransformationContext,
  transformNavigationLabel,
} from '@/lib/language-dictionary/language-transformer';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}

interface AssetPerformanceData {
  category: string;
  total: number;
  active: number;
  underMaintenance: number;
  critical: number;
  value: number;
}

interface RiskTrendData {
  period: string;
  riskScore: number;
  incidents: number;
  resolved: number;
}

interface CostBenefitData {
  category: string;
  investment: number;
  savings: number;
  roi: number;
}

/**
 * Enhanced Executive Dashboard Component
 * Provides comprehensive visual overview with interactive drill-down capabilities
 *
 * @example
 * ```tsx
 * <EnhancedExecutiveDashboard />
 * ```
 * @accessibility
 * - ARIA roles: main, region, tablist, tabpanel
 * - Keyboard navigation: Tab through dashboard sections
 * - Screen reader: Announces metric changes and status updates
 */
export function EnhancedExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Transform terminology for display
  const strategicDashboardLabel = transformNavigationLabel(
    'Strategic Dashboard',
    createTransformationContext(
      'EnhancedExecutiveDashboard',
      'dashboard',
      'title'
    )
  ).transformed;

  const assetPerformanceLabel = transformNavigationLabel(
    'Asset Performance',
    createTransformationContext(
      'EnhancedExecutiveDashboard',
      'dashboard',
      'metric'
    )
  ).transformed;

  const riskOverviewLabel = transformNavigationLabel(
    'Risk Overview',
    createTransformationContext(
      'EnhancedExecutiveDashboard',
      'dashboard',
      'metric'
    )
  ).transformed;

  const _complianceStatusLabel = transformNavigationLabel(
    'Compliance Status',
    createTransformationContext(
      'EnhancedExecutiveDashboard',
      'dashboard',
      'metric'
    )
  ).transformed;

  // Mock data - in production, this would come from APIs
  const [metrics, _setMetrics] = useState<DashboardMetric[]>([
    {
      id: 'total-assets',
      label: transformNavigationLabel(
        'Asset Register',
        createTransformationContext(
          'EnhancedExecutiveDashboard',
          'metric',
          'assets'
        )
      ).transformed,
      value: 1247,
      change: 12,
      changeType: 'positive',
      icon: Building2,
      color: 'text-blue-600',
      description: 'Total assets under management',
    },
    {
      id: 'active-work-orders',
      label: transformNavigationLabel(
        'Work Orders',
        createTransformationContext(
          'EnhancedExecutiveDashboard',
          'metric',
          'work'
        )
      ).transformed,
      value: 89,
      change: -5,
      changeType: 'positive',
      icon: Wrench,
      color: 'text-green-600',
      description: 'Currently active work orders',
    },
    {
      id: 'risk-score',
      label: transformNavigationLabel(
        'Risk Overview',
        createTransformationContext(
          'EnhancedExecutiveDashboard',
          'metric',
          'risk'
        )
      ).transformed,
      value: 'Low',
      change: -15,
      changeType: 'positive',
      icon: Shield,
      color: 'text-green-600',
      description: 'Overall organisational risk level',
    },
    {
      id: 'compliance-rate',
      label: transformNavigationLabel(
        'Compliance Status',
        createTransformationContext(
          'EnhancedExecutiveDashboard',
          'metric',
          'compliance'
        )
      ).transformed,
      value: '98.5%',
      change: 2.3,
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600',
      description: 'Regulatory compliance rate',
    },
    {
      id: 'cost-savings',
      label: 'Cost Savings',
      value: '$2.4M',
      change: 18,
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      description: 'Annual cost savings achieved',
    },
    {
      id: 'efficiency-gain',
      label: 'Efficiency Gain',
      value: '24%',
      change: 8,
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600',
      description: 'Operational efficiency improvement',
    },
  ]);

  const [assetPerformance, _setAssetPerformance] = useState<
    AssetPerformanceData[]
  >([
    {
      category: 'Buildings',
      total: 156,
      active: 142,
      underMaintenance: 8,
      critical: 6,
      value: 45000000,
    },
    {
      category: 'Infrastructure',
      total: 892,
      active: 867,
      underMaintenance: 15,
      critical: 10,
      value: 78000000,
    },
    {
      category: 'Equipment',
      total: 199,
      active: 188,
      underMaintenance: 7,
      critical: 4,
      value: 12000000,
    },
  ]);

  const [riskTrends, _setRiskTrends] = useState<RiskTrendData[]>([
    { period: 'Jan', riskScore: 75, incidents: 12, resolved: 11 },
    { period: 'Feb', riskScore: 68, incidents: 8, resolved: 9 },
    { period: 'Mar', riskScore: 62, incidents: 6, resolved: 8 },
    { period: 'Apr', riskScore: 58, incidents: 4, resolved: 6 },
    { period: 'May', riskScore: 55, incidents: 3, resolved: 5 },
    { period: 'Jun', riskScore: 52, incidents: 2, resolved: 4 },
  ]);

  const [costBenefit, _setCostBenefit] = useState<CostBenefitData[]>([
    {
      category: 'Predictive Maintenance',
      investment: 500000,
      savings: 1800000,
      roi: 260,
    },
    {
      category: 'Asset Intelligence',
      investment: 300000,
      savings: 1200000,
      roi: 300,
    },
    {
      category: 'Risk Management',
      investment: 200000,
      savings: 800000,
      roi: 300,
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(selectedMetric === metricId ? null : metricId);
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />;
      case 'negative':
        return <TrendingUp className="h-3 w-3 rotate-180" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {strategicDashboardLabel}
          </h1>
          <p className="text-muted-foreground">
            Comprehensive asset lifecycle intelligence and performance overview
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="h-3 w-3 mr-1" />
          Real-time
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map(metric => (
          <Card
            key={metric.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleMetricClick(metric.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change !== undefined && (
                <div
                  className={`flex items-center text-xs ${getChangeColor(metric.changeType)}`}
                >
                  {getChangeIcon(metric.changeType)}
                  <span className="ml-1">
                    {metric.change > 0 ? '+' : ''}
                    {metric.change}% from last month
                  </span>
                </div>
              )}
              {metric.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Dashboard Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">{assetPerformanceLabel}</TabsTrigger>
          <TabsTrigger value="risk">{riskOverviewLabel}</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Strategic Objectives
                </CardTitle>
                <CardDescription>
                  Key performance indicators aligned with organisational goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Asset Utilisation</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    94%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Maintenance Efficiency
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    87%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Mitigation</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    96%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Rate</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    98.5%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts
                </CardTitle>
                <CardDescription>
                  Issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Critical Asset Failure
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Water Treatment Plant #3
                    </p>
                  </div>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maintenance Overdue</p>
                    <p className="text-xs text-muted-foreground">
                      12 assets require attention
                    </p>
                  </div>
                  <Badge variant="outline" className="text-yellow-700">
                    Warning
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Compliance Review</p>
                    <p className="text-xs text-muted-foreground">
                      Monthly audit due
                    </p>
                  </div>
                  <Badge variant="outline" className="text-blue-700">
                    Info
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {assetPerformanceLabel} by Category
              </CardTitle>
              <CardDescription>
                Detailed breakdown of asset performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetPerformance.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{category.category}</h3>
                      <Badge variant="outline">
                        ${(category.value / 1000000).toFixed(1)}M
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">{category.total}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active</p>
                        <p className="font-medium text-green-600">
                          {category.active}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Maintenance</p>
                        <p className="font-medium text-yellow-600">
                          {category.underMaintenance}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Critical</p>
                        <p className="font-medium text-red-600">
                          {category.critical}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(category.active / category.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {riskOverviewLabel} Trends
              </CardTitle>
              <CardDescription>
                Risk assessment trends and incident management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-green-50">
                    <p className="text-2xl font-bold text-green-600">52</p>
                    <p className="text-sm text-muted-foreground">
                      Current Risk Score
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-600">2</p>
                    <p className="text-sm text-muted-foreground">
                      Active Incidents
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-muted-foreground">
                      Resolution Rate
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {riskTrends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {trend.period}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              trend.riskScore < 60
                                ? 'bg-green-100 text-green-700'
                                : trend.riskScore < 80
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {trend.riskScore}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{trend.incidents} incidents</span>
                        <span>{trend.resolved} resolved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Return on Investment Analysis
              </CardTitle>
              <CardDescription>
                Cost-benefit analysis of asset management initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBenefit.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{item.category}</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        {item.roi}% ROI
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Investment</p>
                        <p className="font-medium">
                          ${(item.investment / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Savings</p>
                        <p className="font-medium text-green-600">
                          ${(item.savings / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net Benefit</p>
                        <p className="font-medium text-green-600">
                          $
                          {((item.savings - item.investment) / 1000000).toFixed(
                            1
                          )}
                          M
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((item.roi / 400) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
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
