"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Mobile Dashboard Page
 * Redirects to the dedicated field tool
 * Field workers should use the field tool instead of the main dashboard
 */
export default function MobileDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to field tool
    router.replace('/field-tool');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to Field Tool...</p>
      </div>
    </div>
  );
}
