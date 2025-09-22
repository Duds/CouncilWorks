"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, CheckCircle, XCircle, Info } from "lucide-react";

export default function DebugSessionPage() {
  const { data: session, status, update } = useSession();
  const [debugData, setDebugData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebugData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/session');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch debug data');
      }
      
      setDebugData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/refresh-session', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh session');
      }
      
      // Update the session
      await update();
      
      // Fetch fresh debug data
      await fetchDebugData();
      
      alert(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Session Found</CardTitle>
            <CardDescription>
              You need to be signed in to debug your session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/auth/sign-in'} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Session Debug Tool</h1>
          <p className="text-muted-foreground mt-2">
            Debug your authentication session and onboarding status
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Current Session
              </CardTitle>
              <CardDescription>
                Your current NextAuth session data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="text-sm text-muted-foreground">{session.user?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-sm text-muted-foreground">{session.user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span className="text-sm text-muted-foreground">{session.user?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Role:</span>
                  <span className="text-sm text-muted-foreground">{session.user?.role || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Organisation ID:</span>
                  <span className="text-sm text-muted-foreground">{session.user?.organisationId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Organisation Name:</span>
                  <span className="text-sm text-muted-foreground">{session.user?.organisation?.name || 'N/A'}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  {session.user?.organisationId ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">
                    {session.user?.organisationId ? 'Has Organisation' : 'No Organisation'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {session.user?.organisationId 
                    ? 'You should be able to access the dashboard' 
                    : 'You will be redirected to onboarding'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Debug Actions
              </CardTitle>
              <CardDescription>
                Tools to diagnose and fix session issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={fetchDebugData} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Fetch Debug Data'}
              </Button>
              
              <Button 
                onClick={refreshSession} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Refreshing...' : 'Refresh Session'}
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/dashboard'} 
                variant="secondary"
                className="w-full"
              >
                Try Dashboard Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {debugData && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Data</CardTitle>
              <CardDescription>
                Detailed session and database information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How to Fix Onboarding Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">If you're stuck in onboarding:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click &quot;Fetch Debug Data&quot; to see your current session status</li>
                <li>If you have an organisation in the database but not in the session, click &quot;Refresh Session&quot;</li>
                <li>If that doesn&apos;t work, sign out and sign in again</li>
                <li>If you still don&apos;t have an organisation, you may need to complete onboarding</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Common causes:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>JWT token not refreshing properly (fixed in latest update)</li>
                <li>Session cache issues</li>
                <li>Database and session data mismatch</li>
                <li>Organisation was deleted or changed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
