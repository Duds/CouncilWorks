import { ProtectedRoute } from "@/components/auth/protected-route";
import { ExecutiveDashboard } from "@/components/dashboards/executive-dashboard";

/**
 * Executive Dashboard Page
 * High-level KPIs and metrics for executive leadership
 */
export default function ExecutiveDashboardPage() {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'EXEC']}>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Executive Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ExecutiveDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}
