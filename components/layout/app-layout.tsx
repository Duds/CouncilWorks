'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  title?: string;
  description?: string;
}

/**
 * Shared app layout for authenticated pages following shadcn/ui dashboard pattern
 * Provides sidebar navigation and header for all app pages using SidebarProvider
 * Header and content form one cohesive card with light grey background around edges
 * @component AppLayout
 * @example
 * ```tsx
 * <AppLayout requiredRoles={['ADMIN', 'MANAGER']} title="Settings">
 *   <SettingsPage />
 * </AppLayout>
 * ```
 * @accessibility
 * - ARIA roles: main, navigation
 * - Keyboard navigation: Tab through sidebar and main content
 * - Screen reader: Announces current page and navigation state
 */
export default function AppLayout({
  children,
  requiredRoles,
  title,
  description: _description,
}: AppLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <SidebarProvider
        className="flex min-h-screen w-full"
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '3rem',
            '--header-height': '4rem',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset className="flex-1 min-w-0 bg-sidebar">
            <div className="bg-white rounded-lg shadow-md m-2 border-0">
            <SiteHeader title={title} />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
