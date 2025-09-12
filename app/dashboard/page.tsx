"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
// import StatsCard from "@/components/dashboard/StatsCard";
import DashboardShell from "@/components/layout/DashboardShell";
import type { Route } from "next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Activity, 
  BarChart3, 
  MapPin, 
  Wrench, 
  Plus,
} from "lucide-react";
import { canAccessAdmin } from "@/lib/rbac";

export default function DashboardPage() {
  const { data: session } = useSession();
  // Note: Projects & Time Tracking removed per requirements

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p0">
          <DashboardShell>
      
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={("/dashboard/assets" as Route)}
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <MapPin className="h-6 w-6 text-primary mr-3" />
                <div>
                  <div className="font-medium">Asset Management</div>
                  <div className="text-sm text-muted-foreground">
                    Manage council assets
                  </div>
                </div>
              </Link>

              <Link
                href={("/dashboard/work-orders" as Route)}
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Wrench className="h-6 w-6 text-primary mr-3" />
                <div>
                  <div className="font-medium">Work Orders</div>
                  <div className="text-sm text-muted-foreground">
                    Create and track orders
                  </div>
                </div>
              </Link>

              <Link
                href={("/dashboard/reports" as Route)}
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <BarChart3 className="h-6 w-6 text-primary mr-3" />
                <div>
                  <div className="font-medium">Reports</div>
                  <div className="text-sm text-muted-foreground">
                    Generate reports
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Backlog + Risk */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Maintenance Schedule */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Maintenance Backlog</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Water Pump Station A</p>
                      <p className="text-xs text-muted-foreground">Overdue • Preventive Maintenance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Due: 15/03/2024</p>
                      <p className="text-xs text-muted-foreground">09:00</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Bridge Inspection - Main St</p>
                      <p className="text-xs text-muted-foreground">Due this week • RCM Assessment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Due: 18/03/2024</p>
                      <p className="text-xs text-muted-foreground">14:30</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Traffic Light System</p>
                      <p className="text-xs text-muted-foreground">Due next week • Critical Control Check</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Due: 20/03/2024</p>
                      <p className="text-xs text-muted-foreground">11:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-6">
              {/* Risk Assessment Overview with circular progress */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Risk Assessment Overview</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-32 h-32">
                      <path
                        className="text-muted-foreground stroke-current"
                        strokeWidth="3.8"
                        fill="none"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                        opacity="0.25"
                      />
                      <path
                        className="text-primary stroke-current"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDasharray="73, 100"
                      />
                      <text x="18" y="20.35" className="fill-current text-foreground" textAnchor="middle" fontSize="8">73%</text>
                    </svg>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Low Risk<span className="ml-auto text-muted-foreground">847 assets</span></div>
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Medium Risk<span className="ml-auto text-muted-foreground">312 assets</span></div>
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>High Risk<span className="ml-auto text-muted-foreground">88 assets</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Asset inspection completed</p>
                  <p className="text-xs text-muted-foreground">Bridge #123 - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New work order created</p>
                  <p className="text-xs text-muted-foreground">Road maintenance - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Inspection scheduled</p>
                  <p className="text-xs text-muted-foreground">Playground equipment - 6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Status (moved here under Risk when on smaller screens, still right column on lg)*/}
          <div className="bg-white rounded-lg p-6 lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Team Status</h2>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Alexandra Deff")}.webp`} />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alexandra Deff</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Edwin Adenike")}.webp`} />
                  <AvatarFallback>EA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Edwin Adenike</p>
                  <p className="text-xs text-blue-600">In Progress</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Isaac Oluwatemilorun")}.webp`} />
                  <AvatarFallback>IO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Isaac Oluwatemilorun</p>
                  <p className="text-xs text-orange-600">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Crew Utilisation */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Crew Utilisation</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This week</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded">
                <div className="h-2 bg-primary rounded w-[78%]"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>Scheduled: 220h</div>
                <div>Capacity: 280h</div>
                <div>Overtime: 12h</div>
              </div>
            </div>
          </div>

          {/* Spare Parts Risk */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Spare Parts Risk</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Bearing 6205-2RS</span>
                <span className="text-red-600 font-medium">Stock-out risk</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Oil Filter HF304</span>
                <span className="text-yellow-600 font-medium">Reorder soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Hydraulic Hose H12</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
            </div>
          </div>

          {/* Failure Modes Watchlist */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Failure Modes Watchlist</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Pump cavitation</span>
                <span className="text-muted-foreground">12 occurrences</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Corrosion under insulation</span>
                <span className="text-muted-foreground">7 occurrences</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Electrical short (panel)</span>
                <span className="text-muted-foreground">5 occurrences</span>
              </div>
            </div>
          </div>

          {/* GIS HotSpots */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">GIS HotSpots</h2>
            <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              Map preview (clusters)
            </div>
          </div>

          {/* Team Status */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Team Status</h2>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Alexandra Deff")}.webp`} />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alexandra Deff</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Edwin Adenike")}.webp`} />
                  <AvatarFallback>EA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Edwin Adenike</p>
                  <p className="text-xs text-blue-600">In Progress</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Isaac Oluwatemilorun")}.webp`} />
                  <AvatarFallback>IO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Isaac Oluwatemilorun</p>
                  <p className="text-xs text-orange-600">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* (Time Tracker intentionally removed) */}
        </div>
      </div>

      {/* Admin Panel Access */}
      {session?.user && canAccessAdmin(session.user.role) && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Administration</h2>
          <p className="text-muted-foreground mb-4">
            Access administrative functions and system management tools.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin"
              className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-primary mr-3" />
              <div>
                <div className="font-medium">Admin Dashboard</div>
                <div className="text-sm text-muted-foreground">
                  System overview
                </div>
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Users className="h-5 w-5 text-primary mr-3" />
              <div>
                <div className="font-medium">User Management</div>
                <div className="text-sm text-muted-foreground">
                  Manage users
                </div>
              </div>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Activity className="h-5 w-5 text-primary mr-3" />
              <div>
                <div className="font-medium">Audit Logs</div>
                <div className="text-sm text-muted-foreground">
                  System activity
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
          </DashboardShell>
        </main>
      </div>
    </div>
  );
}
