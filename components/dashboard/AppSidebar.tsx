"use client";

import { Building2, BarChart3, Calendar, Settings, Users, MapPin, Wrench, AlertTriangle, LogOut, HelpCircle, Smartphone, Bell } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ReleaseBadge from "@/components/release-badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
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

  const navigationItems = [
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/assets", icon: Building2, label: "Assets", badge: "1,247" },
    { href: "/rcm-templates", icon: Wrench, label: "RCM Templates" },
    { href: "/maintenance", icon: Calendar, label: "Maintenance" },
    { href: "/assets/map", icon: MapPin, label: "Asset Map" },
    { href: "/risk-analysis", icon: AlertTriangle, label: "Risk Analysis" },
    { href: "/mobile/dashboard", icon: Smartphone, label: "Mobile App" },
    { href: "/reports/risk-compliance", icon: AlertTriangle, label: "Risk & Compliance" },
    { href: "/reports/asset-condition", icon: BarChart3, label: "Asset Trending" },
    { href: "/reports/builder", icon: Settings, label: "Custom Reports" },
    { href: "/admin/triage", icon: AlertTriangle, label: "Report Triage" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    { href: "#", icon: Users, label: "Team" },
  ];

  const generalItems = [
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "#", icon: HelpCircle, label: "Help" },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold px-2">
          <span className="text-xl">Aegrid</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <SidebarMenuBadge>
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
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
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
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
        <div className="p-2">
          <ReleaseBadge />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
