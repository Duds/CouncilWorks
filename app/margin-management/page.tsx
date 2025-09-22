"use client";

import AppLayout from "@/components/layout/app-layout";
import { MarginManagementDashboard } from "@/components/manager/margin-management-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Users, 
  Package,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Target
} from "lucide-react";

/**
 * Margin Management Dashboard Page
 * Operational slack and antifragile systems showcasing Rule 4: Operate with Margin
 */
export default function MarginManagementPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Margin Management Dashboard"
      description="Operational slack and antifragile system management"
    >
      <div className="space-y-6">
        {/* Margin KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-muted-foreground">Time Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-xs text-muted-foreground">Capacity Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-muted-foreground">Material Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">88%</p>
                  <p className="text-xs text-muted-foreground">Financial Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Margin Management Dashboard */}
        <MarginManagementDashboard />

        {/* Rule 4 Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rule 4: Operate with Margin
            </CardTitle>
            <CardDescription>
              Practical slack and antifragile system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Margin Management Principles:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span><strong>Time Margin:</strong> Buffer time for unexpected delays and emergencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-green-500 mt-0.5" />
                    <span><strong>Capacity Margin:</strong> Surge capacity for peak demand and emergencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span><strong>Material Margin:</strong> Critical spare parts and emergency supplies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span><strong>Financial Margin:</strong> Emergency funding for unexpected expenses</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Antifragile System Benefits:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">System Improvement</p>
                      <p className="text-xs text-muted-foreground">Gets stronger under stress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Adaptive Response</p>
                      <p className="text-xs text-muted-foreground">Learns from disruptions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Resilience Gain</p>
                      <p className="text-xs text-muted-foreground">12% improvement under stress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Margin Optimization</p>
                      <p className="text-xs text-muted-foreground">Automated allocation and rebalancing</p>
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
