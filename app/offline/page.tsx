"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  WifiOff, 
  RefreshCw, 
  Smartphone, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2
} from "lucide-react";

/**
 * Offline Page
 * Shown when the user is offline and trying to access unavailable content
 */
export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [offlineData, setOfflineData] = useState({
    inspections: 0,
    assets: 0,
    pendingSync: 0,
  });

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load offline data info
    loadOfflineData();
    loadLastSyncTime();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = async () => {
    try {
      // This would load from IndexedDB
      // For now, simulate some data
      setOfflineData({
        inspections: 3,
        assets: 12,
        pendingSync: 2,
      });
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const loadLastSyncTime = () => {
    // Load last sync time from localStorage
    const lastSyncTime = localStorage.getItem('lastSyncTime');
    if (lastSyncTime) {
      setLastSync(lastSyncTime);
    }
  };

  const handleRetry = () => {
    if (isOnline) {
      window.location.reload();
    }
  };

  const handleSyncNow = async () => {
    try {
      // Trigger background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('inspection-sync');
        await registration.sync.register('asset-sync');
        
        // Update last sync time
        const now = new Date().toISOString();
        localStorage.setItem('lastSyncTime', now);
        setLastSync(now);
        
        // Show success message
        console.log('Background sync registered');
      }
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're Offline</h1>
          
        </div>

        {/* Connection Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
            
            {lastSync && (
              <div className="mt-3 text-xs text-muted-foreground">
                Last sync: {new Date(lastSync).toLocaleString("en-AU")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Data Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Offline Data Available</CardTitle>
            <CardDescription>
              Data cached for offline access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{offlineData.inspections}</div>
                
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{offlineData.assets}</div>
                
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{offlineData.pendingSync}</div>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Mobile Inspections</p>
                  
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Asset Data</p>
                  
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance Tasks</p>
                  
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isOnline ? (
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Go Online
            </Button>
          ) : (
            <Button onClick={handleSyncNow} className="w-full" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sync When Online
            </Button>
          )}
          
          <Button variant="outline" className="w-full" asChild>
            <a href="/mobile/dashboard">
              <Smartphone className="h-4 w-4 mr-2" />
              Continue Offline
            </a>
          </Button>
        </div>

        {/* Tips */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Offline Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Inspections are saved locally and sync when online</li>
              <li>• Asset data is cached for offline access</li>
              <li>• GPS location works offline for asset verification</li>
              <li>• Photos and documents are stored locally</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
