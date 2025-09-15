"use client";

import { ProtectedRoute } from '@/components/auth/protected-route';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/**
 * Shared app layout for authenticated pages following shadcn/ui standards
 * Provides sidebar navigation and header for all app pages
 * @component AppLayout
 * @example
 * ```tsx
 * <AppLayout requiredRoles={['ADMIN', 'MANAGER']}>
 *   <SettingsPage />
 * </AppLayout>
 * ```
 * @accessibility
 * - ARIA roles: main, navigation
 * - Keyboard navigation: Tab through sidebar and main content
 * - Screen reader: Announces current page and navigation state
 */
export default function AppLayout({ children, requiredRoles }: AppLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
