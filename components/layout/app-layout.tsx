"use client";

import { ProtectedRoute } from '@/components/auth/protected-route';
import JourneySidebar from '@/components/dashboard/JourneySidebar';
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
        defaultOpen={true}
        style={
          {
            "--sidebar-width": "18rem",
            "--sidebar-width-icon": "3rem",
          } as React.CSSProperties
        }
      >
        <JourneySidebar variant="sidebar" collapsible="icon" />
        <SidebarInset>
          <Header title={title} description={description} />
          <main className="flex-1 p-6">
            <div className="w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
