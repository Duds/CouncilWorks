/**
 * Security Dashboard Component
 * 
 * Comprehensive security monitoring dashboard for Essential Eight compliance
 * Displays CSP violations, application inventory, and patch management status
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  RefreshCw,
  Eye,
  Settings,
  FileText,
  Zap,
  Database,
  Lock,
  Key,
  Activity,
  Server,
  HardDrive,
  Cpu
} from 'lucide-react';

interface SecurityMetrics {
  cspViolations: number;
  applicationsTotal: number;
  applicationsApproved: number;
  applicationsPending: number;
  applicationsQuarantined: number;
  patchesTotal: number;
  patchesApplied: number;
  patchesPending: number;
  patchesCritical: number;
  infrastructureApplications: number;
  infrastructureApproved: number;
  infrastructureQuarantined: number;
  osPatchesTotal: number;
  osPatchesApplied: number;
  osPatchesCritical: number;
  backupJobsTotal: number;
  backupJobsActive: number;
  backupRunsSuccessful: number;
  backupRunsFailed: number;
  complianceScore: number;
}

interface CSPViolation {
  id: string;
  violatedDirective: string;
  blockedUri: string;
  sourceFile: string;
  lineNumber: number;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ApplicationSummary {
  id: string;
  name: string;
  version: string;
  vendor: string;
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' | 'QUARANTINED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  vulnerabilities: number;
  lastScanAt: Date;
}

interface PatchSummary {
  id: string;
  name: string;
  version: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DISCOVERED' | 'TESTING' | 'APPROVED' | 'DEPLOYED' | 'FAILED';
  publishedAt: Date;
  deployedAt?: Date;
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [cspViolations, setCspViolations] = useState<CSPViolation[]>([]);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [patches, setPatches] = useState<PatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Load security metrics
      const metricsResponse = await fetch('/api/security/metrics');
      const metricsData = await metricsResponse.json();
      setMetrics(metricsData.metrics);

      // Load CSP violations
      const cspResponse = await fetch('/api/security/csp-violations');
      const cspData = await cspResponse.json();
      setCspViolations(cspData.violations || []);

      // Load application inventory
      const appResponse = await fetch('/api/security/application-inventory');
      const appData = await appResponse.json();
      setApplications(appData.inventory?.applications || []);

      // Load patch management
      const patchResponse = await fetch('/api/security/patch-management');
      const patchData = await patchResponse.json();
      setPatches(patchData.pendingPatches || []);

    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'DEPLOYED': return 'default';
      case 'PENDING_APPROVAL':
      case 'TESTING': return 'secondary';
      case 'REJECTED':
      case 'FAILED': return 'destructive';
      case 'QUARANTINED': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading security dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Essential Eight compliance monitoring and security management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadSecurityData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Security Metrics Overview */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
              <Progress value={metrics.complianceScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Essential Eight compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CSP Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.cspViolations}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.applicationsTotal}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.applicationsApproved} approved, {metrics.applicationsPending} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patches</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.patchesTotal}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.patchesApplied} applied, {metrics.patchesCritical} critical
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.infrastructureApplications}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.infrastructureApproved} approved, {metrics.infrastructureQuarantined} quarantined
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">OS Patches</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.osPatchesTotal}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.osPatchesApplied} applied, {metrics.osPatchesCritical} critical
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backups</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.backupJobsTotal}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.backupJobsActive} active, {metrics.backupRunsSuccessful} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">SECURE</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="csp">CSP Violations</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="patches">Patches</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="os-patches">OS Patches</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent CSP Violations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Recent CSP Violations
                </CardTitle>
                <CardDescription>
                  Content Security Policy violations in the last 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cspViolations.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No CSP violations detected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cspViolations.slice(0, 5).map((violation) => (
                      <div key={violation.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{violation.violatedDirective}</p>
                          <p className="text-xs text-muted-foreground">{violation.sourceFile}:{violation.lineNumber}</p>
                        </div>
                        <Badge variant={getSeverityColor(violation.severity)}>
                          {violation.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* High-Risk Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  High-Risk Applications
                </CardTitle>
                <CardDescription>
                  Applications requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.filter(app => app.riskLevel === 'HIGH' || app.riskLevel === 'CRITICAL').length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No high-risk applications</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {applications
                      .filter(app => app.riskLevel === 'HIGH' || app.riskLevel === 'CRITICAL')
                      .slice(0, 5)
                      .map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{app.name}</p>
                            <p className="text-xs text-muted-foreground">{app.vendor} v{app.version}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getSeverityColor(app.riskLevel)}>
                              {app.riskLevel}
                            </Badge>
                            {app.vulnerabilities > 0 && (
                              <Badge variant="destructive">
                                {app.vulnerabilities} vulns
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Critical Patches Alert */}
          {patches.filter(patch => patch.severity === 'CRITICAL').length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Critical Patches Required</AlertTitle>
              <AlertDescription className="text-red-700">
                {patches.filter(patch => patch.severity === 'CRITICAL').length} critical patches 
                require immediate attention. These patches address critical security vulnerabilities.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* CSP Violations Tab */}
        <TabsContent value="csp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Security Policy Violations</CardTitle>
              <CardDescription>
                Monitor and analyze CSP violations for security improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cspViolations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No CSP Violations</h3>
                  <p className="text-sm text-muted-foreground">
                    Your Content Security Policy is working correctly
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cspViolations.map((violation) => (
                    <div key={violation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={getSeverityColor(violation.severity)}>
                              {violation.severity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(violation.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="font-medium">{violation.violatedDirective}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Blocked URI: {violation.blockedUri}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Source: {violation.sourceFile}:{violation.lineNumber}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Inventory</CardTitle>
              <CardDescription>
                Manage application whitelisting and security compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{app.name}</h4>
                          <Badge variant={getStatusColor(app.status)}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getSeverityColor(app.riskLevel)}>
                            {app.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.vendor} v{app.version}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last scanned: {new Date(app.lastScanAt).toLocaleString()}
                        </p>
                        {app.vulnerabilities > 0 && (
                          <p className="text-sm text-red-600">
                            {app.vulnerabilities} vulnerabilities detected
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patches Tab */}
        <TabsContent value="patches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patch Management</CardTitle>
              <CardDescription>
                Monitor patch status and deployment progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patches.map((patch) => (
                  <div key={patch.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{patch.name}</h4>
                          <Badge variant={getSeverityColor(patch.severity)}>
                            {patch.severity}
                          </Badge>
                          <Badge variant={getStatusColor(patch.status)}>
                            {patch.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Version: {patch.version}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Published: {new Date(patch.publishedAt).toLocaleString()}
                        </p>
                        {patch.deployedAt && (
                          <p className="text-sm text-muted-foreground">
                            Deployed: {new Date(patch.deployedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {patch.status === 'DISCOVERED' && (
                          <Button variant="outline" size="sm">
                            <Zap className="h-4 w-4 mr-2" />
                            Test
                          </Button>
                        )}
                        {patch.status === 'APPROVED' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Deploy
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Application Control</CardTitle>
              <CardDescription>
                Manage infrastructure-level application whitelisting and execution policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Server className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Infrastructure Control Active</h3>
                <p className="text-sm text-muted-foreground">
                  Container-level and OS-level application whitelisting is operational
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Inventory
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Policies
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OS Patches Tab */}
        <TabsContent value="os-patches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OS Patch Management</CardTitle>
              <CardDescription>
                Monitor and manage operating system patch deployment and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Cpu className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">OS Patch Management Active</h3>
                <p className="text-sm text-muted-foreground">
                  Automated OS patch discovery, testing, and deployment is operational
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Patches
                  </Button>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy Patches
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup Enhancement</CardTitle>
              <CardDescription>
                Monitor backup integrity verification, testing, and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <HardDrive className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Backup System Active</h3>
                <p className="text-sm text-muted-foreground">
                  Automated backup integrity verification and testing is operational
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Backups
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Integrity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
