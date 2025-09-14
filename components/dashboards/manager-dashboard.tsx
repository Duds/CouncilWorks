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
  Users,
  Calendar,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  RefreshCw,
  Filter,
  Eye,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  workOrdersAssigned: number;
  workOrdersCompleted: number;
  completionRate: number;
  utilizationRate: number;
  status: 'active' | 'busy' | 'available';
}

interface WorkOrderSummary {
  id: string;
  title: string;
  assetName: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueDate: string;
  estimatedDuration: number;
}

interface ManagerDashboardData {
  teamMembers: TeamMember[];
  workOrders: WorkOrderSummary[];
  totalWorkOrders: number;
  completedWorkOrders: number;
  pendingWorkOrders: number;
  overdueWorkOrders: number;
  teamUtilization: number;
  averageCompletionTime: number;
  budgetUtilization: number;
  maintenanceCost: number;
  inspectionsCompleted: number;
  inspectionsPending: number;
}

/**
 * Manager Operational Dashboard Component
 * Operational metrics and team performance for managers
 */
export function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState<ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("all");

  useEffect(() => {
    loadDashboardData();
  }, [timeRange, selectedTeamMember]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockData: ManagerDashboardData = {
        teamMembers: [
          {
            id: '1',
            name: 'Sarah Johnson',
            role: 'Supervisor',
            workOrdersAssigned: 12,
            workOrdersCompleted: 10,
            completionRate: 83.3,
            utilizationRate: 92.5,
            status: 'active',
          },
          {
            id: '2',
            name: 'Mike Chen',
            role: 'Technician',
            workOrdersAssigned: 8,
            workOrdersCompleted: 7,
            completionRate: 87.5,
            utilizationRate: 78.3,
            status: 'busy',
          },
          {
            id: '3',
            name: 'Emma Wilson',
            role: 'Technician',
            workOrdersAssigned: 6,
            workOrdersCompleted: 6,
            completionRate: 100,
            utilizationRate: 85.7,
            status: 'available',
          },
          {
            id: '4',
            name: 'David Brown',
            role: 'Inspector',
            workOrdersAssigned: 15,
            workOrdersCompleted: 12,
            completionRate: 80,
            utilizationRate: 88.2,
            status: 'active',
          },
        ],
        workOrders: [
          {
            id: 'wo-001',
            title: 'HVAC Maintenance - Building A',
            assetName: 'Building A HVAC System',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            assignedTo: 'Sarah Johnson',
            dueDate: '2025-01-15',
            estimatedDuration: 240,
          },
          {
            id: 'wo-002',
            title: 'Electrical Inspection',
            assetName: 'Building B Electrical Panel',
            priority: 'MEDIUM',
            status: 'PENDING',
            assignedTo: 'Mike Chen',
            dueDate: '2025-01-18',
            estimatedDuration: 120,
          },
          {
            id: 'wo-003',
            title: 'Plumbing Repair',
            assetName: 'Building C Water System',
            priority: 'HIGH',
            status: 'COMPLETED',
            assignedTo: 'Emma Wilson',
            dueDate: '2025-01-12',
            estimatedDuration: 180,
          },
        ],
        totalWorkOrders: 41,
        completedWorkOrders: 35,
        pendingWorkOrders: 4,
        overdueWorkOrders: 2,
        teamUtilization: 86.2,
        averageCompletionTime: 2.3,
        budgetUtilization: 78.5,
        maintenanceCost: 125000,
        inspectionsCompleted: 28,
        inspectionsPending: 5,
      };

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'busy': return 'secondary';
      case 'available': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'outline';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getWorkOrderStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'PENDING': return 'outline';
      case 'OVERDUE': return 'destructive';
      default: return 'default';
    }
  };

  const filteredWorkOrders = selectedTeamMember === "all" 
    ? dashboardData?.workOrders || []
    : dashboardData?.workOrders.filter(wo => wo.assignedTo === selectedTeamMember) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading manager dashboard...</span>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Team performance and operational metrics
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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.teamUtilization}%</div>
            <Progress value={dashboardData.teamUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.completedWorkOrders}/{dashboardData.totalWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              {((dashboardData.completedWorkOrders / dashboardData.totalWorkOrders) * 100).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.averageCompletionTime}d</div>
            <p className="text-xs text-muted-foreground">
              -0.3d from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.budgetUtilization}%</div>
            <Progress value={dashboardData.budgetUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              ${dashboardData.maintenanceCost.toLocaleString()} spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance
          </CardTitle>
          <CardDescription>
            Individual team member performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Work Orders</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {member.workOrdersCompleted}/{member.workOrdersAssigned}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.completionRate} className="w-16" />
                      <span className="text-sm">{member.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={member.utilizationRate} className="w-16" />
                      <span className="text-sm">{member.utilizationRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Work Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Orders
              </CardTitle>
              <CardDescription>
                Current work order assignments and status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  {dashboardData.teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((workOrder) => (
                <TableRow key={workOrder.id}>
                  <TableCell className="font-medium">{workOrder.title}</TableCell>
                  <TableCell>{workOrder.assetName}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
                      {workOrder.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getWorkOrderStatusBadgeVariant(workOrder.status)}>
                      {workOrder.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{workOrder.assignedTo}</TableCell>
                  <TableCell>{new Date(workOrder.dueDate).toLocaleDateString("en-AU")}</TableCell>
                  <TableCell>{workOrder.estimatedDuration} min</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {dashboardData.completedWorkOrders}
            </div>
            <p className="text-sm text-muted-foreground">
              Work orders completed this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {dashboardData.pendingWorkOrders}
            </div>
            <p className="text-sm text-muted-foreground">
              Work orders pending assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {dashboardData.overdueWorkOrders}
            </div>
            <p className="text-sm text-muted-foreground">
              Work orders past due date
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
