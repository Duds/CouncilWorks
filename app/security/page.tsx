/**
 * Security Monitoring Dashboard Component
 * Provides real-time security status and vulnerability monitoring
 * @component SecurityDashboard
 * @example
 * ```tsx
 * <SecurityDashboard />
 * ```
 * @accessibility
 * - ARIA roles: main, region, alert
 * - Keyboard navigation: tab through security metrics
 */
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Database,
  Container,
  Code,
  Lock,
} from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  value: number;
  total: number;
  lastUpdated: string;
  description: string;
}

interface VulnerabilityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  component: string;
  cve?: string;
  published: string;
  fixed?: boolean;
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [alerts, setAlerts] = useState<VulnerabilityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastScan, setLastScan] = useState<string>('');

  useEffect(() => {
    fetchSecurityData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchSecurityData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true);

      // Fetch security metrics
      const metricsResponse = await fetch('/api/security/metrics');
      const metricsData = await metricsResponse.json();
      setMetrics(metricsData);

      // Fetch vulnerability alerts
      const alertsResponse = await fetch('/api/security/alerts');
      const alertsData = await alertsResponse.json();
      setAlerts(alertsData);

      setLastScan(new Date().toLocaleString('en-AU'));
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
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
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getOverallStatus = () => {
    const criticalCount = alerts.filter(
      alert => alert.severity === 'critical'
    ).length;
    const highCount = alerts.filter(alert => alert.severity === 'high').length;

    if (criticalCount > 0) return 'critical';
    if (highCount > 0) return 'warning';
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Security Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor security status and vulnerability alerts across your
            CouncilWorks platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={overallStatus === 'healthy' ? 'default' : 'destructive'}
          >
            {overallStatus === 'healthy' ? 'Secure' : 'Action Required'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Alert */}
      {overallStatus !== 'healthy' && (
        <Alert
          variant={overallStatus === 'critical' ? 'destructive' : 'default'}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {overallStatus === 'critical'
              ? 'Critical Security Issues Detected'
              : 'Security Attention Required'}
          </AlertTitle>
          <AlertDescription>
            {overallStatus === 'critical'
              ? 'Immediate action required to address critical vulnerabilities.'
              : 'Please review and address the security issues listed below.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Security Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
              {getStatusIcon(metric.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}/{metric.total}
              </div>
              <Progress
                value={(metric.value / metric.total) * 100}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated:{' '}
                {new Date(metric.lastUpdated).toLocaleString('en-AU')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vulnerability Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Vulnerability Alerts
          </CardTitle>
          <CardDescription>
            Current security vulnerabilities requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Active Vulnerabilities
              </h3>
              <p className="text-muted-foreground">
                Your system is currently secure with no known vulnerabilities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.cve && (
                          <Badge variant="outline">{alert.cve}</Badge>
                        )}
                        {alert.fixed && <Badge variant="default">Fixed</Badge>}
                      </div>
                      <h4 className="font-semibold mb-1">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Code className="h-3 w-3 mr-1" />
                          {alert.component}
                        </span>
                        <span>
                          Published:{' '}
                          {new Date(alert.published).toLocaleDateString(
                            'en-AU'
                          )}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
          <CardDescription>
            Quick actions to maintain security posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto p-4">
              <Database className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Dependency Scan</div>
                <div className="text-sm text-muted-foreground">
                  Scan for vulnerable dependencies
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <Container className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Container Scan</div>
                <div className="text-sm text-muted-foreground">
                  Scan Docker images for vulnerabilities
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <Lock className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Infrastructure Scan</div>
                <div className="text-sm text-muted-foreground">
                  Scan IaC files for misconfigurations
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last scan: {lastScan || 'Never'}
      </div>
    </div>
  );
}
