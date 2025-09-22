'use client';

import { ReactNode } from 'react';
import LandingFooter from './landing-footer';

interface DocsLayoutProps {
  children: ReactNode;
}

/**
 * Consistent layout wrapper for all documentation pages
 * Provides header (via ConditionalHeader) and footer for documentation
 * @component DocsLayout
 * @example
 * ```tsx
 * <DocsLayout>
 *   <DocumentationContent />
 * </DocsLayout>
 * ```
 * @accessibility
 * - ARIA roles: main
 * - Keyboard navigation: Tab through content and footer links
 * - Screen reader: Announces page structure and navigation
 */
export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
