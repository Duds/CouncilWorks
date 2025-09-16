// app/enterprise-integration/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Settings,
  Activity,
  Database,
  Smartphone
} from 'lucide-react';

interface ERPIntegrationStatus {
  systemType: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  recordsProcessed: number;
  errors: number;
}

interface IoTStatus {
  devicesOnline: number;
  devicesOffline: number;
  activeAlerts: number;
  dataPointsProcessed: number;
  lastUpdate: string;
}

interface IoTAlert {
  alertId: string;
  deviceId: string;
  assetId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const EnterpriseIntegrationDashboard = () => {
  const [erpStatus, setErpStatus] = useState<ERPIntegrationStatus[]>([]);
  const [iotStatus, setIotStatus] = useState<IoTStatus | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<IoTAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    try {
      setLoading(true);
      
      // Fetch ERP integration status
      const erpResponse = await fetch('/api/integrations/erp');
      if (erpResponse.ok) {
        const erpData = await erpResponse.json();
        setErpStatus([
          {
            systemType: 'SAP',
            status: 'active',
            lastSync: '2024-01-15T10:30:00Z',
            recordsProcessed: 1250,
            errors: 0,
          },
          {
            systemType: 'Oracle',
            status: 'inactive',
            lastSync: '2024-01-10T14:20:00Z',
            recordsProcessed: 0,
            errors: 0,
          },
          {
            systemType: 'Microsoft Dynamics',
            status: 'error',
            lastSync: '2024-01-12T09:15:00Z',
            recordsProcessed: 0,
            errors: 3,
          },
        ]);
      }

      // Fetch IoT status
      const iotResponse = await fetch('/api/integrations/iot');
      if (iotResponse.ok) {
        const iotData = await iotResponse.json();
        setIotStatus(iotData);
      }

      // Fetch active alerts
      const alertsResponse = await fetch('/api/integrations/iot?action=alerts');
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setActiveAlerts(alertsData.alerts || []);
      }

    } catch (err) {
      setError('Failed to fetch integration data');
      console.error('Error fetching integration data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleERPSync = async (systemType: string) => {
    try {
      const response = await fetch('/api/integrations/erp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          integrationType: systemType,
          config: {
            endpoint: `https://${systemType.toLowerCase()}.example.com`,
            credentials: { username: 'user', password: 'pass' },
            dataMapping: {},
            syncSettings: { frequency: 'hourly', batchSize: 100, retryAttempts: 3 },
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${systemType} sync completed:`, result);
        // Refresh data
        fetchIntegrationData();
      }
    } catch (err) {
      console.error(`Failed to sync ${systemType}:`, err);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/integrations/iot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acknowledgeAlert',
          data: { alertId, acknowledgedBy: 'current-user' },
        }),
      });

      if (response.ok) {
        // Refresh alerts
        const alertsResponse = await fetch('/api/integrations/iot?action=alerts');
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json();
          setActiveAlerts(alertsData.alerts || []);
        }
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading integration data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Integration Hub</h1>
          <p className="text-muted-foreground">
            Manage ERP integrations and IoT/Telematics systems
          </p>
        </div>
        <Button onClick={fetchIntegrationData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="erp">ERP Integration</TabsTrigger>
          <TabsTrigger value="iot">IoT & Telematics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ERP Systems</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{erpStatus.length}</div>
                <p className="text-xs text-muted-foreground">
                  {erpStatus.filter(s => s.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IoT Devices</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {iotStatus ? iotStatus.devicesOnline + iotStatus.devicesOffline : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {iotStatus ? iotStatus.devicesOnline : 0} online
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeAlerts.filter(a => a.severity === 'critical').length} critical
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Points</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {iotStatus ? iotStatus.dataPointsProcessed.toLocaleString() : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Processed today
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ERP Integration Status</CardTitle>
                <CardDescription>Current status of ERP system integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {erpStatus.map((erp) => (
                  <div key={erp.systemType} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(erp.status)}
                      <div>
                        <p className="font-medium">{erp.systemType}</p>
                        <p className="text-sm text-muted-foreground">
                          Last sync: {new Date(erp.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{erp.recordsProcessed}</p>
                      <p className="text-xs text-muted-foreground">records</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IoT Device Status</CardTitle>
                <CardDescription>Real-time IoT device monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">Online Devices</p>
                      <p className="text-sm text-muted-foreground">Connected and reporting</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">
                      {iotStatus ? iotStatus.devicesOnline : 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium">Offline Devices</p>
                      <p className="text-sm text-muted-foreground">Not responding</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">
                      {iotStatus ? iotStatus.devicesOffline : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="erp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ERP System Integration</CardTitle>
              <CardDescription>
                Manage integration with SAP, Oracle, and Microsoft Dynamics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {erpStatus.map((erp) => (
                <div key={erp.systemType} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(erp.status)}
                      <div>
                        <h3 className="font-semibold">{erp.systemType}</h3>
                        <p className="text-sm text-muted-foreground">
                          Status: <Badge variant={erp.status === 'active' ? 'default' : 'secondary'}>
                            {erp.status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleERPSync(erp.systemType)}
                        disabled={erp.status === 'inactive'}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Sync</p>
                      <p className="font-medium">{new Date(erp.lastSync).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Records Processed</p>
                      <p className="font-medium">{erp.recordsProcessed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className="font-medium text-red-500">{erp.errors}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IoT & Telematics Integration</CardTitle>
              <CardDescription>
                Real-time asset monitoring and data collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Device Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Online</span>
                      <span className="font-medium">{iotStatus?.devicesOnline || 0}</span>
                    </div>
                    <Progress value={iotStatus ? (iotStatus.devicesOnline / (iotStatus.devicesOnline + iotStatus.devicesOffline)) * 100 : 0} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Data Processing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Points Processed</span>
                      <span className="font-medium">{iotStatus?.dataPointsProcessed.toLocaleString() || 0}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last update: {iotStatus ? new Date(iotStatus.lastUpdate).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Real-time alerts from IoT devices and systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <div key={alert.alertId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.alertType}</Badge>
                          </div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">
                            Device: {alert.deviceId} | Asset: {alert.assetId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.alertId)}
                            disabled={alert.acknowledged}
                          >
                            {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseIntegrationDashboard;
