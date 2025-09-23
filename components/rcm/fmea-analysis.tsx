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
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  Wrench,
  Calendar,
  Target,
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface FMEAAnalysisProps {
  assetId: string;
  assetName: string;
}

interface RiskFactors {
  condition: number;
  age: number;
  maintenanceHistory: number;
  inspectionHistory: number;
}

interface FailureMode {
  id: string;
  name: string;
  type: string;
  severity: string;
  probability?: number;
  impact?: number;
  riskScore?: number;
  adjustedRiskScore?: number;
  riskLevel: string;
  cause?: string;
  effect: string;
  consequences?: string;
  detectionMethod?: string;
  preventionMethod?: string;
}

interface MaintenanceRecommendation {
  type: string;
  title: string;
  description: string;
  priority: string;
  estimatedCost: number;
  timeline: string;
}

interface FMEAData {
  asset: {
    id: string;
    name: string;
    assetNumber: string;
    assetType: string;
    condition: string;
    installationDate?: string;
    expectedLifespan?: number;
  };
  riskFactors: RiskFactors;
  overallRiskScore: number;
  overallRiskLevel: string;
  failureModesBySeverity: {
    CRITICAL: FailureMode[];
    HIGH: FailureMode[];
    MEDIUM: FailureMode[];
    LOW: FailureMode[];
  };
  maintenanceRecommendations: MaintenanceRecommendation[];
  lastUpdated: string;
}

/**
 * FMEA Analysis Component
 * Displays comprehensive Failure Mode Effects Analysis for an asset
 */
export function FMEAAnalysis({ assetId, assetName }: FMEAAnalysisProps) {
  const [fmeaData, setFmeaData] = useState<FMEAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  useEffect(() => {
    loadFMEAData();
  }, [assetId]);

  const loadFMEAData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/assets/${assetId}/fmea`);
      if (response.ok) {
        const data = await response.json();
        setFmeaData(data);
      } else {
        setError("Failed to load FMEA analysis");
      }
    } catch (error) {
      setError("Failed to load FMEA analysis");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      case "VERY_LOW": return "secondary";
      default: return "default";
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      default: return "default";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      default: return "default";
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    if (score >= 20) return "text-blue-600";
    return "text-green-600";
  };

  const getRiskProgressColor = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-blue-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading FMEA analysis...</span>
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
            <Button variant="outline" size="sm" onClick={loadFMEAData} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fmeaData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No FMEA data available</h3>
            
          </div>
        </CardContent>
      </Card>
    );
  }

  const allFailureModes = [
    ...fmeaData.failureModesBySeverity.CRITICAL,
    ...fmeaData.failureModesBySeverity.HIGH,
    ...fmeaData.failureModesBySeverity.MEDIUM,
    ...fmeaData.failureModesBySeverity.LOW,
  ];

  const filteredFailureModes = selectedSeverity === "ALL" 
    ? allFailureModes 
    : fmeaData.failureModesBySeverity[selectedSeverity as keyof typeof fmeaData.failureModesBySeverity] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">FMEA Analysis</h2>
          
        </div>
        <Button variant="outline" onClick={loadFMEAData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getRiskColor(fmeaData.overallRiskScore)}`}>
                {Math.round(fmeaData.overallRiskScore)}
              </div>
              
              <Badge variant={getRiskBadgeVariant(fmeaData.overallRiskLevel)} className="mt-2">
                {fmeaData.overallRiskLevel}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Condition Risk</span>
                  <span>{fmeaData.riskFactors.condition}/10</span>
                </div>
                <Progress 
                  value={fmeaData.riskFactors.condition * 10} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Age Risk</span>
                  <span>{fmeaData.riskFactors.age}/10</span>
                </div>
                <Progress 
                  value={fmeaData.riskFactors.age * 10} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maintenance History</span>
                  <span>{fmeaData.riskFactors.maintenanceHistory}/10</span>
                </div>
                <Progress 
                  value={fmeaData.riskFactors.maintenanceHistory * 10} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Inspection History</span>
                  <span>{fmeaData.riskFactors.inspectionHistory}/10</span>
                </div>
                <Progress 
                  value={fmeaData.riskFactors.inspectionHistory * 10} 
                  className="h-2"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">{fmeaData.failureModesBySeverity.CRITICAL.length} Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{fmeaData.failureModesBySeverity.HIGH.length} High</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{fmeaData.failureModesBySeverity.MEDIUM.length} Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{fmeaData.failureModesBySeverity.LOW.length} Low</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failure Modes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Failure Modes Analysis
          </CardTitle>
          <CardDescription>
            Potential failure modes identified from RCM templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button
              variant={selectedSeverity === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity("ALL")}
            >
              All ({allFailureModes.length})
            </Button>
            <Button
              variant={selectedSeverity === "CRITICAL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity("CRITICAL")}
            >
              Critical ({fmeaData.failureModesBySeverity.CRITICAL.length})
            </Button>
            <Button
              variant={selectedSeverity === "HIGH" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity("HIGH")}
            >
              High ({fmeaData.failureModesBySeverity.HIGH.length})
            </Button>
            <Button
              variant={selectedSeverity === "MEDIUM" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity("MEDIUM")}
            >
              Medium ({fmeaData.failureModesBySeverity.MEDIUM.length})
            </Button>
            <Button
              variant={selectedSeverity === "LOW" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity("LOW")}
            >
              Low ({fmeaData.failureModesBySeverity.LOW.length})
            </Button>
          </div>

          <div className="space-y-4">
            {filteredFailureModes.map((failureMode) => (
              <Card key={failureMode.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{failureMode.name}</h4>
                      
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getSeverityBadgeVariant(failureMode.severity)}>
                        {failureMode.severity}
                      </Badge>
                      <Badge variant={getRiskBadgeVariant(failureMode.riskLevel)}>
                        Risk: {failureMode.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Cause:</strong> {failureMode.cause || "Not specified"}
                    </div>
                    <div>
                      <strong>Consequences:</strong> {failureMode.consequences || "Not specified"}
                    </div>
                    <div>
                      <strong>Detection:</strong> {failureMode.detectionMethod || "Not specified"}
                    </div>
                  </div>
                  
                  {failureMode.preventionMethod && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <strong className="text-green-800">Prevention Method:</strong>
                      <p className="text-green-700 text-sm mt-1">{failureMode.preventionMethod}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Recommendations
          </CardTitle>
          <CardDescription>
            Prioritized maintenance actions based on risk analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fmeaData.maintenanceRecommendations.map((recommendation, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{recommendation.title}</h4>
                      
                    </div>
                    <Badge variant={getPriorityBadgeVariant(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span><strong>Est. Cost:</strong> ${recommendation.estimatedCost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span><strong>Timeline:</strong> {recommendation.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span><strong>Type:</strong> {recommendation.type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-sm text-muted-foreground text-center">
        Last updated: {new Date(fmeaData.lastUpdated).toLocaleString("en-AU")}
      </div>
    </div>
  );
}
