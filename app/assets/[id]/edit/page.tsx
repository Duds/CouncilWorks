"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AssetForm } from "@/components/assets/asset-form";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  description?: string;
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
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: string;
  warrantyExpiry?: string;
  expectedLifespan?: number;
  purchasePrice?: number;
  currentValue?: number;
  replacementCost?: number;
  depreciationRate?: number;
  lastInspection?: string;
  nextInspection?: string;
  inspectionFrequency?: number;
  maintenanceCost?: number;
  tags?: string[];
  notes?: string;
  isPublic?: boolean;
}

/**
 * Edit Asset Page
 * Page for editing existing assets
 */
export default function EditAssetPage() {
  const params = useParams();
  const assetId = params.id as string;
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await fetch(`/api/assets/${assetId}`);
        if (response.ok) {
          const data = await response.json();
          setAsset(data);
        } else {
          setError("Asset not found");
        }
      } catch (error) {
        setError("Failed to load asset");
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      fetchAsset();
    }
  }, [assetId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading asset...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !asset) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Asset not found"}</AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <AssetForm asset={asset} mode="edit" />
      </div>
    </ProtectedRoute>
  );
}
