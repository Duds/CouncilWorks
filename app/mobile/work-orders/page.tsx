"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MobileWorkOrders } from "@/components/mobile/mobile-work-orders";

/**
 * Mobile Work Orders Page
 * Work order management for mobile devices
 */
export default function MobileWorkOrdersPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <MobileWorkOrders />
        </div>
      </div>
    </ProtectedRoute>
  );
}
