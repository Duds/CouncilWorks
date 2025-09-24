'use client';

import Link from 'next/link';
import type { Route } from 'next';

/**
 * Landing page footer component
 * @component LandingFooter
 * @example
 * ```tsx
 * <LandingFooter />
 * ```
 * @accessibility
 * - ARIA roles: contentinfo
 * - Keyboard navigation: Tab through footer links
 * - Screen reader: Announces footer content and links
 */
export default function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Aegrid: Intelligent Asset Management for Visionary Councils
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Partner with us to transform your asset management approach
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aegrid. All rights reserved.
            </div>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href={'/docs' as Route}>Docs</Link>
              <Link href={'/docs/aegrid-rules' as Route}>The Aegrid Rules</Link>
              <Link href={'/docs/releases/changelog' as Route}>Changelog</Link>
              <a
                href="https://www.linkedin.com/company/aegrid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a href="mailto:support@aegrid.au">Support</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
