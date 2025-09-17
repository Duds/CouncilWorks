"use client";

import AppLayout from "@/components/layout/app-layout";
import { RCMTemplateManager } from "@/components/rcm/rcm-template-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users
} from "lucide-react";

/**
 * RCM Templates Page
 * Manages Reliability Centered Maintenance templates
 */
export default function RCMTemplatesPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="RCM Templates"
      description="Manage Reliability Centered Maintenance templates for proactive asset management"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Active Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Failure Modes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-xs text-muted-foreground">Maintenance Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Assets Using Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RCM Template Manager */}
        <RCMTemplateManager />

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              About RCM Templates
            </CardTitle>
            <CardDescription>
              Understanding Reliability Centered Maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">What is RCM?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Reliability Centered Maintenance (RCM) is a systematic approach to maintenance 
                  that focuses on identifying potential failure modes and their effects on asset 
                  performance. It helps organizations optimize maintenance strategies and reduce costs.
                </p>
                
                <h4 className="font-medium mb-2">Key Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Reduced maintenance costs</li>
                  <li>• Improved asset reliability</li>
                  <li>• Better resource allocation</li>
                  <li>• Proactive maintenance planning</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Template Components:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Failure Modes</p>
                      <p className="text-xs text-muted-foreground">
                        Identify how assets can fail and their consequences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Maintenance Tasks</p>
                      <p className="text-xs text-muted-foreground">
                        Define preventive actions to avoid failures
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Scheduling</p>
                      <p className="text-xs text-muted-foreground">
                        Automate maintenance scheduling based on risk
                      </p>
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
