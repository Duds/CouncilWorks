import { ProtectedRoute } from "@/components/auth/protected-route";
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard";

/**
 * Manager Dashboard Page
 * Operational metrics and team performance for managers
 */
export default function ManagerDashboardPage() {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ManagerDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}
