"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AssetForm } from "@/components/assets/asset-form";
import AppLayout from "@/components/layout/app-layout";
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
      <AppLayout
        requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
        title="Loading Asset..."
        description="Loading asset for editing"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading asset...</span>
        </div>
      </AppLayout>
    );
  }

  if (error || !asset) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
        title="Asset Not Found"
        description="The requested asset could not be found"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Asset not found"}</AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
      title={`Edit ${asset.name}`}
      description={`Edit asset ${asset.assetNumber}`}
    >
      <AssetForm asset={asset} mode="edit" />
    </AppLayout>
  );
}
