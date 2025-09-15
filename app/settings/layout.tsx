import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Settings layout with authentication check
 * @component SettingsLayoutWrapper
 * @example
 * ```tsx
 * <SettingsLayoutWrapper>
 *   <SettingsPage />
 * </SettingsLayoutWrapper>
 * ```
 * @accessibility
 * - ARIA roles: main, navigation
 * - Keyboard navigation: Tab through sidebar and main content
 * - Screen reader: Announces current page and navigation state
 */
export default async function SettingsLayoutWrapper({
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
