"use client";

import { ProtectedRoute } from '@/components/auth/protected-route';
import AppSidebar from '@/components/dashboard/AppSidebar';
import Header from '@/components/dashboard/Header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  title?: string;
  description?: string;
}

/**
 * Shared app layout for authenticated pages following shadcn/ui standards
 * Provides sidebar navigation and header for all app pages using SidebarProvider
 * @component AppLayout
 * @example
 * ```tsx
 * <AppLayout requiredRoles={['ADMIN', 'MANAGER']} title="Settings" description="Manage your account settings">
 *   <SettingsPage />
 * </AppLayout>
 * ```
 * @accessibility
 * - ARIA roles: main, navigation
 * - Keyboard navigation: Tab through sidebar and main content
 * - Screen reader: Announces current page and navigation state
 */
export default function AppLayout({ children, requiredRoles, title, description }: AppLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Header title={title} description={description} />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
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
