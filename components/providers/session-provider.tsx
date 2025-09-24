'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Only wrap authenticated pages with SessionProvider to avoid NextAuth errors on public pages
  const isPublicPage =
    pathname === '/' ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/features') ||
    pathname.startsWith('/citizen') ||
    pathname.startsWith('/docs') ||
    pathname === '/docs/releases/changelog';

  // For public pages, return children without SessionProvider
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window regains focus
    >
      {children}
    </SessionProvider>
  );
}
