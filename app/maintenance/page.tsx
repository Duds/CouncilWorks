"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MaintenanceCalendar } from "@/components/maintenance/maintenance-calendar";
import { AutoWorkOrderGenerator } from "@/components/maintenance/auto-work-order-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Wrench
} from "lucide-react";

/**
 * Maintenance Scheduling Page
 * Comprehensive maintenance scheduling and calendar management
 */
export default function MaintenancePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Maintenance Scheduling</h1>
          <p className="text-muted-foreground">
            Plan, schedule, and manage maintenance activities across all assets
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Scheduled This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Completed This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">$12.4K</p>
                  <p className="text-xs text-muted-foreground">This Month's Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auto Work Order Generator */}
        <AutoWorkOrderGenerator />

        {/* Maintenance Calendar */}
        <MaintenanceCalendar />

        {/* Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              About Maintenance Scheduling
            </CardTitle>
            <CardDescription>
              Understanding our automated maintenance planning system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Automated Scheduling Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>RCM-Based Planning:</strong> Uses failure mode analysis for optimal scheduling</li>
                  <li>• <strong>Risk-Based Prioritization:</strong> Higher risk assets get priority scheduling</li>
                  <li>• <strong>Frequency Management:</strong> Automatic scheduling based on task frequency</li>
                  <li>• <strong>Resource Optimization:</strong> Balances workload across maintenance teams</li>
                  <li>• <strong>Cost Estimation:</strong> Provides accurate cost projections for budgeting</li>
                </ul>
                
                <h4 className="font-medium mb-2 mt-4">Scheduling Views:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Monthly View:</strong> Overview of all maintenance activities</li>
                  <li>• <strong>Weekly View:</strong> Detailed week-by-week planning</li>
                  <li>• <strong>Daily View:</strong> Day-specific task management</li>
                  <li>• <strong>Filter Options:</strong> Status, priority, and asset type filters</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Work Order Integration:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Automated Generation</p>
                      <p className="text-xs text-muted-foreground">
                        Work orders created automatically from RCM templates
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Risk-Based Scheduling</p>
                      <p className="text-xs text-muted-foreground">
                        High-risk assets get immediate attention
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Team Assignment</p>
                      <p className="text-xs text-muted-foreground">
                        Automatic assignment based on skills and availability
                      </p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2 mt-4">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Reduced unplanned downtime</li>
                  <li>• Optimized resource utilization</li>
                  <li>• Improved asset reliability</li>
                  <li>• Better cost control and budgeting</li>
                  <li>• Compliance with maintenance standards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
