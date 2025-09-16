"use client";

import { 
  Building2, BarChart3, Calendar, Settings, Users, MapPin, Wrench, 
  AlertTriangle, LogOut, HelpCircle, Bell, Shield, Activity, 
  Target, TrendingUp, ClipboardList, Globe, Cog, Eye, 
  FileText, Download, Upload, Clock, CheckCircle, AlertCircle,
  PieChart, LineChart, Layers, Zap, Heart, Leaf, Star
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ReleaseBadge from "@/components/release-badge";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

/**
 * Journey-centric sidebar navigation implementing The Aegrid Rules
 * Organises navigation around user workflows and asset purposes rather than features
 * @component JourneySidebar
 * @example
 * ```tsx
 * <JourneySidebar />
 * ```
 * @accessibility
 * - ARIA roles: navigation, menu
 * - Keyboard navigation: Tab through workflow groups and menu items
 * - Screen reader: Announces workflow groups and current selection
 */
export default function JourneySidebar() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/auth/sign-in",
        redirect: true 
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for fallback avatar
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if user has admin access
  const canAccessAdmin = (role?: string) => {
    return role === 'ADMIN' || role === 'MANAGER';
  };

  // Check if user has manager access
  const canAccessManager = (role?: string) => {
    return role === 'ADMIN' || role === 'MANAGER' || role === 'EXEC';
  };

  // Check if user has supervisor access
  const canAccessSupervisor = (role?: string) => {
    return role === 'ADMIN' || role === 'MANAGER' || role === 'SUPERVISOR';
  };

  // Strategic Overview Group - Executive, Manager personas
  // Rule 1: Purpose-driven navigation groups
  // Rule 3: Critical asset focus in operations group
  const strategicOverviewItems = [
    { 
      href: "/dashboard", 
      icon: BarChart3, 
      label: "Strategic Dashboard", 
      description: "Asset value delivery overview",
      roles: ['ADMIN', 'MANAGER', 'EXEC']
    },
    { 
      href: "/reports/asset-condition", 
      icon: TrendingUp, 
      label: "Asset Performance", 
      description: "Value delivery trends",
      roles: ['ADMIN', 'MANAGER', 'EXEC']
    },
    { 
      href: "/risk-analysis", 
      icon: AlertTriangle, 
      label: "Risk Overview", 
      description: "Critical asset protection",
      roles: ['ADMIN', 'MANAGER', 'EXEC']
    },
    { 
      href: "/reports/risk-compliance", 
      icon: Shield, 
      label: "Compliance Status", 
      description: "Regulatory adherence",
      roles: ['ADMIN', 'MANAGER', 'EXEC']
    },
  ];

  // Asset Planning Group - Manager, Asset Planner personas
  // Rule 1: Function-based asset organisation
  // Rule 2: Risk-based grouping and RCM-lite support
  // Rule 4: Future-proof planning capabilities
  const assetPlanningItems = [
    { 
      href: "/assets", 
      icon: Building2, 
      label: "Asset Register", 
      description: "Function-based organisation",
      badge: "1,247",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR']
    },
    { 
      href: "/rcm-templates", 
      icon: Wrench, 
      label: "RCM Templates", 
      description: "Risk-based maintenance",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR']
    },
    { 
      href: "/maintenance", 
      icon: Calendar, 
      label: "Maintenance Planning", 
      description: "RCM-lite scheduling",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR']
    },
    { 
      href: "/reports/builder", 
      icon: FileText, 
      label: "Custom Reports", 
      description: "Planning insights",
      roles: ['ADMIN', 'MANAGER']
    },
    { 
      href: "/imports", 
      icon: Upload, 
      label: "Data Import", 
      description: "Asset data management",
      roles: ['ADMIN', 'MANAGER']
    },
  ];

  // Operations Management Group - Supervisor, Crew personas
  // Rule 2: Risk-based workflow prioritisation
  // Rule 3: Critical asset focus in operations group
  const operationsManagementItems = [
    { 
      href: "/assets/map", 
      icon: MapPin, 
      label: "Asset Map", 
      description: "Geographic operations view",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW']
    },
    { 
      href: "/field-tool", 
      icon: ClipboardList, 
      label: "Field Operations", 
      description: "Mobile inspections",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW']
    },
    { 
      href: "/mobile/dashboard", 
      icon: Zap, 
      label: "Mobile Dashboard", 
      description: "Field team overview",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW']
    },
    { 
      href: "/mobile/inspections", 
      icon: CheckCircle, 
      label: "Inspections", 
      description: "Asset condition checks",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW']
    },
    { 
      href: "/mobile/work-orders", 
      icon: Wrench, 
      label: "Work Orders", 
      description: "Maintenance tasks",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW']
    },
    { 
      href: "/sessions", 
      icon: Clock, 
      label: "Work Sessions", 
      description: "Team coordination",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR']
    },
  ];

  // Community Engagement Group - Citizen, Supervisor personas
  // Rule 1: Service delivery workflow
  const communityEngagementItems = [
    { 
      href: "/citizen", 
      icon: Globe, 
      label: "Community Portal", 
      description: "Service request intake",
      roles: ['CITIZEN']
    },
    { 
      href: "/citizen/track", 
      icon: Eye, 
      label: "Track Requests", 
      description: "Request status monitoring",
      roles: ['CITIZEN']
    },
    { 
      href: "/activity", 
      icon: Activity, 
      label: "Activity Logs", 
      description: "Community engagement tracking",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR']
    },
    { 
      href: "/admin/triage", 
      icon: AlertCircle, 
      label: "Report Triage", 
      description: "Community issue management",
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR']
    },
  ];

  // System Administration Group - Admin persona
  // Rule 4: Future-oriented workflow for long-term sustainability
  const systemAdministrationItems = [
    { 
      href: "/admin", 
      icon: BarChart3, 
      label: "Admin Dashboard", 
      description: "System overview",
      roles: ['ADMIN']
    },
    { 
      href: "/admin/users", 
      icon: Users, 
      label: "User Management", 
      description: "Access control",
      roles: ['ADMIN']
    },
    { 
      href: "/admin/audit-logs", 
      icon: Activity, 
      label: "Audit Logs", 
      description: "System monitoring",
      roles: ['ADMIN']
    },
    { 
      href: "/admin/notifications", 
      icon: Bell, 
      label: "Notifications", 
      description: "System alerts",
      roles: ['ADMIN']
    },
    { 
      href: "/settings", 
      icon: Settings, 
      label: "System Settings", 
      description: "Platform configuration",
      roles: ['ADMIN']
    },
  ];

  // Filter items based on user role
  const filterItemsByRole = (items: any[], userRole?: string) => {
    return items.filter(item => 
      !item.roles || item.roles.includes(userRole || '')
    );
  };

  const userRole = session?.user?.role;

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold px-2">
          <Image 
            src="/images/logos/Aegrid.svg" 
            alt="Aegrid Logo" 
            width={32} 
            height={20}
            className="h-5 w-auto"
          />
          <span className="text-xl">Aegrid</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Strategic Overview Group */}
        {canAccessManager(userRole) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Strategic Overview
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterItemsByRole(strategicOverviewItems, userRole).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href as Route} className="flex items-center justify-between w-full min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Asset Planning Group */}
        {canAccessSupervisor(userRole) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Asset Planning
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterItemsByRole(assetPlanningItems, userRole).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href as Route} className="flex items-center justify-between w-full min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Operations Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Operations Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterItemsByRole(operationsManagementItems, userRole).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href as Route} className="flex items-center justify-between w-full min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        {/* Community Engagement Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Community Engagement
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterItemsByRole(communityEngagementItems, userRole).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href as Route} className="flex items-center justify-between w-full min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        {/* System Administration Group */}
        {canAccessAdmin(userRole) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                System Administration
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterItemsByRole(systemAdministrationItems, userRole).map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href as Route} className="flex items-center justify-between w-full min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs shrink-0">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* General Items */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <ReleaseBadge />
        </div>
        <div className="flex items-center gap-3 p-2 min-w-0">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage 
              src={session?.user?.image || undefined} 
              alt={session?.user?.name || "User avatar"}
            />
            <AvatarFallback>
              {getUserInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {session?.user?.name || "User"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {session?.user?.email || "user@example.com"}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
