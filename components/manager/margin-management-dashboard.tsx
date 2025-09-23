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
  Clock,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Shield,
  Target,
  BarChart3,
  PieChart,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface MarginType {
  type: 'TIME' | 'CAPACITY' | 'MATERIAL' | 'FINANCIAL';
  allocated: number;
  utilized: number;
  available: number;
  description: string;
  examples: string[];
  trend: 'up' | 'down' | 'stable';
  utilizationRate: number;
}

interface AntifragileMetrics {
  stressEvents: number;
  improvementRate: number;
  adaptationScore: number;
  learningEvents: number;
  resilienceGain: number;
  lastStressTest: string;
  nextStressTest: string;
}

interface MarginEvent {
  id: string;
  type: 'DEPLOYMENT' | 'ALLOCATION' | 'OPTIMIZATION' | 'RECOVERY';
  marginType: string;
  amount: number;
  reason: string;
  timestamp: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  impact: 'positive' | 'negative' | 'neutral';
}

/**
 * Margin Management Dashboard Component
 * Comprehensive margin management showcasing Rule 4: Operate with Margin
 */
export function MarginManagementDashboard() {
  const [marginTypes, setMarginTypes] = useState<MarginType[]>([]);
  const [antifragileMetrics, setAntifragileMetrics] = useState<AntifragileMetrics | null>(null);
  const [marginEvents, setMarginEvents] = useState<MarginEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [selectedMarginType, setSelectedMarginType] = useState<string>("ALL");

  useEffect(() => {
    loadMarginData();
  }, [timeRange, selectedMarginType]);

  const loadMarginData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        timeRange,
        marginType: selectedMarginType
      });

      // Load margin status
      const marginResponse = await fetch(`/api/manager/margin-status?${params}`);
      if (marginResponse.ok) {
        const marginData = await marginResponse.json();
        setMarginTypes(marginData.margin.marginTypes || []);
        setAntifragileMetrics(marginData.margin.antifragileMetrics || null);
        setMarginEvents(marginData.margin.marginEvents || []);
      } else {
        setError("Failed to load margin data");
      }
    } catch (error) {
      setError("Failed to load margin data");
    } finally {
      setLoading(false);
    }
  };

  const getMarginIcon = (type: string) => {
    switch (type) {
      case "TIME": return <Clock className="h-5 w-5 text-blue-600" />;
      case "CAPACITY": return <Users className="h-5 w-5 text-green-600" />;
      case "MATERIAL": return <Package className="h-5 w-5 text-purple-600" />;
      case "FINANCIAL": return <DollarSign className="h-5 w-5 text-orange-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable": return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "DEPLOYMENT": return <Zap className="h-4 w-4 text-red-600" />;
      case "ALLOCATION": return <Target className="h-4 w-4 text-blue-600" />;
      case "OPTIMIZATION": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "RECOVERY": return <Shield className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "destructive";
      case "COMPLETED": return "default";
      case "PENDING": return "outline";
      default: return "default";
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return "text-red-600";
    if (rate >= 60) return "text-orange-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading margin management data...</span>
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
            <Button variant="outline" size="sm" onClick={loadMarginData} className="ml-auto">
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
          <h2 className="text-2xl font-bold text-foreground">Margin Management Dashboard</h2>
          
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMarginType} onValueChange={setSelectedMarginType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Margin Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="TIME">Time</SelectItem>
              <SelectItem value="CAPACITY">Capacity</SelectItem>
              <SelectItem value="MATERIAL">Material</SelectItem>
              <SelectItem value="FINANCIAL">Financial</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadMarginData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Margin Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marginTypes.map((margin) => (
          <Card key={margin.type} className="cursor-pointer hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMarginIcon(margin.type)}
                  <CardTitle className="text-sm font-medium">{margin.type}</CardTitle>
                </div>
                {getTrendIcon(margin.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  
                  <p className={`text-2xl font-bold ${getUtilizationColor(margin.utilizationRate)}`}>
                    {margin.available}%
                  </p>
                </div>
                
                <div>
                  
                  <p className="text-sm">{margin.description}</p>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Utilization</span>
                    <span>{margin.utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="progress-bar bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ '--width': margin.utilizationRate } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  
                  <div className="space-y-1">
                    {margin.examples.slice(0, 2).map((example, index) => (
                      <p key={index} className="text-xs text-muted-foreground">• {example}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Antifragile Metrics */}
      {antifragileMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Antifragile System Metrics
            </CardTitle>
            <CardDescription>
              System improvement under stress and learning capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  +{antifragileMetrics.improvementRate}%
                </div>
                
                
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {antifragileMetrics.adaptationScore}
                </div>
                
                
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {antifragileMetrics.resilienceGain}%
                </div>
                
                
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Stress Events</span>
                </div>
                <span className="text-sm font-bold">{antifragileMetrics.stressEvents}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Learning Events</span>
                </div>
                <span className="text-sm font-bold">{antifragileMetrics.learningEvents}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Stress Test:</span>
                <span className="font-medium">
                  {new Date(antifragileMetrics.nextStressTest).toLocaleDateString("en-AU")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Margin Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Margin Events
          </CardTitle>
          <CardDescription>
            Recent margin deployments, allocations, and optimizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marginEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <div className="font-medium text-sm">{event.reason}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString("en-AU")}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {event.amount}% {event.marginType}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.type}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getEventBadgeVariant(event.status)}>
                      {event.status}
                    </Badge>
                    {event.impact === 'positive' && <ArrowUp className="h-4 w-4 text-green-600" />}
                    {event.impact === 'negative' && <ArrowDown className="h-4 w-4 text-red-600" />}
                    {event.impact === 'neutral' && <Activity className="h-4 w-4 text-gray-600" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
