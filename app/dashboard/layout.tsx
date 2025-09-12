import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
// Legacy DashboardLayout removed; page comp provides its own shell

/**
 * Dashboard layout with authentication check
 * @component DashboardLayoutWrapper
 * @example
 * ```tsx
 * <DashboardLayoutWrapper>
 *   <DashboardPage />
 * </DashboardLayoutWrapper>
 * ```
 * @accessibility
 * - ARIA roles: main, navigation
 * - Keyboard navigation: Tab through sidebar and main content
 * - Screen reader: Announces current page and navigation state
 */
export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return <>{children}</>;
}
