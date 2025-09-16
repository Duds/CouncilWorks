"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Shield, 
  User, 
  Clock, 
  MapPin, 
  Monitor,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw
} from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
  details: any;
}

interface ActivityLogsResponse {
  logs: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Activity Log Component
 * Displays user's recent activity and security events
 */
export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchActivityLogs();
  }, [pagination.page, filter]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filter) {
        params.append("action", filter);
      }

      const response = await fetch(`/api/activity?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }

      const data: ActivityLogsResponse = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
      case "USER_LOGOUT":
        return <User className="h-4 w-4" />;
      case "MFA_ENABLED":
      case "MFA_DISABLED":
      case "MFA_VERIFIED":
      case "MFA_BACKUP_CODE_USED":
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("LOGIN") || action.includes("VERIFIED")) {
      return "default";
    }
    if (action.includes("MFA") || action.includes("SECURITY")) {
      return "secondary";
    }
    if (action.includes("ERROR") || action.includes("FAILED")) {
      return "destructive";
    }
    return "outline";
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

  const getDeviceInfo = (userAgent: string | null) => {
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

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && logs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">
            View your recent account activity and security events
          </p>
        </div>
        <Button variant="outline" onClick={fetchActivityLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("")}
            >
              All Activity
            </Button>
            <Button
              variant={filter === "USER_LOGIN" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("USER_LOGIN")}
            >
              Sign-ins
            </Button>
            <Button
              variant={filter.includes("MFA") ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("MFA")}
            >
              MFA Events
            </Button>
            <Button
              variant={filter === "USER_UPDATED" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("USER_UPDATED")}
            >
              Profile Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    {getActionIcon(log.action)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium mb-2">{log.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {log.ipAddress && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {log.ipAddress}
                      </div>
                    )}
                    
                    {log.userAgent && (
                      <div className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        {getDeviceInfo(log.userAgent)} • {getBrowserInfo(log.userAgent)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} activities
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {logs.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activity found</h3>
              <p className="text-muted-foreground">
                {filter ? "No activities match your current filter." : "Your activity log is empty."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
