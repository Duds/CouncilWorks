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
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Building2,
  Wrench,
  Loader2,
  RefreshCw,
  Filter,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface RiskMetric {
  id: string;
  category: string;
  currentScore: number;
  previousScore: number;
  trend: 'improving' | 'declining' | 'stable';
  status: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  recommendation: string;
}

interface ComplianceItem {
  id: string;
  regulation: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'overdue';
  dueDate: string;
  lastChecked: string;
  responsible: string;
  notes?: string;
}

interface RiskComplianceData {
  overallRiskScore: number;
  overallComplianceRate: number;
  riskMetrics: RiskMetric[];
  complianceItems: ComplianceItem[];
  criticalIssues: number;
  pendingActions: number;
  overdueItems: number;
  lastAssessment: string;
}

/**
 * Risk and Compliance Reporting Component
 * Comprehensive risk assessment and compliance tracking
 */
export function RiskComplianceReport() {
  const [reportData, setReportData] = useState<RiskComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    loadReportData();
  }, [timeRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockData: RiskComplianceData = {
        overallRiskScore: 7.2,
        overallComplianceRate: 94.5,
        riskMetrics: [
          {
            id: '1',
            category: 'Asset Condition',
            currentScore: 6.8,
            previousScore: 7.1,
            trend: 'improving',
            status: 'medium',
            description: 'Overall asset condition risk assessment',
            impact: 'Medium impact on operational efficiency',
            recommendation: 'Continue preventive maintenance program',
          },
          {
            id: '2',
            category: 'Safety Compliance',
            currentScore: 8.5,
            previousScore: 8.2,
            trend: 'declining',
            status: 'high',
            description: 'Safety regulation compliance risk',
            impact: 'High impact on safety and regulatory compliance',
            recommendation: 'Immediate safety audit required',
          },
          {
            id: '3',
            category: 'Environmental',
            currentScore: 5.2,
            previousScore: 5.3,
            trend: 'stable',
            status: 'low',
            description: 'Environmental compliance and sustainability',
            impact: 'Low impact on operations',
            recommendation: 'Maintain current environmental programs',
          },
          {
            id: '4',
            category: 'Financial',
            currentScore: 7.9,
            previousScore: 8.1,
            trend: 'improving',
            status: 'medium',
            description: 'Budget and cost management risk',
            impact: 'Medium impact on financial performance',
            recommendation: 'Monitor budget utilization closely',
          },
        ],
        complianceItems: [
          {
            id: '1',
            regulation: 'Work Health and Safety Act 2011',
            requirement: 'Annual safety equipment inspection',
            status: 'compliant',
            dueDate: '2025-12-31',
            lastChecked: '2025-01-10',
            responsible: 'Safety Manager',
            notes: 'All equipment inspected and certified',
          },
          {
            id: '2',
            regulation: 'Building Code of Australia',
            requirement: 'Fire safety system maintenance',
            status: 'overdue',
            dueDate: '2025-01-05',
            lastChecked: '2024-12-15',
            responsible: 'Building Manager',
            notes: 'Fire system maintenance overdue - urgent action required',
          },
          {
            id: '3',
            regulation: 'Environmental Protection Act',
            requirement: 'Waste management audit',
            status: 'pending',
            dueDate: '2025-03-15',
            lastChecked: '2024-12-20',
            responsible: 'Environmental Officer',
            notes: 'Audit scheduled for March 2025',
          },
          {
            id: '4',
            regulation: 'Privacy Act 1988',
            requirement: 'Data protection compliance review',
            status: 'non-compliant',
            dueDate: '2025-02-28',
            lastChecked: '2024-11-30',
            responsible: 'IT Manager',
            notes: 'Data protection policies need updating',
          },
        ],
        criticalIssues: 3,
        pendingActions: 8,
        overdueItems: 2,
        lastAssessment: '2025-01-13T10:00:00Z',
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockData);
    } catch (error) {
      console.error("Failed to load report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    setRefreshing(false);
    toast.success("Report refreshed");
  };

  const handleExport = () => {
    toast.info("Exporting risk and compliance report...");
    // In real implementation, this would generate and download a PDF/Excel report
  };

  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskStatusBadge = (status: string) => {
    switch (status) {
      case 'low': return <Badge variant="secondary">Low Risk</Badge>;
      case 'medium': return <Badge variant="outline">Medium Risk</Badge>;
      case 'high': return <Badge variant="destructive">High Risk</Badge>;
      case 'critical': return <Badge variant="destructive">Critical Risk</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return <Badge variant="default">Compliant</Badge>;
      case 'non-compliant': return <Badge variant="destructive">Non-Compliant</Badge>;
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-600 rounded-full" />;
      default: return null;
    }
  };

  const filteredComplianceItems = filter === "all" 
    ? reportData?.complianceItems || []
    : reportData?.complianceItems.filter(item => item.status === filter) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading risk and compliance report...</span>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
        <h3 className="text-lg font-medium mb-2">Failed to load report</h3>
        <p className="text-muted-foreground mb-4">Unable to retrieve risk and compliance data</p>
        <Button onClick={loadReportData}>
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
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.overallRiskScore.toFixed(1)}/10
            </div>
            <Progress value={reportData.overallRiskScore * 10} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {reportData.overallRiskScore > 8 ? 'High Risk' : 
               reportData.overallRiskScore > 6 ? 'Medium Risk' : 'Low Risk'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.overallComplianceRate}%
            </div>
            <Progress value={reportData.overallComplianceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Regulatory compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reportData.criticalIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reportData.overdueItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment Metrics
          </CardTitle>
          <CardDescription>
            Detailed risk analysis across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportData.riskMetrics.map((metric) => (
              <Card key={metric.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{metric.category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend)}
                    {getRiskStatusBadge(metric.status)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Score</span>
                    <span className={`font-semibold ${getRiskStatusColor(metric.status)}`}>
                      {metric.currentScore.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={metric.currentScore * 10} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Previous: {metric.previousScore.toFixed(1)}</span>
                    <span className="capitalize">{metric.trend}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">
                    <strong>Impact:</strong> {metric.impact}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Recommendation:</strong> {metric.recommendation}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Tracking */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Compliance Tracking
              </CardTitle>
              <CardDescription>
                Regulatory compliance status and requirements
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regulation</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplianceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.regulation}
                  </TableCell>
                  <TableCell>{item.requirement}</TableCell>
                  <TableCell>
                    {getComplianceStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(item.dueDate).toLocaleDateString("en-AU")}
                  </TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>
                    {new Date(item.lastChecked).toLocaleDateString("en-AU")}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Action Items Summary
          </CardTitle>
          <CardDescription>
            Pending actions and critical items requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {reportData.criticalIssues}
              </div>
              <div className="text-sm font-medium">Critical Issues</div>
              <div className="text-xs text-muted-foreground">
                Immediate action required
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {reportData.pendingActions}
              </div>
              <div className="text-sm font-medium">Pending Actions</div>
              <div className="text-xs text-muted-foreground">
                Scheduled for completion
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {reportData.overdueItems}
              </div>
              <div className="text-sm font-medium">Overdue Items</div>
              <div className="text-xs text-muted-foreground">
                Past due date
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Assessment */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Last Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(reportData.lastAssessment).toLocaleDateString("en-AU", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Next Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
