import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

/**
 * Mobile layout for field worker PWA
 * Provides mobile-optimized layout without main app sidebar/header
 * @component MobileLayout
 * @example
 * ```tsx
 * <MobileLayout>
 *   <MobileDashboard />
 * </MobileLayout>
 * ```
 * @accessibility
 * - ARIA roles: main
 * - Mobile-optimized: Touch-friendly interface
 * - PWA: Service worker and offline capabilities
 */
export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile pages handle their own navigation and layout */}
      {children}
    </div>
  );
}
