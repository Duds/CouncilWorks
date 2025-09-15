import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/rbac";
import AppLayout from "@/components/layout/app-layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout with role-based access control using unified AppLayout
 * @component AdminLayout
 * @example
 * ```tsx
 * <AdminLayout>
 *   <AdminDashboard />
 * </AdminLayout>
 * ```
 * @accessibility
 * - ARIA roles: navigation, main
 * - Keyboard navigation: Tab through sidebar and main content
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect("/unauthorized");
  }

  return (
    <AppLayout requiredRoles={['ADMIN', 'MANAGER']}>
      {children}
    </AppLayout>
  );
}
