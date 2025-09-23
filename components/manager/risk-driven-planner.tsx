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
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  AlertCircle,
  MapPin,
  User,
  DollarSign,
  Wrench,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface RiskAssessment {
  assetId: string;
  assetName: string;
  assetType: string;
  riskScore: number;
  consequence: number;
  likelihood: number;
  lastAssessment: string;
  nextAssessment: string;
  riskTrend: 'up' | 'down' | 'stable';
  criticalControls: string[];
}

interface ScheduleItem {
  id: string;
  assetId: string;
  assetName: string;
  taskType: string;
  scheduledDate: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  estimatedDuration: number;
  estimatedCost: number;
  assignedTo?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  adaptationReason?: string;
}

interface SignalEvent {
  id: string;
  type: 'weather' | 'condition' | 'performance' | 'external';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  affectedAssets: string[];
  responseAction?: string;
}

/**
 * Risk-Driven Planner Component
 * Dynamic scheduling based on risk assessment showcasing Rule 2
 */
export function RiskDrivenPlanner() {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [signalEvents, setSignalEvents] = useState<SignalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("week");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  useEffect(() => {
    loadRiskPlanningData();
  }, [timeRange, filterPriority, selectedAsset]);

  const loadRiskPlanningData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        timeRange,
        priority: filterPriority,
        assetId: selectedAsset || ''
      });

      // Load risk assessments
      const riskResponse = await fetch(`/api/risk-planner/assessments?${params}`);
      if (riskResponse.ok) {
        const riskData = await riskResponse.json();
        setRiskAssessments(riskData.assessments || []);
      }

      // Load schedule items
      const scheduleResponse = await fetch(`/api/risk-planner/schedule?${params}`);
      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setScheduleItems(scheduleData.schedule || []);
      }

      // Load signal events
      const signalsResponse = await fetch(`/api/risk-planner/signals?${params}`);
      if (signalsResponse.ok) {
        const signalsData = await signalsResponse.json();
        setSignalEvents(signalsData.signals || []);
      }
    } catch (error) {
      setError("Failed to load risk planning data");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "outline";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "CRITICAL";
    if (score >= 60) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  const getRiskTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-green-600" />;
      case "stable": return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case "weather": return <Activity className="h-4 w-4 text-blue-600" />;
      case "condition": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "performance": return <BarChart3 className="h-4 w-4 text-purple-600" />;
      case "external": return <Zap className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading risk planning data...</span>
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
            <Button variant="outline" size="sm" onClick={loadRiskPlanningData} className="ml-auto">
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
          <h2 className="text-2xl font-bold text-foreground">Risk-Driven Maintenance Planner</h2>
          
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadRiskPlanningData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Risk Assessment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Risk Assessment Overview
          </CardTitle>
          <CardDescription>
            Current risk scores driving maintenance scheduling decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskAssessments.map((assessment) => (
              <Card key={assessment.assetId} className="cursor-pointer hover:shadow-md">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{assessment.assetName}</h4>
                      {getRiskTrendIcon(assessment.riskTrend)}
                    </div>
                    
                    <div>
                      
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        
                        <p className={`text-lg font-bold ${getRiskColor(assessment.riskScore)}`}>
                          {assessment.riskScore}
                        </p>
                      </div>
                      <Badge variant={getPriorityBadgeVariant(getRiskLevel(assessment.riskScore).toLowerCase())}>
                        {getRiskLevel(assessment.riskScore)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        
                        <p className="font-medium">{assessment.consequence}</p>
                      </div>
                      <div>
                        
                        <p className="font-medium">{assessment.likelihood}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Dynamic Maintenance Schedule
          </CardTitle>
          <CardDescription>
            Risk-driven schedule with real-time adaptations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {item.status === 'overdue' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {item.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-600" />}
                    {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {item.status === 'scheduled' && <Calendar className="h-4 w-4 text-gray-600" />}
                    <div>
                      <h4 className="font-medium">{item.taskType}</h4>
                      
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(item.scheduledDate).toLocaleDateString("en-AU")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(item.dueDate).toLocaleDateString("en-AU")}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityBadgeVariant(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                    <div className="text-sm">
                      <div className={`font-medium ${getRiskColor(item.riskScore)}`}>
                        Risk: {item.riskScore}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.estimatedDuration}min • ${item.estimatedCost}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Signal Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-Time Signal Events
          </CardTitle>
          <CardDescription>
            Signals driving schedule adaptations (Rule 3: Respond to the Real World)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {signalEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getSignalIcon(event.type)}
                  <div>
                    <div className="font-medium text-sm">{event.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString("en-AU")}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityBadgeVariant(event.severity)}>
                    {event.severity.toUpperCase()}
                  </Badge>
                  {event.responseAction && (
                    <div className="text-xs text-muted-foreground">
                      Action: {event.responseAction}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
