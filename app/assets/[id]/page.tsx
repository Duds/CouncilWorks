"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Edit, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Building2,
  Clock,
  User,
  FileText,
  Wrench,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { DocumentManager } from "@/components/assets/document-manager";
import { FMEAAnalysis } from "@/components/rcm/fmea-analysis";

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
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
  updatedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    documents: number;
    inspections: number;
    maintenance: number;
    workOrders: number;
  };
}

/**
 * Asset Detail Page
 * Displays comprehensive asset information
 */
export default function AssetDetailPage() {
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

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "INACTIVE": return "secondary";
      case "UNDER_CONSTRUCTION": return "outline";
      case "UNDER_MAINTENANCE": return "destructive";
      case "DECOMMISSIONED": return "secondary";
      case "PLANNED": return "outline";
      default: return "default";
    }
  };

  // Get condition badge variant
  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "EXCELLENT": return "default";
      case "GOOD": return "default";
      case "FAIR": return "outline";
      case "POOR": return "destructive";
      case "CRITICAL": return "destructive";
      case "UNKNOWN": return "secondary";
      default: return "default";
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "LOW": return "secondary";
      case "MEDIUM": return "default";
      case "HIGH": return "destructive";
      case "CRITICAL": return "destructive";
      default: return "default";
    }
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-AU");
  };

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-AU");
  };

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
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/assets">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assets
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{asset.name}</h1>
              <p className="text-muted-foreground">{asset.assetNumber}</p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/assets/${asset.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Asset
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusBadgeVariant(asset.status)}>
                    {asset.status.replace("_", " ")}
                  </Badge>
                  <Badge variant={getConditionBadgeVariant(asset.condition)}>
                    {asset.condition}
                  </Badge>
                  <Badge variant={getPriorityBadgeVariant(asset.priority)}>
                    {asset.priority}
                  </Badge>
                  {asset.isPublic && (
                    <Badge variant="outline">Public</Badge>
                  )}
                </div>

                {/* Description */}
                {asset.description && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Description</h4>
                    <p className="text-muted-foreground">{asset.description}</p>
                  </div>
                )}

                {/* Asset Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Asset Type</h4>
                    <p className="text-muted-foreground">{asset.assetType.replace("_", " ")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Manufacturer</h4>
                    <p className="text-muted-foreground">{asset.manufacturer || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Model</h4>
                    <p className="text-muted-foreground">{asset.model || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Serial Number</h4>
                    <p className="text-muted-foreground">{asset.serialNumber || "N/A"}</p>
                  </div>
                </div>

                {/* Tags */}
                {asset.tags && asset.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {asset.notes && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Notes</h4>
                    <p className="text-muted-foreground">{asset.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {asset.address && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Address</h4>
                    <p className="text-muted-foreground">
                      {asset.address}
                      {asset.suburb && `, ${asset.suburb}`}
                      {asset.postcode && ` ${asset.postcode}`}
                      {asset.state && `, ${asset.state}`}
                      {asset.country && `, ${asset.country}`}
                    </p>
                  </div>
                )}

                {(asset.latitude && asset.longitude) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Latitude</h4>
                      <p className="text-muted-foreground">{asset.latitude}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Longitude</h4>
                      <p className="text-muted-foreground">{asset.longitude}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Purchase Price</h4>
                    <p className="text-muted-foreground">{formatCurrency(asset.purchasePrice)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Current Value</h4>
                    <p className="text-muted-foreground">{formatCurrency(asset.currentValue)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Replacement Cost</h4>
                    <p className="text-muted-foreground">{formatCurrency(asset.replacementCost)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-1">Depreciation Rate</h4>
                  <p className="text-muted-foreground">{asset.depreciationRate ? `${asset.depreciationRate}%` : "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Last Inspection</h4>
                    <p className="text-muted-foreground">{formatDate(asset.lastInspection)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Next Inspection</h4>
                    <p className="text-muted-foreground">{formatDate(asset.nextInspection)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Inspection Frequency</h4>
                    <p className="text-muted-foreground">
                      {asset.inspectionFrequency ? `${asset.inspectionFrequency} days` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Annual Maintenance Cost</h4>
                    <p className="text-muted-foreground">{formatCurrency(asset.maintenanceCost)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {asset._count && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Documents</span>
                      <span className="font-medium">{asset._count.documents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Inspections</span>
                      <span className="font-medium">{asset._count.inspections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Maintenance</span>
                      <span className="font-medium">{asset._count.maintenance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Work Orders</span>
                      <span className="font-medium">{asset._count.workOrders}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Installation & Warranty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Installation & Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Installation Date</h4>
                  <p className="text-muted-foreground">{formatDate(asset.installationDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Warranty Expiry</h4>
                  <p className="text-muted-foreground">{formatDate(asset.warrantyExpiry)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Expected Lifespan</h4>
                  <p className="text-muted-foreground">
                    {asset.expectedLifespan ? `${asset.expectedLifespan} years` : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Audit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Audit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Created</h4>
                  <p className="text-muted-foreground">{formatDateTime(asset.createdAt)}</p>
                  {asset.createdByUser && (
                    <p className="text-xs text-muted-foreground">by {asset.createdByUser.name}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Last Updated</h4>
                  <p className="text-muted-foreground">{formatDateTime(asset.updatedAt)}</p>
                  {asset.updatedByUser && (
                    <p className="text-xs text-muted-foreground">by {asset.updatedByUser.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mt-8">
          <DocumentManager assetId={asset.id} assetName={asset.name} />
        </div>

        {/* FMEA Analysis */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">FMEA Analysis</h3>
          <FMEAAnalysis assetId={asset.id} assetName={asset.name} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
