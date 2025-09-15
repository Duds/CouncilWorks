"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Settings,
  Star,
  Zap,
  Lock,
  Unlock,
  AlertCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";

/**
 * Critical Controls Interface implementing The Aegrid Rules
 * Rule 3: Protect the Critical Few - Visibility of crown jewels
 * Manages critical controls for assets whose failure would cause greatest harm
 * @component CriticalControls
 * @example
 * ```tsx
 * <CriticalControls />
 * ```
 * @accessibility
 * - ARIA roles: main, table, dialog
 * - Keyboard navigation: Tab through critical controls interface
 * - Screen reader: Announces critical asset status and control measures
 */
export default function CriticalControls() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false);

  // Mock critical controls data - in real implementation, this would come from API
  const criticalAssets = [
    {
      id: 1,
      name: "Main Water Treatment Plant",
      category: "Infrastructure",
      criticality: "Critical",
      controls: [
        { name: "Backup Power System", status: "Active", lastCheck: "2024-01-10" },
        { name: "Emergency Shutdown", status: "Active", lastCheck: "2024-01-09" },
        { name: "Water Quality Monitoring", status: "Active", lastCheck: "2024-01-11" }
      ],
      riskLevel: "High",
      compliance: 98.5,
      lastInspection: "2024-01-11",
      nextInspection: "2024-01-18",
      responsible: "Sarah Johnson"
    },
    {
      id: 2,
      name: "Emergency Generator System",
      category: "Safety",
      criticality: "Critical",
      controls: [
        { name: "Fuel Level Monitoring", status: "Active", lastCheck: "2024-01-11" },
        { name: "Automatic Transfer Switch", status: "Active", lastCheck: "2024-01-10" },
        { name: "Load Testing", status: "Scheduled", lastCheck: "2024-01-05" }
      ],
      riskLevel: "High",
      compliance: 95.2,
      lastInspection: "2024-01-10",
      nextInspection: "2024-01-17",
      responsible: "Emma Rodriguez"
    },
    {
      id: 3,
      name: "Fire Suppression System",
      category: "Safety",
      criticality: "Critical",
      controls: [
        { name: "Sprinkler System", status: "Active", lastCheck: "2024-01-12" },
        { name: "Fire Detection", status: "Active", lastCheck: "2024-01-11" },
        { name: "Emergency Lighting", status: "Active", lastCheck: "2024-01-10" }
      ],
      riskLevel: "Critical",
      compliance: 99.1,
      lastInspection: "2024-01-12",
      nextInspection: "2024-01-19",
      responsible: "David Thompson"
    },
    {
      id: 4,
      name: "Data Centre UPS",
      category: "IT Infrastructure",
      criticality: "Critical",
      controls: [
        { name: "Battery Monitoring", status: "Active", lastCheck: "2024-01-11" },
        { name: "Temperature Control", status: "Active", lastCheck: "2024-01-10" },
        { name: "Load Balancing", status: "Active", lastCheck: "2024-01-09" }
      ],
      riskLevel: "High",
      compliance: 97.8,
      lastInspection: "2024-01-11",
      nextInspection: "2024-01-18",
      responsible: "Michael Chen"
    }
  ];

  const controlCategories = [
    { name: "Infrastructure", count: 1, color: "bg-blue-100 text-blue-800" },
    { name: "Safety", count: 2, color: "bg-red-100 text-red-800" },
    { name: "IT Infrastructure", count: 1, color: "bg-purple-100 text-purple-800" },
    { name: "Environmental", count: 0, color: "bg-green-100 text-green-800" }
  ];

  const filteredAssets = selectedCategory === "all" 
    ? criticalAssets 
    : criticalAssets.filter(asset => asset.category === selectedCategory);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getControlStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      case "Maintenance": return "bg-blue-100 text-blue-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 98) return "text-green-600";
    if (compliance >= 95) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Critical Controls</h1>
          <p className="text-muted-foreground">
            Monitor and manage critical controls for crown jewel assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {controlCategories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Manage Controls
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Manage Critical Controls</DialogTitle>
                <DialogDescription>
                  Configure and monitor critical control measures for asset protection.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Control management interface would be implemented here with:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Control definition and configuration</li>
                    <li>Automated monitoring setup</li>
                    <li>Alert threshold management</li>
                    <li>Escalation procedures</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAssets.length}</div>
            <p className="text-xs text-muted-foreground">
              Requiring protection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {criticalAssets.reduce((sum, asset) => 
                sum + asset.controls.filter(c => c.status === "Active").length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Compliance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(
              criticalAssets.reduce((sum, asset) => sum + asset.compliance, 0) / criticalAssets.length
            )}`}>
              {(criticalAssets.reduce((sum, asset) => sum + asset.compliance, 0) / criticalAssets.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Control effectiveness
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due for Inspection</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {criticalAssets.filter(asset => 
                new Date(asset.nextInspection) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Control Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {controlCategories.map((category) => (
          <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{category.count}</div>
                <Badge className={category.color}>
                  {category.count > 0 ? "Active" : "None"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Asset Overview</TabsTrigger>
          <TabsTrigger value="controls">Control Details</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
        </TabsList>

        {/* Asset Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Assets Overview</CardTitle>
              <CardDescription>
                Crown jewel assets requiring highest level of protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Controls</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Responsible</TableHead>
                    <TableHead>Next Inspection</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>
                        <Badge className={getCriticalityColor(asset.criticality)}>
                          {asset.criticality}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskLevelColor(asset.riskLevel)}>
                          {asset.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">
                            {asset.controls.filter(c => c.status === "Active").length}
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-sm">{asset.controls.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-bold ${getComplianceColor(asset.compliance)}`}>
                          {asset.compliance}%
                        </div>
                      </TableCell>
                      <TableCell>{asset.responsible}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {asset.nextInspection}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Control Details Tab */}
        <TabsContent value="controls" className="space-y-4">
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <CardDescription>{asset.category} • {asset.criticality}</CardDescription>
                    </div>
                    <Badge className={getRiskLevelColor(asset.riskLevel)}>
                      {asset.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {asset.controls.map((control, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {control.status === "Active" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : control.status === "Scheduled" ? (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{control.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getControlStatusColor(control.status)}>
                            {control.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Last check: {control.lastCheck}
                          </span>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Status Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>
                  Critical control compliance by asset
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{asset.name}</span>
                      <span className={`font-bold ${getComplianceColor(asset.compliance)}`}>
                        {asset.compliance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          asset.compliance >= 98 ? 'bg-green-600' : 
                          asset.compliance >= 95 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control Status Summary</CardTitle>
                <CardDescription>
                  Overall control system health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Controls</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">
                      {criticalAssets.reduce((sum, asset) => 
                        sum + asset.controls.filter(c => c.status === "Active").length, 0
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Scheduled Controls</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-bold text-yellow-600">
                      {criticalAssets.reduce((sum, asset) => 
                        sum + asset.controls.filter(c => c.status === "Scheduled").length, 0
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Failed Controls</span>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-bold text-red-600">
                      {criticalAssets.reduce((sum, asset) => 
                        sum + asset.controls.filter(c => c.status === "Failed").length, 0
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts & Issues Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Control Alerts</CardTitle>
              <CardDescription>
                Issues requiring immediate attention for critical asset protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="font-medium">Emergency Generator Load Test Due</div>
                    <div className="text-sm text-muted-foreground">
                      Emergency Generator System • Load testing overdue by 2 days
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">High Priority</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <div className="font-medium">Water Quality Sensor Calibration Failed</div>
                    <div className="text-sm text-muted-foreground">
                      Main Water Treatment Plant • Sensor reading outside acceptable range
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Critical</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">UPS Battery Replacement Scheduled</div>
                    <div className="text-sm text-muted-foreground">
                      Data Centre UPS • Battery replacement due in 3 days
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
