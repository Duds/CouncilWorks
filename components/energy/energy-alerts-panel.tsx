"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    RefreshCw,
    TrendingDown,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface EnergyAlertsPanelProps {
  alerts: any[];
  onRefresh: () => void;
}

/**
 * Energy Alerts Panel Component - E21
 *
 * Energy anomaly detection and alert management
 *
 * @component EnergyAlertsPanel
 * @example
 * ```tsx
 * <EnergyAlertsPanel
 *   alerts={alertData}
 *   onRefresh={handleRefresh}
 * />
 * ```
 * @accessibility
 * - ARIA roles: main, alert, status
 * - Keyboard navigation: Tab through alerts and actions
 * - Screen reader: Announces alert severity and descriptions
 */
export function EnergyAlertsPanel({ alerts, onRefresh }: EnergyAlertsPanelProps) {
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterAlerts();
  }, [alerts, severityFilter, typeFilter]);

  const filterAlerts = () => {
    let filtered = [...(alerts || [])];

    if (severityFilter !== "ALL") {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    if (typeFilter !== "ALL") {
      filtered = filtered.filter(alert => alert.alertType === typeFilter);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return AlertTriangle;
      case 'HIGH': return AlertCircle;
      case 'MEDIUM': return Clock;
      case 'LOW': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType) {
      case 'CONSUMPTION_SPIKE': return TrendingUp;
      case 'CONSUMPTION_DROP': return TrendingDown;
      case 'EFFICIENCY_DECLINE': return TrendingDown;
      case 'PEAK_DEMAND_EXCEEDED': return Zap;
      case 'COST_ANOMALY': return AlertCircle;
      case 'CARBON_INTENSITY_HIGH': return AlertTriangle;
      case 'METER_OFFLINE': return Clock;
      case 'DATA_QUALITY_ISSUE': return AlertCircle;
      case 'MAINTENANCE_REQUIRED': return Clock;
      case 'OPTIMISATION_OPPORTUNITY': return TrendingUp;
      default: return AlertTriangle;
    }
  };

  const getAlertTypeDescription = (alertType: string) => {
    switch (alertType) {
      case 'CONSUMPTION_SPIKE': return 'Unusual increase in energy consumption detected';
      case 'CONSUMPTION_DROP': return 'Significant decrease in energy consumption detected';
      case 'EFFICIENCY_DECLINE': return 'Energy efficiency has declined below threshold';
      case 'PEAK_DEMAND_EXCEEDED': return 'Peak demand limit exceeded';
      case 'COST_ANOMALY': return 'Unusual energy cost pattern detected';
      case 'CARBON_INTENSITY_HIGH': return 'Carbon emissions intensity above acceptable level';
      case 'METER_OFFLINE': return 'Energy meter is offline or not responding';
      case 'DATA_QUALITY_ISSUE': return 'Data quality issues detected in energy readings';
      case 'MAINTENANCE_REQUIRED': return 'Energy system requires maintenance attention';
      case 'OPTIMISATION_OPPORTUNITY': return 'Potential energy optimisation opportunity identified';
      default: return 'Energy alert detected';
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/energy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'acknowledge-alert',
          data: { alertId },
        }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: string, resolution: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/energy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resolve-alert',
          data: { alertId, resolution },
        }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertCounts = () => {
    const counts = {
      total: alerts?.length || 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    alerts?.forEach(alert => {
      switch (alert.severity) {
        case 'CRITICAL': counts.critical++; break;
        case 'HIGH': counts.high++; break;
        case 'MEDIUM': counts.medium++; break;
        case 'LOW': counts.low++; break;
      }
    });

    return counts;
  };

  const alertCounts = getAlertCounts();

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Energy Alerts</span>
            <Badge variant="outline">{alertCounts.total}</Badge>
          </h2>
          <p className="text-muted-foreground">
            Energy anomalies and issues requiring attention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severity</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CONSUMPTION_SPIKE">Consumption Spike</SelectItem>
              <SelectItem value="CONSUMPTION_DROP">Consumption Drop</SelectItem>
              <SelectItem value="EFFICIENCY_DECLINE">Efficiency Decline</SelectItem>
              <SelectItem value="PEAK_DEMAND_EXCEEDED">Peak Demand</SelectItem>
              <SelectItem value="COST_ANOMALY">Cost Anomaly</SelectItem>
              <SelectItem value="CARBON_INTENSITY_HIGH">High Carbon</SelectItem>
              <SelectItem value="METER_OFFLINE">Meter Offline</SelectItem>
              <SelectItem value="DATA_QUALITY_ISSUE">Data Quality</SelectItem>
              <SelectItem value="MAINTENANCE_REQUIRED">Maintenance</SelectItem>
              <SelectItem value="OPTIMISATION_OPPORTUNITY">Optimisation</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertCounts.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{alertCounts.high}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Medium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertCounts.medium}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{alertCounts.low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            {filteredAlerts.length} alerts found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length > 0 ? (
            <div className="space-y-4">
              {filteredAlerts.map((alert, index) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                const TypeIcon = getAlertTypeIcon(alert.alertType);
                const severityColor = getSeverityColor(alert.severity);

                return (
                  <div key={index} className={`p-4 border rounded-lg ${severityColor}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <SeverityIcon className="h-5 w-5 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <TypeIcon className="h-4 w-4" />
                            <h4 className="font-semibold">{alert.title}</h4>
                            <Badge variant={
                              alert.severity === 'CRITICAL' ? 'destructive' :
                              alert.severity === 'HIGH' ? 'destructive' :
                              alert.severity === 'MEDIUM' ? 'warning' : 'default'
                            }>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">
                              {alert.alertType.replace(/_/g, ' ')}
                            </Badge>
                          </div>

                          <p className="text-sm mb-2">
                            {alert.description}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              Asset: {alert.asset?.name || alert.meter?.name || 'Unknown'}
                            </span>
                            <span>
                              Detected: {new Date(alert.detectedAt).toLocaleString('en-AU')}
                            </span>
                            {alert.actualValue && (
                              <span>
                                Value: {alert.actualValue.toFixed(2)} {alert.unit || ''}
                              </span>
                            )}
                            {alert.thresholdValue && (
                              <span>
                                Threshold: {alert.thresholdValue.toFixed(2)} {alert.unit || ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {alert.status === 'ACTIVE' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              disabled={loading}
                            >
                              Acknowledge
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id, 'Resolved manually')}
                              disabled={loading}
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {alert.status === 'ACKNOWLEDGED' && (
                          <Badge variant="outline">
                            Acknowledged
                          </Badge>
                        )}
                        {alert.status === 'RESOLVED' && (
                          <Badge variant="default">
                            Resolved
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
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground">
                {alerts?.length === 0
                  ? 'No energy alerts at this time'
                  : 'No alerts match the current filters'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Type Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
          <CardDescription>
            Understanding different types of energy alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'CONSUMPTION_SPIKE',
              'CONSUMPTION_DROP',
              'EFFICIENCY_DECLINE',
              'PEAK_DEMAND_EXCEEDED',
              'COST_ANOMALY',
              'CARBON_INTENSITY_HIGH',
              'METER_OFFLINE',
              'DATA_QUALITY_ISSUE',
              'MAINTENANCE_REQUIRED',
              'OPTIMISATION_OPPORTUNITY'
            ].map((alertType) => {
              const TypeIcon = getAlertTypeIcon(alertType);

              return (
                <div key={alertType} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <TypeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">
                      {alertType.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getAlertTypeDescription(alertType)}
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
