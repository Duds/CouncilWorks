"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings,
  FileText,
  Activity
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: Activity,
  },
];

/**
 * Admin sidebar navigation component
 * @component AdminSidebar
 * @example
 * ```tsx
 * <AdminSidebar />
 * ```
 * @accessibility
 * - ARIA roles: navigation
 * - Keyboard navigation: Tab through menu items
 * - Screen reader: Announces current page
 */
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">
          CouncilWorks Administration
        </p>
      </div>
      
      <div className="px-3 pb-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href as any}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
