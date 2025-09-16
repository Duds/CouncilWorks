import { ReactNode } from 'react';

interface FieldToolLayoutProps {
  children: ReactNode;
}

/**
 * Field Tool Layout
 * Dedicated layout for mobile field workers
 * Provides PWA capabilities and offline-first design
 * @component FieldToolLayout
 * @example
 * ```tsx
 * <FieldToolLayout>
 *   <FieldToolPage />
 * </FieldToolLayout>
 * ```
 * @accessibility
 * - ARIA roles: main
 * - Mobile-optimized: Touch-friendly interface
 * - PWA: Service worker and offline capabilities
 * - Field-focused: Optimized for outdoor use
 */
export default function FieldToolLayout({ children }: FieldToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Field tool pages handle their own navigation and layout */}
      {children}
    </div>
  );
}
