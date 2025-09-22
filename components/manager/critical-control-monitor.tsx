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
  Eye,
  Shield,
  Target,
  Activity,
  Zap,
  Loader2,
  RefreshCw,
  AlertCircle,
  MapPin,
  Calendar,
  TrendingUp,
  AlertOctagon,
} from "lucide-react";
import { toast } from "sonner";

interface CriticalControl {
  id: string;
  name: string;
  assetType: string;
  status: 'healthy' | 'warning' | 'critical';
  lastInspection: string;
  nextInspection: string;
  riskScore: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  purpose: string;
  consequence: string;
  location?: string;
  responsibleTeam?: string;
  maintenanceHistory?: Array<{
    date: string;
    type: string;
    status: string;
    notes?: string;
  }>;
}

interface ControlMetrics {
  totalControls: number;
  criticalAlerts: number;
  warningStatus: number;
  healthyStatus: number;
  averageRiskScore: number;
  nextInspectionDue: number;
}

/**
 * Critical Control Monitor Component
 * Comprehensive monitoring of high-consequence assets showcasing Rule 1
 */
export function CriticalControlMonitor() {
  const [controls, setControls] = useState<CriticalControl[]>([]);
  const [metrics, setMetrics] = useState<ControlMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterImpact, setFilterImpact] = useState<string>("ALL");
  const [selectedControl, setSelectedControl] = useState<CriticalControl | null>(null);

  useEffect(() => {
    loadCriticalControls();
  }, [filterStatus, filterImpact]);

  const loadCriticalControls = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "ALL") params.append("status", filterStatus);
      if (filterImpact !== "ALL") params.append("impact", filterImpact);

      const response = await fetch(`/api/manager/critical-controls?${params}`);
      if (response.ok) {
        const data = await response.json();
        setControls(data.controls || []);
        setMetrics(data.metrics || null);
      } else {
        setError("Failed to load critical controls");
      }
    } catch (error) {
      setError("Failed to load critical controls");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "healthy": return "default";
      case "warning": return "outline";
      case "critical": return "destructive";
      default: return "default";
    }
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case "low": return "secondary";
      case "medium": return "outline";
      case "high": return "destructive";
      case "critical": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading critical controls...</span>
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
            <Button variant="outline" size="sm" onClick={loadCriticalControls} className="ml-auto">
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
          <h2 className="text-2xl font-bold text-foreground">Critical Control Monitor</h2>
          <p className="text-muted-foreground">
            High-consequence asset monitoring and management
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterImpact} onValueChange={setFilterImpact}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Impact</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadCriticalControls}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {controls.map((control) => (
          <Card 
            key={control.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              control.status === 'critical' ? 'border-red-200 bg-red-50' :
              control.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}
            onClick={() => setSelectedControl(control)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(control.status)}
                  <CardTitle className="text-sm font-medium">{control.name}</CardTitle>
                </div>
                <Badge variant={getStatusBadgeVariant(control.status)} size="sm">
                  {control.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Asset Type</p>
                  <p className="text-sm font-medium">{control.assetType}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                  <p className="text-sm">{control.purpose}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className={`text-lg font-bold ${getRiskColor(control.riskScore)}`}>
                      {control.riskScore}
                    </p>
                  </div>
                  <Badge variant={getImpactBadgeVariant(control.impactLevel)} size="sm">
                    {control.impactLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Next: {new Date(control.nextInspection).toLocaleDateString("en-AU")}</span>
                    </div>
                    {control.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{control.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Detail Modal */}
      {selectedControl && (
        <Card className="fixed inset-4 z-50 bg-background border shadow-lg overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedControl.status)}
                <div>
                  <CardTitle>{selectedControl.name}</CardTitle>
                  <CardDescription>{selectedControl.assetType}</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedControl(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Asset Purpose</h4>
                  <p className="text-sm text-muted-foreground">{selectedControl.purpose}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Failure Consequence</h4>
                  <p className="text-sm text-muted-foreground">{selectedControl.consequence}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedControl.status)}
                    <Badge variant={getStatusBadgeVariant(selectedControl.status)}>
                      {selectedControl.status.toUpperCase()}
                    </Badge>
                    <Badge variant={getImpactBadgeVariant(selectedControl.impactLevel)}>
                      {selectedControl.impactLevel.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Risk Assessment</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getRiskColor(selectedControl.riskScore)}`}>
                      {selectedControl.riskScore}
                    </span>
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Inspection Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last Inspection:</span>
                      <span>{new Date(selectedControl.lastInspection).toLocaleDateString("en-AU")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Inspection:</span>
                      <span>{new Date(selectedControl.nextInspection).toLocaleDateString("en-AU")}</span>
                    </div>
                  </div>
                </div>
                
                {selectedControl.location && (
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedControl.location}</span>
                    </div>
                  </div>
                )}
                
                {selectedControl.responsibleTeam && (
                  <div>
                    <h4 className="font-medium mb-2">Responsible Team</h4>
                    <p className="text-sm text-muted-foreground">{selectedControl.responsibleTeam}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Inspection
                    </Button>
                    <Button size="sm" variant="outline">
                      <AlertOctagon className="h-4 w-4 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
