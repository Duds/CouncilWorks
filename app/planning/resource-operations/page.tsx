'use client';

import AppLayout from '@/components/layout/app-layout';
import { MarginManagementDashboard } from '@/components/manager/margin-management-dashboard';
import { ResilienceEngine } from '@/components/resilience/resilience-engine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

/**
 * Resource Operations Page
 *
 * Real-time resource operations interface showcasing Rules 3 & 4: Respond to Real World + Operate with Margin
 * Provides signal response management and emergency resource deployment
 *
 * @component ResourceOperationsPage
 * @example
 * ```tsx
 * <ResourceOperationsPage />
 * ```
 * @accessibility
 * - ARIA roles: main, tablist, tabpanel
 * - Keyboard navigation: Tab through resource operations sections
 * - Screen reader: Announces margin status and signal responses
 */
export default function ResourceOperationsPage() {
  const { data: session } = useSession();

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Resource Operations"
      description="Real-time resource operations and signal response management"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Resource Operations
            </h1>
            <p className="text-muted-foreground">
              Real-time signal response and emergency resource deployment
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Rules 3 & 4: Real World + Margin
            </Badge>
            <Button variant="destructive" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Emergency Deploy
            </Button>
          </div>
        </div>

        {/* Margin Operations Tabs */}
        <Tabs defaultValue="signals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signals" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Signal Response
            </TabsTrigger>
            <TabsTrigger value="margin" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Margin Status
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Deployment
            </TabsTrigger>
            <TabsTrigger value="resilience" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Resilience Engine
            </TabsTrigger>
          </TabsList>

          {/* Signal Response Tab */}
          <TabsContent value="signals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Signals
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <p className="text-xs text-muted-foreground">
                    Signals requiring response
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Critical Alerts
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-xs text-muted-foreground">
                    High-priority signals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Response Rate
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-muted-foreground">
                    Signals responded to
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-Time Signal Processing
                </CardTitle>
                <CardDescription>
                  Live signal detection and automated response coordination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium text-sm">
                          Water Treatment Plant Alert
                        </div>
                        <div className="text-xs text-muted-foreground">
                          High turbidity detected - 2 minutes ago
                        </div>
                      </div>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-yellow-600" />
                      <div>
                        <div className="font-medium text-sm">
                          Traffic Signal Maintenance
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Scheduled maintenance approaching - 15 minutes ago
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Warning</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">
                          Pool Filtration System
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Routine maintenance completed - 1 hour ago
                        </div>
                      </div>
                    </div>
                    <Badge variant="default">Resolved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Margin Status Tab */}
          <TabsContent value="margin" className="space-y-4">
            <MarginManagementDashboard />
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Emergency Resource Deployment
                </CardTitle>
                <CardDescription>
                  Emergency margin deployment and surge capacity management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Time Margin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          75%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available time buffers
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                        >
                          Deploy Time Margin
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Capacity Margin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          60%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available capacity reserves
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                        >
                          Deploy Capacity
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Material Margin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                          85%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available material spares
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                        >
                          Deploy Materials
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Financial Margin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          70%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available contingency funds
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                        >
                          Deploy Funds
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Emergency Deployment Center
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Coordinate emergency resource deployment and surge
                      capacity management
                    </p>
                    <Button variant="destructive">
                      <Zap className="h-4 w-4 mr-2" />
                      Emergency Deployment Center
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resilience Engine Tab */}
          <TabsContent value="resilience" className="space-y-4">
            <ResilienceEngine
              organisationId={session?.user?.organisationId || 'default'}
              userRole={session?.user?.role || 'MANAGER'}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
