"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Save, 
  X, 
  MapPin, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";

interface Asset {
  id?: string;
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

interface AssetFormProps {
  asset?: Asset;
  mode: "create" | "edit";
}

/**
 * Asset Form Component
 * Handles creating and editing assets
 */
export function AssetForm({ asset, mode }: AssetFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Asset>({
    assetNumber: "",
    name: "",
    description: "",
    assetType: "BUILDING",
    status: "ACTIVE",
    condition: "UNKNOWN",
    priority: "MEDIUM",
    latitude: undefined,
    longitude: undefined,
    address: "",
    suburb: "",
    postcode: "",
    state: "NSW",
    country: "Australia",
    manufacturer: "",
    model: "",
    serialNumber: "",
    installationDate: "",
    warrantyExpiry: "",
    expectedLifespan: undefined,
    purchasePrice: undefined,
    currentValue: undefined,
    replacementCost: undefined,
    depreciationRate: undefined,
    lastInspection: "",
    nextInspection: "",
    inspectionFrequency: undefined,
    maintenanceCost: undefined,
    tags: [],
    notes: "",
    isPublic: false,
    ...asset,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState(asset?.tags?.join(", ") || "");

  // Asset type options
  const assetTypes = [
    "BUILDING", "ROAD", "BRIDGE", "FOOTPATH", "PARK", "PLAYGROUND",
    "SPORTS_FACILITY", "LIBRARY", "COMMUNITY_CENTRE", "CAR_PARK",
    "STREET_FURNITURE", "TRAFFIC_LIGHT", "STREET_LIGHT", "DRAINAGE",
    "WATER_SUPPLY", "SEWER", "ELECTRICAL_INFRASTRUCTURE", "TELECOMMUNICATIONS", "OTHER"
  ];

  const statuses = [
    "ACTIVE", "INACTIVE", "UNDER_CONSTRUCTION", "UNDER_MAINTENANCE", "DECOMMISSIONED", "PLANNED"
  ];

  const conditions = [
    "EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL", "UNKNOWN"
  ];

  const priorities = [
    "LOW", "MEDIUM", "HIGH", "CRITICAL"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === "create" ? "/api/assets" : `/api/assets/${asset?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/assets");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save asset");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/assets");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {mode === "create" ? "Create New Asset" : "Edit Asset"}
        </h1>
        
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential asset details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetNumber">Asset Number *</Label>
                <Input
                  id="assetNumber"
                  value={formData.assetNumber}
                  onChange={(e) => handleInputChange("assetNumber", e.target.value)}
                  required
                  placeholder="e.g., BUILD-001"
                />
              </div>
              <div>
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="e.g., Main Library"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the asset"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="assetType">Asset Type *</Label>
                <select
                  id="assetType"
                  value={formData.assetType}
                  onChange={(e) => handleInputChange("assetType", e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                  title="Select the type of asset"
                >
                  {assetTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  title="Select the asset status"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => handleInputChange("condition", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  title="Select the asset condition"
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  title="Select the asset priority"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange("isPublic", e.target.checked)}
                  className="rounded border-gray-300"
                  title="Check if this asset is publicly visible"
                />
                <Label htmlFor="isPublic">Public Asset</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
            <CardDescription>
              Geographic location and address details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude || ""}
                  onChange={(e) => handleInputChange("latitude", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="-33.8688"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude || ""}
                  onChange={(e) => handleInputChange("longitude", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="151.2093"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="suburb">Suburb</Label>
                <Input
                  id="suburb"
                  value={formData.suburb}
                  onChange={(e) => handleInputChange("suburb", e.target.value)}
                  placeholder="Sydney"
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  placeholder="2000"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="NSW"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>
              Technical specifications and manufacturer information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Model Number"
                />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                  placeholder="SN123456"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="installationDate">Installation Date</Label>
                <Input
                  id="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => handleInputChange("installationDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => handleInputChange("warrantyExpiry", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expectedLifespan">Expected Lifespan (years)</Label>
              <Input
                id="expectedLifespan"
                type="number"
                value={formData.expectedLifespan || ""}
                onChange={(e) => handleInputChange("expectedLifespan", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Information
            </CardTitle>
            <CardDescription>
              Purchase and valuation details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice || ""}
                  onChange={(e) => handleInputChange("purchasePrice", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="5000000"
                />
              </div>
              <div>
                <Label htmlFor="currentValue">Current Value ($)</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  value={formData.currentValue || ""}
                  onChange={(e) => handleInputChange("currentValue", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="4500000"
                />
              </div>
              <div>
                <Label htmlFor="replacementCost">Replacement Cost ($)</Label>
                <Input
                  id="replacementCost"
                  type="number"
                  step="0.01"
                  value={formData.replacementCost || ""}
                  onChange={(e) => handleInputChange("replacementCost", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="6000000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="depreciationRate">Depreciation Rate (%)</Label>
              <Input
                id="depreciationRate"
                type="number"
                step="0.01"
                value={formData.depreciationRate || ""}
                onChange={(e) => handleInputChange("depreciationRate", e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="2.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Maintenance Information
            </CardTitle>
            <CardDescription>
              Inspection and maintenance scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastInspection">Last Inspection</Label>
                <Input
                  id="lastInspection"
                  type="date"
                  value={formData.lastInspection}
                  onChange={(e) => handleInputChange("lastInspection", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nextInspection">Next Inspection</Label>
                <Input
                  id="nextInspection"
                  type="date"
                  value={formData.nextInspection}
                  onChange={(e) => handleInputChange("nextInspection", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inspectionFrequency">Inspection Frequency (days)</Label>
                <Input
                  id="inspectionFrequency"
                  type="number"
                  value={formData.inspectionFrequency || ""}
                  onChange={(e) => handleInputChange("inspectionFrequency", e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="365"
                />
              </div>
              <div>
                <Label htmlFor="maintenanceCost">Annual Maintenance Cost ($)</Label>
                <Input
                  id="maintenanceCost"
                  type="number"
                  step="0.01"
                  value={formData.maintenanceCost || ""}
                  onChange={(e) => handleInputChange("maintenanceCost", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="50000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Tags and notes for additional context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="library, public, cultural (comma-separated)"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about the asset"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === "create" ? "Create Asset" : "Update Asset"}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
