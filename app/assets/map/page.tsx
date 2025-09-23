"use client";

import AppLayout from "@/components/layout/app-layout";
import { AssetMap } from "@/components/maps/asset-map";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    Download,
    Layers,
    List,
    Map,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  assetType: string;
  status: string;
  condition: string;
  priority: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  isPublic?: boolean;
}

/**
 * Asset Map Page
 * Displays all assets on an interactive map with filtering and selection
 */
export default function AssetMapPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assets");
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      } else {
        setError("Failed to load assets");
      }
    } catch (error) {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const exportAssets = async () => {
    try {
      const response = await fetch("/api/assets?format=csv");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "assets-export.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const assetsWithLocation = assets.filter(asset =>
    asset.latitude && asset.longitude
  );

  if (loading) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
        title="Asset Map"
        description="Visualize and manage assets across your council area"
      >
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-2">Loading assets...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
      title="Asset Map"
      description="Visualize and manage assets across your council area"
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/assets">
              <List className="h-4 w-4 mr-2" />
              List View
            </Link>
          </Button>
          <Button variant="outline" onClick={exportAssets}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={loadAssets}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Layers className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{assets.length}</p>

                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Map className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{assetsWithLocation.length}</p>

                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {assets.filter(a => a.condition === "GOOD" || a.condition === "EXCELLENT").length}
                  </p>

                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {assets.filter(a => a.condition === "CRITICAL").length}
                  </p>

                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Component */}
        <AssetMap
          assets={assets}
          onAssetSelect={handleAssetSelect}
          selectedAsset={selectedAsset}
          height="600px"
        />

        {/* Selected Asset Details */}
        {selectedAsset && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Selected Asset: {selectedAsset.name}
              </CardTitle>
              <CardDescription>
                {selectedAsset.assetNumber} • {selectedAsset.assetType.replace("_", " ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  {selectedAsset.address && (
                    <p className="text-sm text-muted-foreground">
                      {selectedAsset.address}
                    </p>
                  )}
                  {selectedAsset.latitude && selectedAsset.longitude && (
                    <p className="text-sm text-muted-foreground">
                      {selectedAsset.latitude}, {selectedAsset.longitude}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Status & Condition</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span> {selectedAsset.status.replace("_", " ")}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Condition:</span> {selectedAsset.condition}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Priority:</span> {selectedAsset.priority}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href={`/assets/${selectedAsset.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/assets/${selectedAsset.id}/edit`}>
                        Edit Asset
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
