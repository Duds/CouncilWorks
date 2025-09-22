"use client";

import AppLayout from "@/components/layout/app-layout";
import { CriticalControlMonitor } from "@/components/manager/critical-control-monitor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  AlertTriangle, 
  Target,
  Activity,
  Eye,
  Zap,
  CheckCircle,
  Clock
} from "lucide-react";

/**
 * Critical Control Monitoring Page
 * High-consequence asset visibility showcasing Rule 1: Every Asset Has a Purpose
 */
export default function CriticalControlsPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Critical Control Monitoring"
      description="High-consequence asset monitoring and management"
    >
      <div className="space-y-6">
        {/* Critical Control KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Critical Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-xs text-muted-foreground">Warning Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Healthy Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Total Monitored</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Critical Control Monitor */}
        <CriticalControlMonitor />

        {/* Rule 1 Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Rule 1: Every Asset Has a Purpose
            </CardTitle>
            <CardDescription>
              Purpose-driven asset management with critical control focus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Critical Control Principles:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Eye className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span><strong>Purpose-Driven Identification:</strong> Assets classified by service purpose and consequence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                    <span><strong>Consequence-Based Monitoring:</strong> High-consequence assets receive priority attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span><strong>Real-Time Status Tracking:</strong> Continuous monitoring of critical asset health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span><strong>Automated Escalation:</strong> Immediate alerts for critical control failures</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Critical Control Categories:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Critical Infrastructure</p>
                      <p className="text-xs text-muted-foreground">Water, power, communication systems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Emergency Services</p>
                      <p className="text-xs text-muted-foreground">Fire, health, emergency response</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Community Services</p>
                      <p className="text-xs text-muted-foreground">Transportation, recreation, education</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}