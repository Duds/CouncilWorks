"use client";

import { MobileWorkOrders } from "@/components/mobile/mobile-work-orders";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

/**
 * Mobile Work Orders Page
 * Work order management for mobile devices
 * Uses separate mobile layout without main app authentication
 */
export default function MobileWorkOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Field Tool Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/field-tool">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Field Tool
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/field-tool">
                <Home className="h-4 w-4 mr-2" />
                Field Tool
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Work Orders Content */}
      <div className="p-4">
        <MobileWorkOrders />
      </div>
    </div>
  );
}
