"use client";

import AppLayout from "@/components/layout/app-layout";
import { DemoShowcase } from "@/components/manager/demo-showcase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Target, 
  BarChart3, 
  Activity, 
  Clock,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Star
} from "lucide-react";

/**
 * Demo Showcase Page
 * Comprehensive demonstration of The Aegrid Rules in action
 */
export default function DemoShowcasePage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Demo Showcase"
      description="Comprehensive demonstration of The Aegrid Rules in action"
    >
      <div className="space-y-6">
        {/* Demo KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-muted-foreground">Resilience Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">23%</p>
                  <p className="text-xs text-muted-foreground">Cost Reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">45%</p>
                  <p className="text-xs text-muted-foreground">Downtime Reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Stakeholder Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Showcase */}
        <DemoShowcase />

        {/* The Aegrid Rules Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              The Aegrid Rules in Action
            </CardTitle>
            <CardDescription>
              How our four core rules transform asset management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 1: Every Asset Has a Purpose</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Purpose-driven asset organization with critical control focus
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Critical control identification</p>
                  <p>• Purpose-driven hierarchy</p>
                  <p>• Service impact assessment</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 2: Risk Sets the Rhythm</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Risk-based scheduling with consequence × likelihood metrics
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Dynamic risk assessment</p>
                  <p>• Consequence-driven scheduling</p>
                  <p>• Risk trend analysis</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 3: Respond to the Real World</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Real-time signal detection and adaptive response
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Signal detection system</p>
                  <p>• Adaptive response algorithms</p>
                  <p>• Real-world condition monitoring</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Rule 4: Operate with Margin</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Practical slack and antifragile system management
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>• Margin management system</p>
                  <p>• Antifragile capabilities</p>
                  <p>• Operational slack optimization</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Demo Scenarios
            </CardTitle>
            <CardDescription>
              Pre-configured scenarios showcasing Aegrid capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
                <h4 className="font-medium mb-2">Default Scenario</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive demonstration of all Aegrid Rules
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>All features enabled</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
                <h4 className="font-medium mb-2">Crisis Response</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  How Aegrid handles major infrastructure crisis
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 text-orange-600" />
                  <span>Emergency protocols</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
                <h4 className="font-medium mb-2">Optimization</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Continuous improvement and learning capabilities
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span>Learning algorithms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
