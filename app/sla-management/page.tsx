"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Calendar,
  BarChart3,
  AlertCircle,
  Star,
  Zap
} from "lucide-react";

/**
 * SLA Management Dashboard implementing The Aegrid Rules
 * Rule 2: Risk-based SLA compliance for critical assets
 * Rule 3: Critical asset SLA protection for service delivery and reputation
 * @component SLAManagement
 * @example
 * ```tsx
 * <SLAManagement />
 * ```
 * @accessibility
 * - ARIA roles: main, table, progressbar
 * - Keyboard navigation: Tab through SLA management interface
 * - Screen reader: Announces SLA compliance status and criticality levels
 */
export default function SLAManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock SLA data - in real implementation, this would come from API
  const slaMetrics = {
    overall: 94.2,
    critical: 98.5,
    high: 92.1,
    medium: 89.3,
    low: 87.8
  };

  const slaDefinitions = [
    {
      id: 1,
      name: "Critical Asset Response",
      description: "Response time for critical asset failures",
      target: "2 hours",
      current: "1.8 hours",
      compliance: 98.5,
      criticality: "Critical",
      category: "Response Time"
    },
    {
      id: 2,
      name: "Preventive Maintenance",
      description: "Scheduled maintenance completion",
      target: "95%",
      current: "94.2%",
      compliance: 94.2,
      criticality: "High",
      category: "Completion Rate"
    },
    {
      id: 3,
      name: "Work Order Resolution",
      description: "Time to resolve work orders",
      target: "24 hours",
      current: "22.5 hours",
      compliance: 93.8,
      criticality: "Medium",
      category: "Resolution Time"
    },
    {
      id: 4,
      name: "Safety Inspection",
      description: "Safety inspection completion",
      target: "100%",
      current: "98.7%",
      compliance: 98.7,
      criticality: "Critical",
      category: "Compliance"
    },
    {
      id: 5,
      name: "Asset Availability",
      description: "Asset uptime and availability",
      target: "99.5%",
      current: "99.2%",
      compliance: 99.2,
      criticality: "High",
      category: "Availability"
    }
  ];

  const slaViolations = [
    {
      id: 1,
      assetName: "Main Water Treatment Plant",
      slaType: "Critical Asset Response",
      violationType: "Response Time Exceeded",
      targetTime: "2 hours",
      actualTime: "2.5 hours",
      impact: "Service Disruption",
      date: "2024-01-10",
      status: "Resolved",
      criticality: "Critical"
    },
    {
      id: 2,
      assetName: "Emergency Generator System",
      slaType: "Preventive Maintenance",
      violationType: "Completion Delay",
      targetTime: "Scheduled Date",
      actualTime: "+2 days",
      impact: "Risk Increase",
      date: "2024-01-08",
      status: "In Progress",
      criticality: "Critical"
    },
    {
      id: 3,
      assetName: "Office HVAC System",
      slaType: "Work Order Resolution",
      violationType: "Resolution Delay",
      targetTime: "24 hours",
      actualTime: "28 hours",
      impact: "Comfort Impact",
      date: "2024-01-05",
      status: "Resolved",
      criticality: "Medium"
    }
  ];

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return "text-green-600";
    if (compliance >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getComplianceBadgeColor = (compliance: number) => {
    if (compliance >= 95) return "bg-green-100 text-green-800";
    if (compliance >= 90) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getViolationStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Escalated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SLA Management</h1>
          <p className="text-muted-foreground">
            Monitor service level agreements for critical asset protection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall SLA Compliance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(slaMetrics.overall)}`}>
              {slaMetrics.overall}%
            </div>
            <Progress value={slaMetrics.overall} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Target: 95%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(slaMetrics.critical)}`}>
              {slaMetrics.critical}%
            </div>
            <Progress value={slaMetrics.critical} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Highest priority
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {slaViolations.filter(v => v.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {slaViolations.filter(v => v.status === "Resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">SLA Overview</TabsTrigger>
          <TabsTrigger value="definitions">SLA Definitions</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* SLA Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Criticality</CardTitle>
                <CardDescription>
                  SLA compliance levels by asset criticality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(slaMetrics).map(([level, compliance]) => (
                  <div key={level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{level}</span>
                      <span className={`font-bold ${getComplianceColor(compliance)}`}>
                        {compliance}%
                      </span>
                    </div>
                    <Progress value={compliance} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>
                  SLA performance trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <Badge className={getComplianceBadgeColor(94.2)}>94.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Month</span>
                    <Badge className={getComplianceBadgeColor(92.8)}>92.8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">3 Months Ago</span>
                    <Badge className={getComplianceBadgeColor(91.5)}>91.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">6 Months Ago</span>
                    <Badge className={getComplianceBadgeColor(89.2)}>89.2%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SLA Definitions Tab */}
        <TabsContent value="definitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SLA Definitions</CardTitle>
              <CardDescription>
                Service level agreements aligned with asset criticality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SLA Name</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Compliance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slaDefinitions.map((sla) => (
                    <TableRow key={sla.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sla.name}</div>
                          <div className="text-sm text-muted-foreground">{sla.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCriticalityColor(sla.criticality)}>
                          {sla.criticality}
                        </Badge>
                      </TableCell>
                      <TableCell>{sla.category}</TableCell>
                      <TableCell>{sla.target}</TableCell>
                      <TableCell>{sla.current}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getComplianceBadgeColor(sla.compliance)}>
                            {sla.compliance}%
                          </Badge>
                          <Progress value={sla.compliance} className="w-16 h-2" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SLA Violations</CardTitle>
              <CardDescription>
                Track and manage SLA violations for continuous improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>SLA Type</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slaViolations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="font-medium">{violation.assetName}</TableCell>
                      <TableCell>{violation.slaType}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{violation.violationType}</div>
                          <div className="text-xs text-muted-foreground">
                            Target: {violation.targetTime} | Actual: {violation.actualTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCriticalityColor(violation.criticality)}>
                          {violation.criticality}
                        </Badge>
                      </TableCell>
                      <TableCell>{violation.impact}</TableCell>
                      <TableCell>{violation.date}</TableCell>
                      <TableCell>
                        <Badge className={getViolationStatusColor(violation.status)}>
                          {violation.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
                <CardDescription>
                  SLA compliance trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Trend</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+2.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Assets</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+1.8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Violation Rate</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      <span className="text-sm text-red-600">-15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Key insights for SLA improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Critical assets performing well</div>
                      <div className="text-muted-foreground">98.5% compliance rate</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Medium priority assets need attention</div>
                      <div className="text-muted-foreground">89.3% compliance rate</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Response times improving</div>
                      <div className="text-muted-foreground">Average 1.8 hours</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
