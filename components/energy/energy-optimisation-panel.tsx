"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Pause,
    Play,
    Plus,
    RefreshCw,
    Settings,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface EnergyOptimisationPanelProps {
  actions: any[];
  onRefresh: () => void;
}

/**
 * Energy Optimisation Panel Component - E21
 *
 * Energy optimisation actions and automated controls
 *
 * @component EnergyOptimisationPanel
 * @example
 * ```tsx
 * <EnergyOptimisationPanel
 *   actions={optimisationData}
 *   onRefresh={handleRefresh}
 * />
 * ```
 * @accessibility
 * - ARIA roles: main, button, status
 * - Keyboard navigation: Tab through optimisation controls
 * - Screen reader: Announces optimisation actions and results
 */
export function EnergyOptimisationPanel({ actions, onRefresh }: EnergyOptimisationPanelProps) {
  const [filteredActions, setFilteredActions] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [systemFilter, setSystemFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterActions();
  }, [actions, statusFilter, systemFilter]);

  const filterActions = () => {
    let filtered = [...(actions || [])];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(action => action.status === statusFilter);
    }

    if (systemFilter !== "ALL") {
      filtered = filtered.filter(action => action.systemType === systemFilter);
    }

    setFilteredActions(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return Clock;
      case 'EXECUTING': return Settings;
      case 'COMPLETED': return CheckCircle;
      case 'FAILED': return AlertTriangle;
      case 'CANCELLED': return Pause;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'EXECUTING': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSystemIcon = (systemType: string) => {
    switch (systemType) {
      case 'HVAC': return Zap;
      case 'LIGHTING': return Zap;
      case 'EQUIPMENT': return Settings;
      case 'LOAD_BALANCING': return TrendingUp;
      default: return Settings;
    }
  };

  const handleExecuteAction = async (actionId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/energy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'execute-optimisation',
          data: { actionId },
        }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to execute optimisation action:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionCounts = () => {
    const counts = {
      total: actions?.length || 0,
      pending: 0,
      executing: 0,
      completed: 0,
      failed: 0,
    };

    actions?.forEach(action => {
      switch (action.status) {
        case 'PENDING': counts.pending++; break;
        case 'EXECUTING': counts.executing++; break;
        case 'COMPLETED': counts.completed++; break;
        case 'FAILED': counts.failed++; break;
      }
    });

    return counts;
  };

  const getTotalSavings = () => {
    return actions?.reduce((total, action) => {
      return total + (Number(action.actualSavings || action.expectedSavings || 0));
    }, 0) || 0;
  };

  const getTotalEnergyReduction = () => {
    return actions?.reduce((total, action) => {
      return total + (Number(action.energyReduction || 0));
    }, 0) || 0;
  };

  const actionCounts = getActionCounts();
  const totalSavings = getTotalSavings();
  const totalEnergyReduction = getTotalEnergyReduction();

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Energy Optimisation</span>
            <Badge variant="outline">{actionCounts.total}</Badge>
          </h2>
          <p className="text-muted-foreground">
            Automated energy optimisation and efficiency improvements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="EXECUTING">Executing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={systemFilter} onValueChange={setSystemFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Systems</SelectItem>
              <SelectItem value="HVAC">HVAC</SelectItem>
              <SelectItem value="LIGHTING">Lighting</SelectItem>
              <SelectItem value="EQUIPMENT">Equipment</SelectItem>
              <SelectItem value="LOAD_BALANCING">Load Balancing</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Action
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              Optimisation actions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalSavings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cost savings achieved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Reduced</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalEnergyReduction.toFixed(1)} kWh
            </div>
            <p className="text-xs text-muted-foreground">
              Energy consumption reduced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actionCounts.total > 0
                ? ((actionCounts.completed / actionCounts.total) * 100).toFixed(1)
                : '0'
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Actions completed successfully
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{actionCounts.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Executing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{actionCounts.executing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{actionCounts.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{actionCounts.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actionCounts.pending + actionCounts.executing}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimisation Actions List */}
      <Card>
        <CardHeader>
          <CardTitle>Optimisation Actions</CardTitle>
          <CardDescription>
            {filteredActions.length} actions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActions.length > 0 ? (
            <div className="space-y-4">
              {filteredActions.map((action, index) => {
                const StatusIcon = getStatusIcon(action.status);
                const SystemIcon = getSystemIcon(action.systemType);
                const statusColor = getStatusColor(action.status);

                return (
                  <div key={index} className={`p-4 border rounded-lg ${statusColor}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <StatusIcon className="h-5 w-5 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <SystemIcon className="h-4 w-4" />
                            <h4 className="font-semibold">
                              {action.actionType.replace(/_/g, ' ')}
                            </h4>
                            <Badge variant={
                              action.status === 'COMPLETED' ? 'default' :
                              action.status === 'EXECUTING' ? 'default' :
                              action.status === 'PENDING' ? 'outline' : 'destructive'
                            }>
                              {action.status}
                            </Badge>
                            <Badge variant="outline">
                              {action.systemType}
                            </Badge>
                          </div>

                          <p className="text-sm mb-2">
                            {action.description}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              Asset: {action.asset?.name || 'System-wide'}
                            </span>
                            <span>
                              Created: {new Date(action.createdAt).toLocaleDateString('en-AU')}
                            </span>
                            {action.scheduledAt && (
                              <span>
                                Scheduled: {new Date(action.scheduledAt).toLocaleDateString('en-AU')}
                              </span>
                            )}
                            {action.executedAt && (
                              <span>
                                Executed: {new Date(action.executedAt).toLocaleDateString('en-AU')}
                              </span>
                            )}
                          </div>

                          {/* Results */}
                          {(action.expectedSavings || action.actualSavings || action.energyReduction) && (
                            <div className="flex items-center space-x-4 mt-2">
                              {action.expectedSavings && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Expected Savings: </span>
                                  <span className="font-medium text-green-600">
                                    ${Number(action.expectedSavings).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {action.actualSavings && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Actual Savings: </span>
                                  <span className="font-medium text-green-600">
                                    ${Number(action.actualSavings).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {action.energyReduction && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Energy Reduced: </span>
                                  <span className="font-medium text-blue-600">
                                    {Number(action.energyReduction).toFixed(1)} kWh
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {action.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => handleExecuteAction(action.id)}
                            disabled={loading}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Execute
                          </Button>
                        )}
                        {action.status === 'EXECUTING' && (
                          <Badge variant="outline">
                            <Settings className="h-3 w-3 mr-1 animate-spin" />
                            Running
                          </Badge>
                        )}
                        {action.status === 'COMPLETED' && (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {action.status === 'FAILED' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Optimisation Actions</h3>
              <p className="text-muted-foreground">
                {actions?.length === 0
                  ? 'No optimisation actions scheduled'
                  : 'No actions match the current filters'
                }
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Action
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimisation Types */}
      <Card>
        <CardHeader>
          <CardTitle>Optimisation Types</CardTitle>
          <CardDescription>
            Available energy optimisation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'SCHEDULE_ADJUSTMENT', description: 'Optimize equipment schedules based on usage patterns', icon: Clock },
              { type: 'LOAD_SHEDDING', description: 'Reduce energy consumption during peak demand periods', icon: TrendingUp },
              { type: 'EFFICIENCY_IMPROVEMENT', description: 'Implement efficiency improvements and upgrades', icon: Settings },
              { type: 'DEMAND_RESPONSE', description: 'Participate in demand response programs', icon: Zap },
              { type: 'TEMPERATURE_OPTIMISATION', description: 'Optimize HVAC temperature settings', icon: Settings },
              { type: 'LIGHTING_CONTROL', description: 'Implement smart lighting controls', icon: Zap },
            ].map((optimisation) => {
              const OptimisationIcon = optimisation.icon;

              return (
                <div key={optimisation.type} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <OptimisationIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">
                      {optimisation.type.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {optimisation.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
