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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  MapPin,
  DollarSign,
  Loader2,
  RefreshCw,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface MaintenanceItem {
  id: string;
  type: "SCHEDULED_MAINTENANCE" | "WORK_ORDER";
  title: string;
  description: string;
  scheduledDate: string;
  dueDate: string;
  completedDate?: string;
  status: string;
  priority: string;
  assignedTo?: {
    id: string;
    name?: string;
    email?: string;
  };
  asset: {
    id: string;
    name: string;
    assetNumber: string;
    assetType: string;
    address?: string;
  };
  taskType?: string;
  frequency?: string;
  estimatedCost?: number;
  estimatedDuration?: number;
}

interface MaintenanceCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onItemSelect?: (item: MaintenanceItem) => void;
}

/**
 * Maintenance Calendar Component
 * Displays maintenance schedule in calendar format
 */
export function MaintenanceCalendar({ 
  selectedDate, 
  onDateSelect, 
  onItemSelect 
}: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [schedule, setSchedule] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");

  useEffect(() => {
    loadSchedule();
  }, [currentDate, view, filterStatus, filterPriority]);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const startDate = getViewStartDate();
      const endDate = getViewEndDate();
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
      
      if (filterStatus !== "ALL") params.append("status", filterStatus);
      if (filterPriority !== "ALL") params.append("priority", filterPriority);

      const response = await fetch(`/api/maintenance/schedule?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule || []);
      } else {
        setError("Failed to load maintenance schedule");
      }
    } catch (error) {
      setError("Failed to load maintenance schedule");
    } finally {
      setLoading(false);
    }
  };

  const getViewStartDate = (): Date => {
    const date = new Date(currentDate);
    switch (view) {
      case "week":
        date.setDate(date.getDate() - date.getDay());
        break;
      case "day":
        // No adjustment needed for day view
        break;
      case "month":
      default:
        date.setDate(1);
        break;
    }
    return date;
  };

  const getViewEndDate = (): Date => {
    const date = new Date(currentDate);
    switch (view) {
      case "week":
        date.setDate(date.getDate() - date.getDay() + 6);
        break;
      case "day":
        // No adjustment needed for day view
        break;
      case "month":
      default:
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        break;
    }
    return date;
  };

  const getDaysInMonth = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, i - startingDayOfWeek + 1));
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getItemsForDate = (date: Date): MaintenanceItem[] => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule.filter(item => {
      const scheduledDate = new Date(item.scheduledDate).toISOString().split('T')[0];
      return scheduledDate === dateStr;
    });
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      default: return "default";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED": return "default";
      case "IN_PROGRESS": return "secondary";
      case "PENDING":
      case "OPEN": return "outline";
      case "OVERDUE": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle className="h-3 w-3 text-green-600" />;
      case "IN_PROGRESS": return <Clock className="h-3 w-3 text-blue-600" />;
      case "PENDING":
      case "OPEN": return <Clock className="h-3 w-3 text-yellow-600" />;
      case "OVERDUE": return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default: return <Clock className="h-3 w-3 text-gray-600" />;
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading maintenance schedule...</span>
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
            <Button variant="outline" size="sm" onClick={loadSchedule} className="ml-auto">
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
          <h2 className="text-2xl font-bold text-foreground">Maintenance Schedule</h2>
          <p className="text-muted-foreground">
            View and manage scheduled maintenance activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSchedule}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Select value={view} onValueChange={(value: any) => setView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  if (view === "month") navigateMonth("prev");
                  else if (view === "week") navigateWeek("prev");
                  else navigateDay("prev");
                }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => {
                  if (view === "month") navigateMonth("next");
                  else if (view === "week") navigateWeek("next");
                  else navigateDay("next");
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-AU", { 
                  month: "long", 
                  year: "numeric" 
                })}
              </h3>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priority</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      {view === "month" && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getDaysInMonth().map((date, index) => {
                const items = getItemsForDate(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border rounded-lg ${
                      isCurrentMonth ? "bg-background" : "bg-muted/50"
                    } ${isToday ? "ring-2 ring-primary" : ""}`}
                    onClick={() => onDateSelect?.(date)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemSelect?.(item);
                          }}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            <span className="truncate">{item.title}</span>
                          </div>
                        </div>
                      ))}
                      
                      {items.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week View */}
      {view === "week" && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentDate);
                date.setDate(date.getDate() - date.getDay() + i);
                const items = getItemsForDate(date);
                
                return (
                  <div key={i} className="min-h-[400px]">
                    <div className="text-center font-medium mb-4">
                      <div className="text-sm text-muted-foreground">
                        {date.toLocaleDateString("en-AU", { weekday: "short" })}
                      </div>
                      <div className="text-lg">
                        {date.getDate()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {items.map((item) => (
                        <Card key={item.id} className="p-2 cursor-pointer hover:shadow-md">
                          <div className="text-xs font-medium truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.asset.name}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {getStatusIcon(item.status)}
                            <Badge variant={getPriorityBadgeVariant(item.priority)} size="sm">
                              {item.priority}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day View */}
      {view === "day" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString("en-AU", { 
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </h3>
              </div>
              
              <div className="space-y-3">
                {getItemsForDate(currentDate).map((item) => (
                  <Card key={item.id} className="p-4 cursor-pointer hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.asset.name}</span>
                          </div>
                          
                          {item.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{item.assignedTo.name || item.assignedTo.email}</span>
                            </div>
                          )}
                          
                          {item.estimatedCost && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${item.estimatedCost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <Badge variant={getPriorityBadgeVariant(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {getItemsForDate(currentDate).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No maintenance scheduled for this day
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
