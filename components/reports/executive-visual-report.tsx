/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * Executive Visual Report Component
 *
 * Provides compelling visual reports with performance benchmarking charts,
 * cost-benefit analysis visualisations, and ROI metrics for executive presentations.
 *
 * @component ExecutiveVisualReport
 * @version 1.0.0
 * @author Aegrid Development Team
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle,
  DollarSign,
  Download,
  LineChart,
  Minus,
  Share,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PerformanceMetric {
  id: string;
  label: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
  category: string;
}

interface CostBenefitData {
  initiative: string;
  investment: number;
  savings: number;
  roi: number;
  paybackPeriod: number;
  category: string;
}

interface ComplianceData {
  standard: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAudit: string;
  nextAudit: string;
  issues: number;
}

interface RiskMetrics {
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  impact: string;
  mitigation: string;
}

/**
 * Executive Visual Report Component
 * Provides comprehensive visual reporting with interactive charts and metrics
 *
 * @example
 * ```tsx
 * <ExecutiveVisualReport />
 * ```
 * @accessibility
 * - ARIA roles: main, region, tablist, tabpanel, button
 * - Keyboard navigation: Tab through report sections and controls
 * - Screen reader: Announces metric changes and performance indicators
 */
export function ExecutiveVisualReport() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, _setSelectedPeriod] = useState('12m');
  const [isLoading, setIsLoading] = useState(true);

  // Transform terminology for display
  const executiveReportLabel = transformNavigationLabel(
    'Executive Dashboard',
    createTransformationContext('ExecutiveVisualReport', 'report', 'title')
  ).transformed;

  const assetPerformanceLabel = transformNavigationLabel(
    'Asset Performance',
    createTransformationContext('ExecutiveVisualReport', 'report', 'section')
  ).transformed;

  const complianceStatusLabel = transformNavigationLabel(
    'Compliance Status',
    createTransformationContext('ExecutiveVisualReport', 'report', 'section')
  ).transformed;

  const riskOverviewLabel = transformNavigationLabel(
    'Risk Overview',
    createTransformationContext('ExecutiveVisualReport', 'report', 'section')
  ).transformed;

  // Mock data - in production, this would come from APIs
  const [performanceMetrics, _setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([
    {
      id: 'asset-utilisation',
      label: 'Asset Utilisation Rate',
      current: 94.2,
      previous: 91.8,
      target: 95.0,
      unit: '%',
      trend: 'up',
      benchmark: 88.5,
      category: 'Operational',
    },
    {
      id: 'maintenance-efficiency',
      label: 'Maintenance Efficiency',
      current: 87.5,
      previous: 84.2,
      target: 90.0,
      unit: '%',
      trend: 'up',
      benchmark: 82.1,
      category: 'Operational',
    },
    {
      id: 'cost-reduction',
      label: 'Cost Reduction',
      current: 18.7,
      previous: 15.3,
      target: 20.0,
      unit: '%',
      trend: 'up',
      benchmark: 12.8,
      category: 'Financial',
    },
    {
      id: 'compliance-rate',
      label: 'Compliance Rate',
      current: 98.5,
      previous: 97.2,
      target: 99.0,
      unit: '%',
      trend: 'up',
      benchmark: 95.0,
      category: 'Compliance',
    },
    {
      id: 'risk-score',
      label: 'Risk Score',
      current: 52.0,
      previous: 58.3,
      target: 45.0,
      unit: '',
      trend: 'up',
      benchmark: 65.0,
      category: 'Risk',
    },
    {
      id: 'satisfaction-score',
      label: 'Stakeholder Satisfaction',
      current: 4.6,
      previous: 4.3,
      target: 4.8,
      unit: '/5',
      trend: 'up',
      benchmark: 4.1,
      category: 'Stakeholder',
    },
  ]);

  const [costBenefitData, _setCostBenefitData] = useState<CostBenefitData[]>([
    {
      initiative: 'Predictive Maintenance',
      investment: 500000,
      savings: 1800000,
      roi: 260,
      paybackPeriod: 4.2,
      category: 'Technology',
    },
    {
      initiative: 'Asset Intelligence Platform',
      investment: 300000,
      savings: 1200000,
      roi: 300,
      paybackPeriod: 3.0,
      category: 'Technology',
    },
    {
      initiative: 'Risk Management System',
      investment: 200000,
      savings: 800000,
      roi: 300,
      paybackPeriod: 3.0,
      category: 'Process',
    },
    {
      initiative: 'Staff Training Program',
      investment: 150000,
      savings: 450000,
      roi: 200,
      paybackPeriod: 4.0,
      category: 'Human Capital',
    },
  ]);

  const [complianceData, _setComplianceData] = useState<ComplianceData[]>([
    {
      standard: 'ISO 55000',
      status: 'compliant',
      score: 98,
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      issues: 2,
    },
    {
      standard: 'ISO 14224',
      status: 'compliant',
      score: 96,
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      issues: 4,
    },
    {
      standard: 'ISO 27001',
      status: 'partial',
      score: 89,
      lastAudit: '2024-01-20',
      nextAudit: '2024-04-20',
      issues: 8,
    },
    {
      standard: 'ISO 31000',
      status: 'compliant',
      score: 94,
      lastAudit: '2024-01-05',
      nextAudit: '2024-07-05',
      issues: 3,
    },
  ]);

  const [riskMetrics, _setRiskMetrics] = useState<RiskMetrics[]>([
    {
      category: 'Operational Risk',
      riskLevel: 'medium',
      score: 45,
      trend: 'improving',
      impact: 'Medium',
      mitigation: 'Enhanced monitoring and predictive maintenance',
    },
    {
      category: 'Financial Risk',
      riskLevel: 'low',
      score: 25,
      trend: 'stable',
      impact: 'Low',
      mitigation: 'Diversified funding and cost controls',
    },
    {
      category: 'Compliance Risk',
      riskLevel: 'low',
      score: 30,
      trend: 'improving',
      impact: 'Low',
      mitigation: 'Regular audits and training programs',
    },
    {
      category: 'Technology Risk',
      riskLevel: 'medium',
      score: 55,
      trend: 'stable',
      impact: 'Medium',
      mitigation: 'Cybersecurity measures and backup systems',
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            {executiveReportLabel}
          </h1>
          <p className="text-muted-foreground">
            Comprehensive performance analysis and strategic insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Badge variant="outline" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {selectedPeriod}
          </Badge>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Executive Summary
          </CardTitle>
          <CardDescription>
            Key performance indicators and strategic achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-3xl font-bold text-green-600">$2.4M</div>
              <div className="text-sm text-green-700">Annual Cost Savings</div>
              <div className="text-xs text-green-600 mt-1">
                ↑ 18% vs previous year
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-3xl font-bold text-blue-600">98.5%</div>
              <div className="text-sm text-blue-700">Compliance Rate</div>
              <div className="text-xs text-blue-600 mt-1">
                ↑ 2.3% vs previous year
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <div className="text-3xl font-bold text-purple-600">4.6/5</div>
              <div className="text-sm text-purple-700">
                Stakeholder Satisfaction
              </div>
              <div className="text-xs text-purple-600 mt-1">
                ↑ 0.3 vs previous year
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Report Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">{assetPerformanceLabel}</TabsTrigger>
          <TabsTrigger value="compliance">{complianceStatusLabel}</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Key metrics vs targets and benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.slice(0, 4).map(metric => (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{metric.label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold">
                          {metric.current}
                          {metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                        <span
                          className={`text-sm ${getTrendColor(metric.trend)}`}
                        >
                          {metric.current > metric.previous ? '+' : ''}
                          {(
                            ((metric.current - metric.previous) /
                              metric.previous) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Target: {metric.target}
                        {metric.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Benchmark: {metric.benchmark}
                        {metric.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {riskOverviewLabel}
                </CardTitle>
                <CardDescription>
                  Risk assessment across all categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskMetrics.map(risk => (
                  <div key={risk.category} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{risk.category}</span>
                      <div className="flex items-center gap-2">
                        {getRiskTrendIcon(risk.trend)}
                        <Badge className={getRiskLevelColor(risk.riskLevel)}>
                          {risk.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score: </span>
                        <span className="font-medium">{risk.score}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact: </span>
                        <span className="font-medium">{risk.impact}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {risk.mitigation}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                {assetPerformanceLabel} Metrics
              </CardTitle>
              <CardDescription>
                Detailed performance analysis with trends and benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics.map(metric => (
                  <div key={metric.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{metric.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {metric.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {metric.current}
                          {metric.unit}
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span
                            className={`text-sm ${getTrendColor(metric.trend)}`}
                          >
                            {metric.current > metric.previous ? '+' : ''}
                            {(
                              ((metric.current - metric.previous) /
                                metric.previous) *
                              100
                            ).toFixed(1)}
                            % vs previous
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Previous:{' '}
                        </span>
                        <span className="font-medium">
                          {metric.previous}
                          {metric.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target: </span>
                        <span className="font-medium">
                          {metric.target}
                          {metric.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Benchmark:{' '}
                        </span>
                        <span className="font-medium">
                          {metric.benchmark}
                          {metric.unit}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((metric.current / metric.target) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Progress to target</span>
                        <span>
                          {((metric.current / metric.target) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {complianceStatusLabel}
              </CardTitle>
              <CardDescription>
                Regulatory compliance across all standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.map(compliance => (
                  <div
                    key={compliance.standard}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{compliance.standard}</h3>
                        <p className="text-sm text-muted-foreground">
                          Compliance Standard
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getComplianceStatusColor(
                            compliance.status
                          )}
                        >
                          {compliance.status.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {compliance.score}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Score
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Last Audit:{' '}
                        </span>
                        <span className="font-medium">
                          {compliance.lastAudit}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Next Audit:{' '}
                        </span>
                        <span className="font-medium">
                          {compliance.nextAudit}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Open Issues:{' '}
                        </span>
                        <Badge
                          variant={
                            compliance.issues > 5
                              ? 'destructive'
                              : compliance.issues > 2
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {compliance.issues}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            compliance.score >= 95
                              ? 'bg-green-500'
                              : compliance.score >= 85
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${compliance.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
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
                Cost-benefit analysis of strategic initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBenefitData.map(initiative => (
                  <div
                    key={initiative.initiative}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{initiative.initiative}</h3>
                        <p className="text-sm text-muted-foreground">
                          {initiative.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {initiative.roi}%
                        </div>
                        <div className="text-sm text-muted-foreground">ROI</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Investment:{' '}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(initiative.investment)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Savings: </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(initiative.savings)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payback: </span>
                        <span className="font-medium">
                          {initiative.paybackPeriod} years
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Net Benefit:{' '}
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(
                            initiative.savings - initiative.investment
                          )}
                        </span>
                      </div>
                    </div>

                    {/* ROI Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((initiative.roi / 400) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>ROI Performance</span>
                        <span>{initiative.roi}%</span>
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
