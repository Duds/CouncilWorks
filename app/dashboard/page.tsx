"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {session?.user?.name || session?.user?.email}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {session?.user?.role}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to CouncilWorks</h2>
              <p className="text-muted-foreground">
                You are successfully authenticated! This is your dashboard where you can manage
                council assets, view reports, and access all the features of the platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Asset Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage and track council assets with GIS integration.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Work Orders</h3>
                <p className="text-sm text-muted-foreground">
                  Create and track maintenance work orders.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Generate compliance and operational reports.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
