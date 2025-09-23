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
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
  DollarSign,
  Wrench,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { getDynamicBorderStyle } from "@/lib/dynamic-styles";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface RiskStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  veryLow: number;
  averageRiskScore: number;
}

interface AssetRisk {
  id: string;
  name: string;
  assetNumber: string;
  assetType: string;
  condition: string;
  priority: string;
  location: string;
  installationDate?: string;
  expectedLifespan?: number;
  riskFactors: {
    condition: number;
    age: number;
    maintenanceHistory: number;
    inspectionHistory: number;
  };
  overallRiskScore: number;
  riskLevel: string;
  failureModeCount: number;
  criticalFailureModes: number;
  highFailureModes: number;
  lastInspection?: string;
  lastMaintenance?: string;
  maintenanceFrequency: number;
}

interface RiskAnalysisData {
  assets: AssetRisk[];
  riskStats: RiskStats;
  filters: {
    assetType?: string;
    riskLevel?: string;
    sortBy: string;
    limit: number;
  };
}

/**
 * Risk Dashboard Component
 * Displays comprehensive risk analysis across all assets
 */
export function RiskDashboard() {
  const [riskData, setRiskData] = useState<RiskAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("ALL");
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("riskScore");

  useEffect(() => {
    loadRiskData();
  }, [assetTypeFilter, riskLevelFilter, sortBy]);

  const loadRiskData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (assetTypeFilter !== "ALL") params.append("assetType", assetTypeFilter);
      if (riskLevelFilter !== "ALL") params.append("riskLevel", riskLevelFilter);
      params.append("sortBy", sortBy);
      params.append("limit", "100");

      const response = await fetch(`/api/assets/risk-analysis?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
      } else {
        setError("Failed to load risk analysis");
      }
    } catch (error) {
      setError("Failed to load risk analysis");
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

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "CRITICAL": return "destructive";
      case "POOR": return "destructive";
      case "FAIR": return "outline";
      case "GOOD": return "secondary";
      case "EXCELLENT": return "secondary";
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

  const getRiskBarColor = (score: number) => {
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
        <span className="ml-2">Loading risk analysis...</span>
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
            <Button variant="outline" size="sm" onClick={loadRiskData} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!riskData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No risk data available</h3>
            
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
          <h2 className="text-2xl font-bold text-foreground">Risk Analysis Dashboard</h2>
          
        </div>
        <Button variant="outline" onClick={loadRiskData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-red-600">{riskData.riskStats.critical}</p>
                
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-orange-600">{riskData.riskStats.high}</p>
                
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Info className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-yellow-600">{riskData.riskStats.medium}</p>
                
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-green-600">{riskData.riskStats.low + riskData.riskStats.veryLow}</p>
                
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(85)}`}>
                {Math.round((riskData.riskStats.critical / riskData.riskStats.total) * 100)}%
              </div>
              
              <Badge variant="destructive" className="mt-1">
                {riskData.riskStats.critical} assets
              </Badge>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(70)}`}>
                {Math.round((riskData.riskStats.high / riskData.riskStats.total) * 100)}%
              </div>
              
              <Badge variant="destructive" className="mt-1">
                {riskData.riskStats.high} assets
              </Badge>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(50)}`}>
                {Math.round((riskData.riskStats.medium / riskData.riskStats.total) * 100)}%
              </div>
              
              <Badge variant="outline" className="mt-1">
                {riskData.riskStats.medium} assets
              </Badge>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(30)}`}>
                {Math.round((riskData.riskStats.low / riskData.riskStats.total) * 100)}%
              </div>
              
              <Badge variant="secondary" className="mt-1">
                {riskData.riskStats.low} assets
              </Badge>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(10)}`}>
                {Math.round((riskData.riskStats.veryLow / riskData.riskStats.total) * 100)}%
              </div>
              
              <Badge variant="secondary" className="mt-1">
                {riskData.riskStats.veryLow} assets
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Asset Type</label>
              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Asset Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Asset Types</SelectItem>
                  <SelectItem value="BUILDING">Building</SelectItem>
                  <SelectItem value="ROAD">Road</SelectItem>
                  <SelectItem value="BRIDGE">Bridge</SelectItem>
                  <SelectItem value="PARK">Park</SelectItem>
                  <SelectItem value="LIBRARY">Library</SelectItem>
                  <SelectItem value="SPORTS_FACILITY">Sports Facility</SelectItem>
                  <SelectItem value="TRAFFIC_LIGHT">Traffic Light</SelectItem>
                  <SelectItem value="WATER_TREATMENT">Water Treatment</SelectItem>
                  <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Risk Levels</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="VERY_LOW">Very Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riskScore">Risk Score</SelectItem>
                  <SelectItem value="name">Asset Name</SelectItem>
                  <SelectItem value="assetType">Asset Type</SelectItem>
                  <SelectItem value="condition">Condition</SelectItem>
                  <SelectItem value="lastInspection">Last Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Asset Risk Analysis
          </CardTitle>
          <CardDescription>
            Showing {riskData.assets.length} assets sorted by {sortBy}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskData.assets.slice(0, 20).map((asset) => (
              <Card key={asset.id} className="border-l-4 dynamic-border" style={getDynamicBorderStyle(getRiskBarColor(asset.overallRiskScore))}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{asset.name}</h4>
                        <Badge variant="outline">{asset.assetNumber}</Badge>
                        <Badge variant={getRiskBadgeVariant(asset.riskLevel)}>
                          {asset.riskLevel}
                        </Badge>
                        <Badge variant={getConditionBadgeVariant(asset.condition)}>
                          {asset.condition}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {asset.location || "No location"}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {asset.criticalFailureModes} critical, {asset.highFailureModes} high
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last inspection: {asset.lastInspection ? new Date(asset.lastInspection).toLocaleDateString("en-AU") : "Never"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getRiskColor(asset.overallRiskScore)}`}>
                        {asset.overallRiskScore}
                      </div>
                      
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Asset Type:</strong> {asset.assetType}
                    </div>
                    <div>
                      <strong>Failure Modes:</strong> {asset.failureModeCount}
                    </div>
                    <div>
                      <strong>Maintenance:</strong> {asset.maintenanceFrequency} recent
                    </div>
                    <div>
                      <strong>Age:</strong> {asset.installationDate ? 
                        Math.round((Date.now() - new Date(asset.installationDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : "Unknown"} years
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {riskData.assets.length > 20 && (
              <div className="text-center py-4">
                
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Average risk score: <span className={`font-bold ${getRiskColor(riskData.riskStats.averageRiskScore)}`}>
                {riskData.riskStats.averageRiskScore}
              </span>
            </p>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
