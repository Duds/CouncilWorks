"use client";

import AppLayout from "@/components/layout/app-layout";
import { RiskDrivenPlanner } from "@/components/manager/risk-driven-planner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  AlertTriangle, 
  Clock,
  Target,
  Activity,
  Zap,
  TrendingUp,
  Calendar,
  Shield
} from "lucide-react";

/**
 * Risk-Driven Maintenance Planner Page
 * Dynamic scheduling showcasing Rule 2: Risk Sets the Rhythm
 */
export default function RiskPlannerPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Risk-Driven Maintenance Planner"
      description="Dynamic scheduling based on risk assessment and real-world conditions"
    >
      <div className="space-y-6">
        {/* Risk Planning KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">High Risk Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-xs text-muted-foreground">Scheduled This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">45min</p>
                  <p className="text-xs text-muted-foreground">Avg Response Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Schedule Adherence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Risk-Driven Planner */}
        <RiskDrivenPlanner />

        {/* Rule 2 Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rule 2: Risk Sets the Rhythm
            </CardTitle>
            <CardDescription>
              Dynamic scheduling based on consequence × likelihood risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Risk-Based Scheduling Principles:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span><strong>Consequence × Likelihood:</strong> Risk score drives maintenance frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-green-500 mt-0.5" />
                    <span><strong>Dynamic Adaptation:</strong> Schedules adjust to changing conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span><strong>Signal-Driven Response:</strong> Real-world signals trigger schedule changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span><strong>Critical Control Priority:</strong> High-consequence assets get immediate attention</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Risk Assessment Matrix:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Critical Risk (80-100)</p>
                      <p className="text-xs text-muted-foreground">Daily monitoring, immediate response</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">High Risk (60-79)</p>
                      <p className="text-xs text-muted-foreground">Weekly inspections, priority scheduling</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Medium Risk (40-59)</p>
                      <p className="text-xs text-muted-foreground">Monthly maintenance, standard schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Low Risk (0-39)</p>
                      <p className="text-xs text-muted-foreground">Quarterly checks, routine maintenance</p>
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
