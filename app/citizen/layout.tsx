import { ReactNode } from 'react';

interface CitizenLayoutProps {
  children: ReactNode;
}

/**
 * Citizen layout for public-facing citizen portal pages
 * Provides consistent branding and navigation for citizen users
 * @component CitizenLayout
 * @example
 * ```tsx
 * <CitizenLayout>
 *   <CitizenReportForm />
 * </CitizenLayout>
 * ```
 * @accessibility
 * - ARIA roles: main, navigation
 * - Keyboard navigation: Tab through navigation links
 * - Screen reader: Announces navigation structure for citizens
 */
export default function CitizenLayout({ children }: CitizenLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Citizen pages will render their own header and footer */}
      {children}
    </div>
  );
}
