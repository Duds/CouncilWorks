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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Wrench,
  Camera,
  FileText,
  Loader2,
  RefreshCw,
  Send,
  Save,
  ArrowLeft,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  assetNumber: string;
  assetType: string;
  priority: string;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  scheduledDate: string;
  dueDate: string;
  estimatedCost?: number;
  estimatedDuration?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

interface WorkOrderUpdate {
  id: string;
  workOrderId: string;
  status: string;
  notes: string;
  photos: string[];
  completedDate?: string;
  actualDuration?: number;
  actualCost?: number;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: string;
}

interface MobileWorkOrdersProps {
  assignedTo?: string;
  onWorkOrderSelect?: (workOrder: WorkOrder) => void;
}

/**
 * Mobile Work Orders Component
 * View and manage work orders on mobile devices
 */
export function MobileWorkOrders({ assignedTo, onWorkOrderSelect }: MobileWorkOrdersProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [workOrderUpdates, setWorkOrderUpdates] = useState<WorkOrderUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    loadWorkOrders();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [assignedTo]);

  const loadWorkOrders = async () => {
    setLoading(true);
    try {
      // Try to load from API first
      const params = new URLSearchParams();
      if (assignedTo) params.append('assignedTo', assignedTo);
      
      const response = await fetch(`/api/maintenance/schedule?${params}`);
      if (response.ok) {
        const data = await response.json();
        const formattedWorkOrders = data.schedule
          .filter((item: any) => item.type === 'WORK_ORDER')
          .map((item: any) => ({
            id: item.id,
            workOrderNumber: `WO-${item.id}`,
            title: item.title,
            description: item.description,
            assetId: item.asset.id,
            assetName: item.asset.name,
            assetNumber: item.asset.assetNumber,
            assetType: item.asset.assetType,
            priority: item.priority,
            status: item.status,
            assignedTo: item.assignedTo?.id,
            assignedToName: item.assignedTo?.name,
            scheduledDate: item.scheduledDate,
            dueDate: item.dueDate,
            estimatedCost: item.estimatedCost,
            estimatedDuration: item.estimatedDuration,
            location: item.asset.address,
            syncStatus: 'synced' as const,
            createdAt: new Date().toISOString(),
          }));
        
        setWorkOrders(formattedWorkOrders);
      } else {
        // Fallback to offline storage
        await loadOfflineWorkOrders();
      }
    } catch (error) {
      console.error("Failed to load work orders:", error);
      await loadOfflineWorkOrders();
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineWorkOrders = async () => {
    try {
      // This would load from IndexedDB
      // For now, simulate some offline data
      const offlineWorkOrders: WorkOrder[] = [
        {
          id: 'offline-wo-1',
          workOrderNumber: 'WO-OFFLINE-001',
          title: 'Routine Maintenance - Building A',
          description: 'Monthly routine maintenance check',
          assetId: 'asset-1',
          assetName: 'Building A',
          assetNumber: 'BLD-001',
          assetType: 'BUILDING',
          priority: 'MEDIUM',
          status: 'PENDING',
          scheduledDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedCost: 500,
          estimatedDuration: 120,
          location: '123 Main Street',
          syncStatus: 'pending',
          createdAt: new Date().toISOString(),
        },
      ];
      
      setWorkOrders(offlineWorkOrders);
    } catch (error) {
      console.error("Failed to load offline work orders:", error);
      toast.error("Failed to load work orders");
    }
  };

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesFilter = filter === "ALL" || wo.status === filter;
    const matchesSearch = 
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED": return "default";
      case "IN_PROGRESS": return "secondary";
      case "PENDING": return "outline";
      case "OVERDUE": return "destructive";
      default: return "default";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      default: return "default";
    }
  };

  const getSyncStatusIcon = (syncStatus: string) => {
    switch (syncStatus) {
      case "synced": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-orange-600" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleWorkOrderSelect = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    onWorkOrderSelect?.(workOrder);
  };

  const handleStatusUpdate = async (workOrderId: string, newStatus: string, notes: string) => {
    try {
      const update: WorkOrderUpdate = {
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workOrderId,
        status: newStatus,
        notes,
        photos: [],
        completedDate: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
        syncStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save update locally
      setWorkOrderUpdates(prev => [...prev, update]);
      
      // Update work order status
      setWorkOrders(prev => prev.map(wo => 
        wo.id === workOrderId 
          ? { ...wo, status: newStatus, syncStatus: 'pending' as const }
          : wo
      ));

      // Try to sync if online
      if (isOnline) {
        await syncWorkOrderUpdate(update);
      }

      toast.success(`Work order ${newStatus.toLowerCase()}`);
      setSelectedWorkOrder(null);
    } catch (error) {
      console.error("Failed to update work order:", error);
      toast.error("Failed to update work order");
    }
  };

  const syncWorkOrderUpdate = async (update: WorkOrderUpdate) => {
    try {
      // This would sync with the API
      console.log("Syncing work order update:", update);
      
      // Simulate successful sync
      setTimeout(() => {
        setWorkOrderUpdates(prev => prev.map(u => 
          u.id === update.id 
            ? { ...u, syncStatus: 'synced' as const }
            : u
        ));
        
        setWorkOrders(prev => prev.map(wo => 
          wo.id === update.workOrderId 
            ? { ...wo, syncStatus: 'synced' as const }
            : wo
        ));
      }, 1000);
    } catch (error) {
      console.error("Failed to sync work order update:", error);
      setWorkOrderUpdates(prev => prev.map(u => 
        u.id === update.id 
          ? { ...u, syncStatus: 'failed' as const }
          : u
      ));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading work orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!selectedWorkOrder ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Work Orders</h2>
              <p className="text-muted-foreground">
                Manage assigned maintenance tasks
              </p>
            </div>
            <Button variant="outline" onClick={loadWorkOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search work orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filter === "ALL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("ALL")}
                  >
                    All ({workOrders.length})
                  </Button>
                  <Button
                    variant={filter === "PENDING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("PENDING")}
                  >
                    Pending ({workOrders.filter(wo => wo.status === "PENDING").length})
                  </Button>
                  <Button
                    variant={filter === "IN_PROGRESS" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("IN_PROGRESS")}
                  >
                    In Progress ({workOrders.filter(wo => wo.status === "IN_PROGRESS").length})
                  </Button>
                  <Button
                    variant={filter === "COMPLETED" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("COMPLETED")}
                  >
                    Completed ({workOrders.filter(wo => wo.status === "COMPLETED").length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Orders List */}
          <div className="space-y-3">
            {filteredWorkOrders.length > 0 ? (
              filteredWorkOrders.map((workOrder) => (
                <Card 
                  key={workOrder.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleWorkOrderSelect(workOrder)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{workOrder.title}</h4>
                          <Badge variant="outline" size="sm">{workOrder.workOrderNumber}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{workOrder.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {workOrder.assetName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(workOrder.dueDate).toLocaleDateString("en-AU")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {getSyncStatusIcon(workOrder.syncStatus)}
                          <Badge variant={getStatusBadgeVariant(workOrder.status)}>
                            {workOrder.status}
                          </Badge>
                        </div>
                        
                        <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
                          {workOrder.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Asset:</strong> {workOrder.assetName} ({workOrder.assetNumber})
                      </div>
                      <div>
                        <strong>Type:</strong> {workOrder.assetType}
                      </div>
                      {workOrder.estimatedCost && (
                        <div>
                          <strong>Est. Cost:</strong> ${workOrder.estimatedCost}
                        </div>
                      )}
                      {workOrder.estimatedDuration && (
                        <div>
                          <strong>Duration:</strong> {workOrder.estimatedDuration} min
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No work orders found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || filter !== "ALL" 
                        ? "Try adjusting your search or filter criteria"
                        : "No work orders assigned to you yet"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <WorkOrderDetail
          workOrder={selectedWorkOrder}
          onBack={() => setSelectedWorkOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          isOnline={isOnline}
        />
      )}
    </div>
  );
}

/**
 * Work Order Detail Component
 * Detailed view and status update for a work order
 */
interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onBack: () => void;
  onStatusUpdate: (workOrderId: string, status: string, notes: string) => void;
  isOnline: boolean;
}

function WorkOrderDetail({ workOrder, onBack, onStatusUpdate, isOnline }: WorkOrderDetailProps) {
  const [status, setStatus] = useState(workOrder.status);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === workOrder.status && !notes.trim()) {
      toast.warning("No changes to save");
      return;
    }

    setUpdating(true);
    try {
      await onStatusUpdate(workOrder.id, status, notes);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Work Order Details</h2>
          <p className="text-sm text-muted-foreground">{workOrder.workOrderNumber}</p>
        </div>
      </div>

      {/* Work Order Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{workOrder.title}</CardTitle>
          <CardDescription>{workOrder.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Asset:</strong> {workOrder.assetName}
            </div>
            <div>
              <strong>Asset Number:</strong> {workOrder.assetNumber}
            </div>
            <div>
              <strong>Type:</strong> {workOrder.assetType}
            </div>
            <div>
              <strong>Priority:</strong> {workOrder.priority}
            </div>
            <div>
              <strong>Scheduled:</strong> {new Date(workOrder.scheduledDate).toLocaleDateString("en-AU")}
            </div>
            <div>
              <strong>Due:</strong> {new Date(workOrder.dueDate).toLocaleDateString("en-AU")}
            </div>
            {workOrder.estimatedCost && (
              <div>
                <strong>Est. Cost:</strong> ${workOrder.estimatedCost}
              </div>
            )}
            {workOrder.estimatedDuration && (
              <div>
                <strong>Duration:</strong> {workOrder.estimatedDuration} min
              </div>
            )}
          </div>
          
          {workOrder.location && (
            <div>
              <strong>Location:</strong> {workOrder.location}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the work performed..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate} 
              disabled={updating}
              className="flex-1"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Notice */}
      {!isOnline && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                You're offline. Status updates will sync when you're back online.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
