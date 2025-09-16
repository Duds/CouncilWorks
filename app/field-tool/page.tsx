'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Wrench,
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Download,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Field Tool Landing Page
 * Dedicated entry point for mobile field workers
 * Provides access to work orders, inspections, and offline capabilities
 */
export default function FieldToolPage() {
  const router = useRouter();

  useEffect(() => {
    // Register service worker for PWA capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Initialize offline storage
    import('@/lib/offline-storage').then(({ offlineStorage }) => {
      offlineStorage.init().catch(console.error);
    });
  }, []);

  const handleInstallPWA = async () => {
    try {
      // Check if PWA is installable
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        toast.success('PWA installation available in your browser menu');
      } else {
        toast.info('PWA installation not supported on this device');
      }
    } catch (error) {
      console.error('PWA installation error:', error);
      toast.error('Failed to install PWA');
    }
  };

  const handleOfflineMode = () => {
    toast.info('Offline mode enabled - all data will sync when online');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-sidebar-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Aegrid Field Tool</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline Ready
            </Badge>
            <Button variant="outline" size="sm" onClick={handleInstallPWA}>
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Field Worker Portal</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access work orders, perform inspections, and manage assets in the
            field. Works offline and syncs when connected.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Work Orders */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/mobile/work-orders')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Work Orders</CardTitle>
                  <CardDescription>
                    View and update assigned work orders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <Badge variant="outline">12</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In Progress</span>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed Today</span>
                  <Badge variant="default">8</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Work Orders
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Inspections */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/mobile/inspections/new')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Camera className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Inspections</CardTitle>
                  <CardDescription>
                    Perform asset inspections with photos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <Badge variant="outline">5</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overdue</span>
                  <Badge variant="destructive">2</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <Badge variant="default">15</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Start Inspection
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Asset Map */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/assets/map')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Asset Map</CardTitle>
                  <CardDescription>View assets and locations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Assets</span>
                  <Badge variant="outline">1,247</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nearby</span>
                  <Badge variant="secondary">23</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Critical</span>
                  <Badge variant="destructive">7</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Map
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Offline Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="h-5 w-5" />
                Offline First
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Work without internet connection
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Photos and data stored locally
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Automatic sync when online</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Background data synchronization
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleOfflineMode}
                className="w-full"
              >
                Enable Offline Mode
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today&apos;s Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-muted-foreground">
                    In Progress
                  </div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-sm text-muted-foreground">
                    Photos Taken
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to get the most out of the field tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  1
                </div>
                <h4 className="font-semibold">Install PWA</h4>
                <p className="text-sm text-muted-foreground">
                  Add to home screen for app-like experience
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  2
                </div>
                <h4 className="font-semibold">Sync Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download work orders and asset data
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  3
                </div>
                <h4 className="font-semibold">Start Working</h4>
                <p className="text-sm text-muted-foreground">
                  Access work orders and perform inspections
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
