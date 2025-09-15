"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Status:</strong> {status}
              </div>
              <div>
                <strong>Session:</strong>
                <pre className="mt-2 p-4 bg-muted rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              <div>
                <strong>User ID:</strong> {session?.user?.id || "Not available"}
              </div>
              <div>
                <strong>User Email:</strong> {session?.user?.email || "Not available"}
              </div>
              <div>
                <strong>User Name:</strong> {session?.user?.name || "Not available"}
              </div>
              <div>
                <strong>Organisation ID:</strong> {session?.user?.organisationId || "Not available"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
