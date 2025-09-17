"use client";

import AppLayout from "@/components/layout/app-layout";
import { RiskDashboard } from "@/components/rcm/risk-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Target,
  Activity
} from "lucide-react";

/**
 * Risk Analysis Page
 * Comprehensive risk assessment dashboard for all assets
 */
export default function RiskAnalysisPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Risk Analysis"
      description="Comprehensive risk assessment and prioritization for proactive asset management"
    >
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Critical Risk Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-muted-foreground">High Risk Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Assets Protected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">67%</p>
                  <p className="text-xs text-muted-foreground">Risk Reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Dashboard */}
        <RiskDashboard />

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              About Risk Analysis
            </CardTitle>
            <CardDescription>
              Understanding our risk assessment methodology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Risk Calculation Factors:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Asset Condition:</strong> Current physical state</li>
                  <li>• <strong>Age Factor:</strong> Expected vs. actual lifespan</li>
                  <li>• <strong>Maintenance History:</strong> Recent maintenance frequency</li>
                  <li>• <strong>Inspection Records:</strong> Last inspection date and findings</li>
                  <li>• <strong>Failure Modes:</strong> RCM template-based risk assessment</li>
                </ul>
                
                <h4 className="font-medium mb-2 mt-4">Risk Levels:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <span className="text-red-600 font-bold">Critical:</span> 80+ risk score</li>
                  <li>• <span className="text-orange-600 font-bold">High:</span> 60-79 risk score</li>
                  <li>• <span className="text-yellow-600 font-bold">Medium:</span> 40-59 risk score</li>
                  <li>• <span className="text-blue-600 font-bold">Low:</span> 20-39 risk score</li>
                  <li>• <span className="text-green-600 font-bold">Very Low:</span> 0-19 risk score</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Recommended Actions:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Critical & High Risk</p>
                      <p className="text-xs text-muted-foreground">
                        Immediate inspection and maintenance required
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Medium Risk</p>
                      <p className="text-xs text-muted-foreground">
                        Schedule maintenance within 60 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Low Risk</p>
                      <p className="text-xs text-muted-foreground">
                        Continue regular maintenance schedule
                      </p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2 mt-4">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Proactive maintenance planning</li>
                  <li>• Reduced unexpected failures</li>
                  <li>• Optimized resource allocation</li>
                  <li>• Improved asset reliability</li>
                  <li>• Cost-effective maintenance strategies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
