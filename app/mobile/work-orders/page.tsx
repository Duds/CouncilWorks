"use client";

import { MobileWorkOrders } from "@/components/mobile/mobile-work-orders";

/**
 * Mobile Work Orders Page
 * Work order management for mobile devices
 * Uses separate mobile layout without main app authentication
 */
export default function MobileWorkOrdersPage() {
  return (
    <div className="p-4">
      <MobileWorkOrders />
    </div>
  );
}
