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
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  User,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  Eye,
  Edit,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { toast } from "sonner";

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  assetName: string;
  assetNumber: string;
  assetType: string;
  priority: string;
  status: string;
  assignedTo: string;
  assignedToName: string;
  scheduledDate: string;
  dueDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt?: string;
}

interface SupervisorDashboardData {
  workOrders: WorkOrder[];
  myWorkOrders: WorkOrder[];
  teamWorkOrders: WorkOrder[];
  totalWorkOrders: number;
  completedWorkOrders: number;
  inProgressWorkOrders: number;
  pendingWorkOrders: number;
  overdueWorkOrders: number;
  averageCompletionTime: number;
  teamUtilization: number;
}

/**
 * Supervisor Work Order Dashboard Component
 * Task management and work order tracking for supervisors
 */
export function SupervisorDashboard() {
  const [dashboardData, setDashboardData] = useState<SupervisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockData: SupervisorDashboardData = {
        workOrders: [
          {
            id: 'wo-001',
            workOrderNumber: 'WO-2025-001',
            title: 'HVAC Maintenance - Building A',
            description: 'Routine maintenance of HVAC system including filter replacement and system check',
            assetName: 'Building A HVAC System',
            assetNumber: 'HVAC-001',
            assetType: 'HVAC',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            assignedTo: 'user-1',
            assignedToName: 'Sarah Johnson',
            scheduledDate: '2025-01-15T09:00:00Z',
            dueDate: '2025-01-15T17:00:00Z',
            estimatedDuration: 240,
            actualDuration: 180,
            location: 'Building A, Level 2',
            latitude: -37.8136,
            longitude: 144.9631,
            notes: 'System running efficiently, minor adjustments made',
            photos: ['photo1.jpg', 'photo2.jpg'],
            createdAt: '2025-01-10T08:00:00Z',
            updatedAt: '2025-01-15T14:30:00Z',
          },
          {
            id: 'wo-002',
            workOrderNumber: 'WO-2025-002',
            title: 'Electrical Inspection',
            description: 'Annual electrical safety inspection of main distribution panel',
            assetName: 'Building B Electrical Panel',
            assetNumber: 'ELEC-002',
            assetType: 'ELECTRICAL',
            priority: 'MEDIUM',
            status: 'PENDING',
            assignedTo: 'user-2',
            assignedToName: 'Mike Chen',
            scheduledDate: '2025-01-18T10:00:00Z',
            dueDate: '2025-01-18T16:00:00Z',
            estimatedDuration: 120,
            location: 'Building B, Basement',
            latitude: -37.8136,
            longitude: 144.9631,
            createdAt: '2025-01-12T09:00:00Z',
          },
          {
            id: 'wo-003',
            workOrderNumber: 'WO-2025-003',
            title: 'Plumbing Repair',
            description: 'Fix leaking pipe in main water supply line',
            assetName: 'Building C Water System',
            assetNumber: 'PLUMB-003',
            assetType: 'PLUMBING',
            priority: 'HIGH',
            status: 'COMPLETED',
            assignedTo: 'user-3',
            assignedToName: 'Emma Wilson',
            scheduledDate: '2025-01-12T08:00:00Z',
            dueDate: '2025-01-12T12:00:00Z',
            estimatedDuration: 180,
            actualDuration: 165,
            location: 'Building C, Ground Floor',
            latitude: -37.8136,
            longitude: 144.9631,
            notes: 'Leak repaired successfully, system tested and operational',
            photos: ['photo3.jpg'],
            createdAt: '2025-01-11T14:00:00Z',
            updatedAt: '2025-01-12T11:45:00Z',
          },
          {
            id: 'wo-004',
            workOrderNumber: 'WO-2025-004',
            title: 'Fire Safety Check',
            description: 'Monthly fire safety equipment inspection',
            assetName: 'Building A Fire System',
            assetNumber: 'FIRE-001',
            assetType: 'FIRE_SAFETY',
            priority: 'HIGH',
            status: 'OVERDUE',
            assignedTo: 'user-4',
            assignedToName: 'David Brown',
            scheduledDate: '2025-01-10T09:00:00Z',
            dueDate: '2025-01-10T15:00:00Z',
            estimatedDuration: 90,
            location: 'Building A, All Levels',
            latitude: -37.8136,
            longitude: 144.9631,
            createdAt: '2025-01-08T10:00:00Z',
          },
        ],
        myWorkOrders: [],
        teamWorkOrders: [],
        totalWorkOrders: 4,
        completedWorkOrders: 1,
        inProgressWorkOrders: 1,
        pendingWorkOrders: 1,
        overdueWorkOrders: 1,
        averageCompletionTime: 2.1,
        teamUtilization: 78.5,
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

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'outline';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'IN_PROGRESS': return 'secondary';
      case 'PENDING': return 'outline';
      case 'OVERDUE': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS': return <Play className="h-4 w-4 text-blue-600" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'OVERDUE': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredWorkOrders = dashboardData?.workOrders.filter(wo => {
    const matchesFilter = filter === "all" || wo.status === filter;
    const matchesPriority = priorityFilter === "all" || wo.priority === priorityFilter;
    const matchesSearch = 
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesPriority && matchesSearch;
  }) || [];

  const handleStatusUpdate = async (workOrderId: string, newStatus: string) => {
    try {
      // This would update the work order status via API
      console.log(`Updating work order ${workOrderId} to ${newStatus}`);
      toast.success(`Work order status updated to ${newStatus}`);
      
      // Refresh data
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to update work order status:", error);
      toast.error("Failed to update work order status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading supervisor dashboard...</span>
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
          <h1 className="text-3xl font-bold text-foreground">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">
            Work order management and task tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
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
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              Active work orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData.completedWorkOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              {((dashboardData.completedWorkOrders / dashboardData.totalWorkOrders) * 100).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.inProgressWorkOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboardData.overdueWorkOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Work Orders
          </CardTitle>
          <CardDescription>
            Manage and track work order assignments
          </CardDescription>
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
                <TableHead>Scheduled</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((workOrder) => (
                <TableRow key={workOrder.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {workOrder.workOrderNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.assetName}</div>
                      <div className="text-sm text-muted-foreground">
                        {workOrder.assetNumber} • {workOrder.assetType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
                      {workOrder.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(workOrder.status)}
                      <Badge variant={getStatusBadgeVariant(workOrder.status)}>
                        {workOrder.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{workOrder.assignedToName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        {new Date(workOrder.scheduledDate).toLocaleDateString("en-AU")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(workOrder.scheduledDate).toLocaleTimeString("en-AU", { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        {workOrder.actualDuration ? 
                          `${workOrder.actualDuration} min` : 
                          `${workOrder.estimatedDuration} min`
                        }
                      </div>
                      {workOrder.actualDuration && (
                        <div className="text-xs text-muted-foreground">
                          Est: {workOrder.estimatedDuration} min
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{workOrder.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {workOrder.status === 'PENDING' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusUpdate(workOrder.id, 'IN_PROGRESS')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {workOrder.status === 'IN_PROGRESS' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusUpdate(workOrder.id, 'COMPLETED')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Average Completion Time</span>
                  <span className="text-sm text-muted-foreground">
                    {dashboardData.averageCompletionTime} days
                  </span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Team Utilization</span>
                  <span className="text-sm text-muted-foreground">
                    {dashboardData.teamUtilization}%
                  </span>
                </div>
                <Progress value={dashboardData.teamUtilization} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Wrench className="h-6 w-6" />
                <span className="text-sm">New Work Order</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <User className="h-6 w-6" />
                <span className="text-sm">Assign Tasks</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Urgent Tasks</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
