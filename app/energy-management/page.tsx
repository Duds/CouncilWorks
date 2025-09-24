"use client";

import { CarbonTrackingPanel } from "@/components/energy/carbon-tracking-panel";
import { EnergyAlertsPanel } from "@/components/energy/energy-alerts-panel";
import { EnergyConsumptionChart } from "@/components/energy/energy-consumption-chart";
import { EnergyEfficiencyMetrics } from "@/components/energy/energy-efficiency-metrics";
import { EnergyManagementDashboard } from "@/components/energy/energy-management-dashboard";
import { EnergyOptimisationPanel } from "@/components/energy/energy-optimisation-panel";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertTriangle,
    Download,
    Filter,
    Leaf,
    RefreshCw,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Energy Management Page - E21: Energy Management Core Integration
 *
 * Comprehensive energy management dashboard implementing The Aegrid Rules:
 * - Rule 1: Energy purpose mapping and value contribution tracking
 * - Rule 2: Risk-based energy optimisation and maintenance
 * - Rule 3: Critical energy asset monitoring and response
 * - Rule 4: Long-term energy planning and sustainability
 *
 * @component EnergyManagementPage
 * @example
 * ```tsx
 * <EnergyManagementPage />
 * ```
 * @accessibility
 * - ARIA roles: main, tablist, tab, tabpanel
 * - Keyboard navigation: Tab through energy management interface
 * - Screen reader: Announces energy metrics and alerts
 */
export default function EnergyManagementPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("MONTHLY");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod, selectedAsset]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/energy?action=dashboard&period=${selectedPeriod}`);
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.dashboard);
        setError(null);
      } else {
        setError(data.error || 'Failed to load energy data');
      }
    } catch (err) {
      setError('Failed to connect to energy management system');
      console.error('Energy dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/energy/consumption?periodType=${selectedPeriod}&limit=10000`);
      const data = await response.json();

      if (data.success) {
        // Create and download CSV
        const csv = convertToCSV(data.data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `energy-data-${selectedPeriod.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row).map(value =>
        typeof value === 'object' ? JSON.stringify(value) : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  };

  if (loading) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
        title="Energy Management"
        description="Advanced energy consumption analysis and optimisation capabilities"
      >
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading energy data...</span>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
        title="Energy Management"
        description="Advanced energy consumption analysis and optimisation capabilities"
      >
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Energy Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Energy Management"
      description="Advanced energy consumption analysis and optimisation capabilities"
    >
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Energy Management</h1>
            <p className="text-muted-foreground">
              Real-time energy monitoring, optimisation, and sustainability tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.recentConsumption?.reduce((sum: number, item: any) =>
                    sum + Number(item.consumptionValue || 0), 0
                  ).toFixed(1) || '0'} kWh
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.activeAlerts?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requiring attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Emissions</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.carbonSummary?.totalEmissions?.toFixed(1) || '0'} kg CO₂e
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.efficiencyMetrics?.reduce((sum: number, item: any) =>
                    sum + Number(item.efficiencyScore || 0), 0
                  ) / (dashboardData.efficiencyMetrics?.length || 1) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Energy efficiency score
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="optimisation">Optimisation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <EnergyManagementDashboard
              data={dashboardData}
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </TabsContent>

          <TabsContent value="consumption" className="space-y-4">
            <EnergyConsumptionChart
              data={dashboardData?.recentConsumption}
              period={selectedPeriod}
              assetId={selectedAsset}
            />
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <EnergyEfficiencyMetrics
              data={dashboardData?.efficiencyMetrics}
              period={selectedPeriod}
            />
          </TabsContent>

          <TabsContent value="carbon" className="space-y-4">
            <CarbonTrackingPanel
              data={dashboardData?.carbonSummary}
              period={selectedPeriod}
            />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <EnergyAlertsPanel
              alerts={dashboardData?.activeAlerts}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="optimisation" className="space-y-4">
            <EnergyOptimisationPanel
              actions={dashboardData?.optimisationActions}
              onRefresh={handleRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
