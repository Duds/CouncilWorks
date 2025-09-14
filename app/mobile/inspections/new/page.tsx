"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { InspectionForm } from "@/components/mobile/inspection-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  Loader2,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  assetType: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * New Mobile Inspection Page
 * Create a new asset inspection on mobile devices
 */
export default function NewMobileInspectionPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      // Try to load from API first
      const response = await fetch('/api/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      } else {
        // Fallback to offline storage
        const { offlineStorage } = await import('@/lib/offline-storage');
        await offlineStorage.init();
        const offlineAssets = await offlineStorage.getAssets();
        setAssets(offlineAssets);
      }
    } catch (error) {
      console.error("Failed to load assets:", error);
      // Try offline storage as fallback
      try {
        const { offlineStorage } = await import('@/lib/offline-storage');
        await offlineStorage.init();
        const offlineAssets = await offlineStorage.getAssets();
        setAssets(offlineAssets);
      } catch (offlineError) {
        console.error("Failed to load offline assets:", offlineError);
        toast.error("Failed to load assets");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssetSelect = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    setSelectedAsset(asset || null);
  };

  const handleSave = (inspection: any) => {
    toast.success("Inspection saved successfully");
    router.push('/mobile/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading assets...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 bg-background border-b p-4 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">New Inspection</h1>
              <p className="text-sm text-muted-foreground">Create asset inspection</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {!selectedAsset ? (
            <div className="space-y-4">
              {/* Asset Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Select Asset</CardTitle>
                  <CardDescription>
                    Choose the asset to inspect
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Asset List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => handleAssetSelect(asset.id)}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{asset.name}</h4>
                              <Badge variant="outline" size="sm">{asset.assetNumber}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{asset.assetType}</span>
                              {asset.address && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {asset.address}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-sm">No assets found</p>
                        <p className="text-xs">
                          {searchTerm ? "Try a different search term" : "No assets available for inspection"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 flex-col gap-2" asChild>
                      <a href="/mobile/assets">
                        <MapPin className="h-6 w-6" />
                        <span className="text-sm">Browse Assets</span>
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="h-16 flex-col gap-2" asChild>
                      <a href="/mobile/dashboard">
                        <Smartphone className="h-6 w-6" />
                        <span className="text-sm">Dashboard</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <InspectionForm
              asset={selectedAsset}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
