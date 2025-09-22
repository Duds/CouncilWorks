"use client";

import AppLayout from "@/components/layout/app-layout";
import { ManagerDashboard } from "@/components/manager/manager-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  BarChart3,
  Activity
} from "lucide-react";

/**
 * Manager Dashboard Page
 * Executive-level dashboard showcasing The Aegrid Rules in action
 * Focus on resilience metrics, critical controls, and risk management
 */
export default function ManagerPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Manager Dashboard"
      description="Executive-level resilience metrics and critical control monitoring"
    >
      <div className="space-y-6">
        {/* Manager KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-muted-foreground">Resilience Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Margin Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Assets Monitored</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Manager Dashboard */}
        <ManagerDashboard />

        {/* Aegrid Rules Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              The Aegrid Rules in Action
            </CardTitle>
            <CardDescription>
              How our resilience-first approach transforms asset management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 1: Every Asset Has a Purpose</h4>
                <p className="text-sm text-muted-foreground">
                  Purpose-driven asset organization with critical control focus
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 2: Risk Sets the Rhythm</h4>
                <p className="text-sm text-muted-foreground">
                  Risk-based scheduling with consequence × likelihood metrics
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 3: Respond to the Real World</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time signal detection and adaptive response
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 4: Operate with Margin</h4>
                <p className="text-sm text-muted-foreground">
                  Practical slack and antifragile system management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
