'use client';

import ReleaseBadge from '@/components/release-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/sidebar';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Cog,
  Eye,
  FileText,
  Globe,
  Layers,
  LogOut,
  MapPin,
  Play,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Upload,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import type { Route } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface AppSidebarProps {
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'off' | 'icon' | 'none';
}

interface SidebarItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles?: string[];
  badge?: string;
}

/**
 * App Sidebar Component following shadcn/ui standards
 * Provides navigation based on user roles and Aegrid Rules
 * @component AppSidebar
 * @example
 * ```tsx
 * <AppSidebar variant="sidebar" collapsible="icon" />
 * ```
 * @accessibility
 * - ARIA roles: navigation, menu
 * - Keyboard navigation: Tab through workflow groups and menu items
 * - Screen reader: Announces workflow groups and current selection
 */
export function AppSidebar({
  variant = 'sidebar',
  collapsible = 'icon',
}: AppSidebarProps) {
  const { data: session } = useSession();

  // State for collapsible groups
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({
    strategic: false,
    assetPlanning: false,
    operations: false,
    contractor: false,
    community: false,
    system: false,
  });

  // State for asset count
  const [assetCount, setAssetCount] = useState<number | null>(null);

  // Fetch asset count on component mount
  useEffect(() => {
    const fetchAssetCount = async () => {
      try {
        const response = await fetch('/api/assets/count');
        if (response.ok) {
          const data = await response.json();
          setAssetCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch asset count:', error);
      }
    };

    if (session?.user?.id) {
      fetchAssetCount();
    }
  }, [session?.user?.id]);

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/auth/sign-in',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if user has admin access
  const canAccessAdmin = (role?: string) => {
    return role === 'ADMIN';
  };

  // Check if user has executive access (EXEC and ADMIN only, not MANAGER)
  const canAccessExecutive = (role?: string) => {
    return role === 'ADMIN' || role === 'EXEC';
  };

  // Check if user has manager access
  const canAccessManager = (role?: string) => {
    return role === 'ADMIN' || role === 'MANAGER' || role === 'EXEC';
  };

  // Check if user has supervisor access
  const canAccessSupervisor = (role?: string) => {
    return role === 'ADMIN' || role === 'MANAGER' || role === 'SUPERVISOR';
  };

  // Strategic Overview Group - Executive personas only (not MANAGER)
  const strategicOverviewItems: SidebarItem[] = [
    {
      href: '/dashboard',
      icon: BarChart3,
      label: 'Strategic Dashboard',
      roles: ['ADMIN', 'EXEC'],
    },
    {
      href: '/manager',
      icon: Activity,
      label: 'Manager Dashboard',
      roles: ['ADMIN', 'MANAGER', 'EXEC'],
    },
    {
      href: '/margin-management',
      icon: Clock,
      label: 'Margin Management',
      roles: ['ADMIN', 'EXEC'],
    },
    {
      href: '/demo',
      icon: Play,
      label: 'Demo Showcase',
      roles: ['ADMIN', 'EXEC'],
    },
    {
      href: '/reports/asset-condition',
      icon: TrendingUp,
      label: 'Asset Performance',
      roles: ['ADMIN', 'EXEC'],
    },
    {
      href: '/risk-analysis',
      icon: AlertTriangle,
      label: 'Risk Overview',
      roles: ['ADMIN', 'EXEC'],
    },
    {
      href: '/reports/risk-compliance',
      icon: Shield,
      label: 'Compliance Status',
      roles: ['ADMIN', 'EXEC'],
    },
  ];

  // Asset Planning Group - Manager, Asset Planner personas
  const assetPlanningItems: SidebarItem[] = [
    {
      href: '/assets',
      icon: Building2,
      label: 'Asset Register',
      badge: assetCount !== null ? assetCount.toLocaleString() : undefined,
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
    {
      href: '/critical-controls',
      icon: Target,
      label: 'Critical Controls',
      roles: ['ADMIN', 'MANAGER', 'EXEC'],
    },
    {
      href: '/risk-planner',
      icon: Activity,
      label: 'Risk Planner',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
    {
      href: '/rcm-templates',
      icon: Wrench,
      label: 'RCM Templates',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
    {
      href: '/maintenance',
      icon: Calendar,
      label: 'Maintenance Planning',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
    {
      href: '/reports/builder',
      icon: FileText,
      label: 'Custom Reports',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
    {
      href: '/imports',
      icon: Upload,
      label: 'Data Import',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
  ];

  // Operations Management Group - Supervisor, Crew, Contractor personas
  const operationsManagementItems: SidebarItem[] = [
    {
      href: '/assets/map',
      icon: MapPin,
      label: 'Asset Map',
      roles: [
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
        'CREW',
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
      ],
    },
    {
      href: '/field-tool',
      icon: Wrench,
      label: 'Field Operations',
      roles: [
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
        'CREW',
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
      ],
    },
    {
      href: '/mobile/dashboard',
      icon: Activity,
      label: 'Mobile Dashboard',
      roles: [
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
        'CREW',
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
      ],
    },
    {
      href: '/mobile/inspections',
      icon: CheckCircle,
      label: 'Inspections',
      roles: [
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
        'CREW',
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
      ],
    },
    {
      href: '/mobile/work-orders',
      icon: ClipboardList,
      label: 'Work Orders',
      roles: [
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
        'CREW',
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
      ],
    },
    {
      href: '/sessions',
      icon: Clock,
      label: 'Work Sessions',
      roles: [
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
        'CREW',
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
      ],
    },
  ];

  // Contractor/Partner Portal Group - Contractor, Partner personas
  const contractorPartnerItems: SidebarItem[] = [
    {
      href: '/contractor/dashboard',
      icon: BarChart3,
      label: 'Contract Dashboard',
      roles: ['CONTRACTOR', 'PARTNER', 'ADMIN', 'MANAGER'],
    },
    {
      href: '/contractor/work-orders',
      icon: ClipboardList,
      label: 'My Work Orders',
      roles: [
        'CONTRACTOR',
        'MAINTENANCE_PLANNER',
        'ADMIN',
        'MANAGER',
        'SUPERVISOR',
      ],
    },
    {
      href: '/contractor/performance',
      icon: TrendingUp,
      label: 'Performance Metrics',
      roles: ['CONTRACTOR', 'PARTNER', 'ADMIN', 'MANAGER'],
    },
    {
      href: '/contractor/capacity',
      icon: Clock,
      label: 'Capacity Management',
      roles: ['CONTRACTOR', 'PARTNER', 'ADMIN', 'MANAGER'],
    },
    {
      href: '/partner/data-sharing',
      icon: Globe,
      label: 'Data Sharing',
      roles: ['PARTNER', 'ADMIN', 'MANAGER'],
    },
  ];

  // Community Engagement Group - Citizen, Supervisor, Admin personas
  const communityEngagementItems: SidebarItem[] = [
    {
      href: '/citizen',
      icon: Globe,
      label: 'Community Portal',
      roles: ['CITIZEN', 'ADMIN'],
    },
    {
      href: '/citizen/track',
      icon: Eye,
      label: 'Track Requests',
      roles: ['CITIZEN', 'ADMIN'],
    },
    {
      href: '/activity',
      icon: Activity,
      label: 'Activity Logs',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
    {
      href: '/admin/triage',
      icon: AlertCircle,
      label: 'Report Triage',
      roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
    },
  ];

  // System Administration Group - Admin persona
  const systemAdministrationItems: SidebarItem[] = [
    {
      href: '/admin',
      icon: BarChart3,
      label: 'Admin Dashboard',
      roles: ['ADMIN'],
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'User Management',
      roles: ['ADMIN'],
    },
    {
      href: '/admin/audit-logs',
      icon: Activity,
      label: 'Audit Logs',
      roles: ['ADMIN'],
    },
    {
      href: '/security',
      icon: Shield,
      label: 'Security Dashboard',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      href: '/admin/notifications',
      icon: Bell,
      label: 'Notifications',
      roles: ['ADMIN'],
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'System Settings',
      roles: ['ADMIN'],
    },
  ];

  // Filter items based on user role
  const filterItemsByRole = (items: SidebarItem[], userRole?: string) => {
    return items.filter(
      item => !item.roles || item.roles.includes(userRole || '')
    );
  };

  const userRole = session?.user?.role;

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Sidebar Debug:', {
      session: !!session,
      userRole,
      userEmail: session?.user?.email,
      canAccessAdmin: canAccessAdmin(userRole),
      canAccessExecutive: canAccessExecutive(userRole),
      canAccessManager: canAccessManager(userRole),
      canAccessSupervisor: canAccessSupervisor(userRole),
    });
  }

  return (
    <Sidebar variant={variant} collapsible={collapsible} className="!border-0">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold px-2"
        >
          <Image
            src="/images/logos/Aegrid.svg"
            alt="Aegrid Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl group-data-[collapsible=icon]:hidden">
            Aegrid
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Strategic Overview Group */}
        {canAccessExecutive(userRole) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel
                className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1"
                onClick={() => toggleGroup('strategic')}
              >
                <Target className="h-4 w-4" />
                Strategic Overview
                {collapsedGroups.strategic ? (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </SidebarGroupLabel>
              {!collapsedGroups.strategic && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filterItemsByRole(strategicOverviewItems, userRole).map(
                      item => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href as Route}
                              className="flex items-center justify-between w-full min-w-0"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <item.icon className="h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium">
                                    {item.label}
                                  </div>
                                </div>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs shrink-0"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Asset Planning Group */}
        {canAccessSupervisor(userRole) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel
                className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1"
                onClick={() => toggleGroup('assetPlanning')}
              >
                <Layers className="h-4 w-4" />
                Asset Planning
                {collapsedGroups.assetPlanning ? (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </SidebarGroupLabel>
              {!collapsedGroups.assetPlanning && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filterItemsByRole(assetPlanningItems, userRole).map(
                      item => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href as Route}
                              className="flex items-center justify-between w-full min-w-0"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <item.icon className="h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium">
                                    {item.label}
                                  </div>
                                </div>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs shrink-0"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Operations Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1"
            onClick={() => toggleGroup('operations')}
          >
            <Zap className="h-4 w-4" />
            Operations Management
            {collapsedGroups.operations ? (
              <ChevronRight className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-auto" />
            )}
          </SidebarGroupLabel>
          {!collapsedGroups.operations && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItemsByRole(operationsManagementItems, userRole).map(
                  item => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href as Route}
                          className="flex items-center justify-between w-full min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">
                                {item.label}
                              </div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-2 text-xs shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        <SidebarSeparator />

        {/* Contractor/Partner Portal Group */}
        {(userRole === 'CONTRACTOR' ||
          userRole === 'PARTNER' ||
          userRole === 'MAINTENANCE_PLANNER' ||
          canAccessManager(userRole)) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel
                className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1"
                onClick={() => toggleGroup('contractor')}
              >
                <Building2 className="h-4 w-4" />
                Contractor/Partner Portal
                {collapsedGroups.contractor ? (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </SidebarGroupLabel>
              {!collapsedGroups.contractor && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filterItemsByRole(contractorPartnerItems, userRole).map(
                      item => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href as Route}
                              className="flex items-center justify-between w-full min-w-0"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <item.icon className="h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium">
                                    {item.label}
                                  </div>
                                </div>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs shrink-0"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Community Engagement Group */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1"
            onClick={() => toggleGroup('community')}
          >
            <Globe className="h-4 w-4" />
            Community Engagement
            {collapsedGroups.community ? (
              <ChevronRight className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-auto" />
            )}
          </SidebarGroupLabel>
          {!collapsedGroups.community && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItemsByRole(communityEngagementItems, userRole).map(
                  item => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href as Route}
                          className="flex items-center justify-between w-full min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">
                                {item.label}
                              </div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-2 text-xs shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        <SidebarSeparator />

        {/* System Administration Group */}
        {canAccessAdmin(userRole) && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel
                className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1"
                onClick={() => toggleGroup('system')}
              >
                <Cog className="h-4 w-4" />
                System Administration
                {collapsedGroups.system ? (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </SidebarGroupLabel>
              {!collapsedGroups.system && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filterItemsByRole(systemAdministrationItems, userRole).map(
                      item => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href as Route}
                              className="flex items-center justify-between w-full min-w-0"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <item.icon className="h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium">
                                    {item.label}
                                  </div>
                                </div>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs shrink-0"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 group-data-[collapsible=icon]:hidden">
          <ReleaseBadge />
        </div>
        <div className="p-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session?.user?.image || ''}
                alt={session?.user?.name || 'User'}
              />
              <AvatarFallback className="text-xs">
                {session?.user?.name ? getInitials(session.user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="text-sm font-medium truncate">
                {session?.user?.name || 'User'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {session?.user?.role || 'Unknown'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-1 rounded-md hover:bg-sidebar-accent"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
