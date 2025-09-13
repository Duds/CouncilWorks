"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Route } from "next";

interface ConditionalHeaderProps {
  children: React.ReactNode;
}

/**
 * Conditional header that only shows on non-dashboard pages
 * @component ConditionalHeader
 * @example
 * ```tsx
 * <ConditionalHeader>
 *   <PageContent />
 * </ConditionalHeader>
 * ```
 * @accessibility
 * - ARIA roles: banner, navigation
 * - Keyboard navigation: Tab through navigation links
 * - Screen reader: Announces navigation structure
 */
export default function ConditionalHeader({ children }: ConditionalHeaderProps) {
  const pathname = usePathname();
  
  // Don't show header on dashboard pages or auth pages
  const hideHeader = pathname.startsWith('/dashboard') || 
                    pathname.startsWith('/admin') || 
                    pathname.startsWith('/auth');

  if (hideHeader) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="p-4 border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-semibold">Aegrid</Link>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-2">
              <Link href={"/auth/sign-in" as Route}>
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href={"/auth/register" as Route}>
                <Button>Register</Button>
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
