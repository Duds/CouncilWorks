/**
 * DashboardShell component
 * Ensures the shell stretches to the bottom of the viewport, even with minimal content.
 * Uses Australian English conventions and accessibility best practices.
 *
 * @component DashboardShell
 * @example
 * ```tsx
 * <DashboardShell>
 *   <YourContent />
 * </DashboardShell>
 * ```
 * @accessibility
 * - ARIA roles: none (container only)
 * - Keyboard navigation: not applicable
 */

import type { PropsWithChildren } from "react";

export default function DashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col p-0 pl-4 pt-4 pb-4">
      <div className="flex-1 flex flex-col bg-surface rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}
