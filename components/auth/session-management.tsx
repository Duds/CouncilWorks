"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  MapPin, 
  Clock, 
  Shield,
  LogOut,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

interface UserSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceInfo: string | null;
  location: string | null;
  lastUsed: string;
  createdAt: string;
  expires: string;
  isCurrent: boolean;
}

interface SessionsResponse {
  sessions: UserSession[];
}

/**
 * Session Management Component
 * Displays and manages user's active sessions
 */
export function SessionManagement() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [revokingSession, setRevokingSession] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data: SessionsResponse = await response.json();
      setSessions(data.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    setRevokingSession(sessionId);
    setError("");

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to revoke session");
      }

      // Remove the session from the list
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke session");
    } finally {
      setRevokingSession(null);
    }
  };

  const revokeAllOtherSessions = async () => {
    const otherSessions = sessions.filter(session => !session.isCurrent);
    
    for (const session of otherSessions) {
      await revokeSession(session.id);
    }
  };

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Monitor className="h-5 w-5" />;
    
    if (userAgent.includes("Mobile")) return <Smartphone className="h-5 w-5" />;
    if (userAgent.includes("Tablet")) return <Tablet className="h-5 w-5" />;
    
    return <Monitor className="h-5 w-5" />;
  };

  const getDeviceInfo = (userAgent: string | null, deviceInfo: string | null) => {
    if (deviceInfo) return deviceInfo;
    if (!userAgent) return "Unknown device";
    
    // Simple device detection
    if (userAgent.includes("Mobile")) return "Mobile device";
    if (userAgent.includes("Tablet")) return "Tablet";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "Mac";
    if (userAgent.includes("Linux")) return "Linux";
    
    return "Desktop";
  };

  const getBrowserInfo = (userAgent: string | null) => {
    if (!userAgent) return "Unknown browser";
    
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    
    return "Unknown browser";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const isSessionExpiringSoon = (expires: string) => {
    const now = new Date();
    const expiry = new Date(expires);
    const diffInHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return diffInHours < 24; // Expiring within 24 hours
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Management</h1>
          <p className="text-muted-foreground">
            Manage your active sessions and devices
          </p>
        </div>
        <Button variant="outline" onClick={fetchSessions} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          If you notice any suspicious activity or unrecognised devices, revoke those sessions immediately.
        </AlertDescription>
      </Alert>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id} className={session.isCurrent ? "ring-2 ring-primary" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {getDeviceIcon(session.userAgent)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">
                        {getDeviceInfo(session.userAgent, session.deviceInfo)}
                      </h3>
                      {session.isCurrent && (
                        <Badge variant="default">Current Session</Badge>
                      )}
                      {isSessionExpiringSoon(session.expires) && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        {getBrowserInfo(session.userAgent)}
                      </div>
                      
                      {session.ipAddress && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.ipAddress}
                        </div>
                      )}
                      
                      {session.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last used: {getTimeAgo(session.lastUsed)} ({formatTimestamp(session.lastUsed)})
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {formatTimestamp(session.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeSession(session.id)}
                    disabled={revokingSession === session.id}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {revokingSession === session.id ? "Revoking..." : "Revoke"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bulk Actions */}
      {sessions.filter(s => !s.isCurrent).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>
              Manage multiple sessions at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={revokeAllOtherSessions}
              disabled={revokingSession !== null}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Revoke All Other Sessions
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will sign out all devices except your current one.
            </p>
          </CardContent>
        </Card>
      )}

      {sessions.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active sessions</h3>
              <p className="text-muted-foreground">
                You don't have any active sessions at the moment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
