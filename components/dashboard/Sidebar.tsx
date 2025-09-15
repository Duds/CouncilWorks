"use client";

import { Building2, BarChart3, Calendar, Settings, Users, MapPin, Wrench, AlertTriangle, FileText, LogOut, HelpCircle, Smartphone, Bell } from "lucide-react";
import { signOut } from "next-auth/react";
import ReleaseBadge from "@/components/release-badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Sidebar() {
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
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Aegrid</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Menu
            </div>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-6">
              General
            </div>
            {generalItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            
            <button 
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                "hover:bg-accent hover:text-accent-foreground w-full text-left"
              )}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <ReleaseBadge />
        </div>
      </div>
    </div>
  );
}
