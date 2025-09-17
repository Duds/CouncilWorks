'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Route } from 'next';

interface ConditionalHeaderProps {
  children: React.ReactNode;
}

/**
 * Landing page header that only shows on public pages
 * @component ConditionalHeader
 * @example
 * ```tsx
 * <ConditionalHeader>
 *   <LandingPageContent />
 * </ConditionalHeader>
 * ```
 * @accessibility
 * - ARIA roles: banner, navigation
 * - Keyboard navigation: Tab through navigation links
 * - Screen reader: Announces navigation structure
 */
export default function ConditionalHeader({
  children,
}: ConditionalHeaderProps) {
  const pathname = usePathname();

  // Show header on landing pages and citizen pages
  const isPublicPage =
    pathname === '/' ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/features') ||
    pathname.startsWith('/citizen');

  if (!isPublicPage) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="p-4 border-b border-sidebar-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/images/logos/Aegrid.svg"
              alt="Aegrid Logo"
              width={40}
              height={24}
              className="h-6 w-auto"
            />
            <span>Aegrid</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-2">
              <Link href={'/auth/sign-in' as Route}>
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href={'/auth/register' as Route}>
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
