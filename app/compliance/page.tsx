/**
 * Compliance Dashboard Page
 * 
 * Comprehensive compliance dashboard for ISO standards
 * 
 * @fileoverview Compliance dashboard UI component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, Shield, Target, AlertTriangle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/protected-route';

interface ComplianceData {
  iso14224: {
    status: 'compliant' | 'non-compliant' | 'partial';
    score: number;
    lastAudit: string;
    nextAudit: string;
  };
  iso55000: {
    status: 'compliant' | 'non-compliant' | 'partial';
    score: number;
    lastAudit: string;
    nextAudit: string;
  };
  iso27001: {
    status: 'compliant' | 'non-compliant' | 'partial';
    score: number;
    lastAudit: string;
    nextAudit: string;
  };
  iso31000: {
    status: 'compliant' | 'non-compliant' | 'partial';
    score: number;
    lastAudit: string;
    nextAudit: string;
  };
}

export default function ComplianceDashboard() {
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('');

  useEffect(() => {
    fetchComplianceData();
  }, [selectedOrganisation]);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/compliance/dashboard?organisationId=${selectedOrganisation}`);
      if (response.ok) {
        const data = await response.json();
        setComplianceData(data);
      }
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'non-compliant':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor ISO compliance across all standards</p>
        </div>

        <div className="mb-6">
          <Select value={selectedOrganisation} onValueChange={setSelectedOrganisation}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Organisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="org1">Organisation 1</SelectItem>
              <SelectItem value="org2">Organisation 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {complianceData && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="iso14224">ISO 14224</TabsTrigger>
              <TabsTrigger value="iso55000">ISO 55000</TabsTrigger>
              <TabsTrigger value="iso27001">ISO 27001</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ISO 14224</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complianceData.iso14224.status)}
                      <Badge className={getStatusColor(complianceData.iso14224.status)}>
                        {complianceData.iso14224.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={complianceData.iso14224.score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {complianceData.iso14224.score}% compliant
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ISO 55000</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complianceData.iso55000.status)}
                      <Badge className={getStatusColor(complianceData.iso55000.status)}>
                        {complianceData.iso55000.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={complianceData.iso55000.score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {complianceData.iso55000.score}% compliant
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ISO 27001</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complianceData.iso27001.status)}
                      <Badge className={getStatusColor(complianceData.iso27001.status)}>
                        {complianceData.iso27001.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={complianceData.iso27001.score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {complianceData.iso27001.score}% compliant
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ISO 31000</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complianceData.iso31000.status)}
                      <Badge className={getStatusColor(complianceData.iso31000.status)}>
                        {complianceData.iso31000.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={complianceData.iso31000.score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {complianceData.iso31000.score}% compliant
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="iso14224" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ISO 14224 Compliance</CardTitle>
                  <CardDescription>Reliability data collection and exchange standards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Compliance Status</span>
                      <Badge className={getStatusColor(complianceData.iso14224.status)}>
                        {complianceData.iso14224.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Compliance Score</span>
                      <span>{complianceData.iso14224.score}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Audit</span>
                      <span>{complianceData.iso14224.lastAudit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Next Audit</span>
                      <span>{complianceData.iso14224.nextAudit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="iso55000" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ISO 55000 Compliance</CardTitle>
                  <CardDescription>Asset management system requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Compliance Status</span>
                      <Badge className={getStatusColor(complianceData.iso55000.status)}>
                        {complianceData.iso55000.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Compliance Score</span>
                      <span>{complianceData.iso55000.score}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Audit</span>
                      <span>{complianceData.iso55000.lastAudit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Next Audit</span>
                      <span>{complianceData.iso55000.nextAudit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="iso27001" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ISO 27001 Compliance</CardTitle>
                  <CardDescription>Information security management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Compliance Status</span>
                      <Badge className={getStatusColor(complianceData.iso27001.status)}>
                        {complianceData.iso27001.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Compliance Score</span>
                      <span>{complianceData.iso27001.score}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Audit</span>
                      <span>{complianceData.iso27001.lastAudit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Next Audit</span>
                      <span>{complianceData.iso27001.nextAudit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ProtectedRoute>
  );
}
