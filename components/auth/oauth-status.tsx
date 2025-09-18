"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

/**
 * OAuth Status Component
 * Shows the configuration status of OAuth providers
 */
export function OAuthStatus() {
  const [oauthStatus, setOauthStatus] = useState<{
    google: boolean;
    microsoft: boolean;
    nextauthUrl: string | null;
  }>({
    google: false,
    microsoft: false,
    nextauthUrl: null,
  });

  useEffect(() => {
    // Check OAuth configuration status
    const checkOAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/oauth-status");
        if (response.ok) {
          const status = await response.json();
          setOauthStatus(status);
        }
      } catch (error) {
        console.error("Failed to check OAuth status:", error);
      }
    };

    checkOAuthStatus();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">OAuth Configuration Status</CardTitle>
        <CardDescription>
          Check if OAuth providers are properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Google OAuth</span>
            <Badge variant={oauthStatus.google ? "default" : "destructive"}>
              {oauthStatus.google ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Configured
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Microsoft OAuth</span>
            <Badge variant={oauthStatus.microsoft ? "default" : "destructive"}>
              {oauthStatus.microsoft ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Configured
                </>
              )}
            </Badge>
          </div>
        </div>

        {oauthStatus.nextauthUrl && (
          <div className="space-y-2">
            <span className="text-sm font-medium">NextAuth URL</span>
            <code className="text-xs bg-muted p-2 rounded block break-all">
              {oauthStatus.nextauthUrl}
            </code>
          </div>
        )}

        {!oauthStatus.google && !oauthStatus.microsoft && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No OAuth providers are configured. Please set up OAuth credentials in your environment variables or use email and password authentication.
            </AlertDescription>
          </Alert>
        )}

        {oauthStatus.google || oauthStatus.microsoft ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              OAuth providers are configured. If you're still experiencing issues, check the callback URLs in your OAuth provider settings.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
