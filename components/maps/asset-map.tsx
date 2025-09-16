"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Layers, 
  Filter, 
  Search,
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  Navigation,
  Building2,
  Road,
  TreePine,
  BookOpen,
  Activity,
  TrafficCone,
  Droplets,
  Zap
} from "lucide-react";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const MarkerClusterGroup = dynamic(() => import("react-leaflet").then((mod) => mod.MarkerClusterGroup), { ssr: false });

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

interface AssetMapProps {
  assets?: Asset[];
  onAssetSelect?: (asset: Asset) => void;
  selectedAsset?: Asset | null;
  height?: string;
}

/**
 * Asset Map Component
 * Displays assets on an interactive map with clustering and filtering
 */
export function AssetMap({ 
  assets = [], 
  onAssetSelect, 
  selectedAsset,
  height = "500px" 
}: AssetMapProps) {
  const [mapAssets, setMapAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    assetType: "",
    status: "",
    condition: "",
    priority: "",
    hasLocation: true,
  });

  // Filter assets that have location data
  const assetsWithLocation = assets.filter(asset => 
    asset.latitude && asset.longitude &&
    asset.latitude >= -90 && asset.latitude <= 90 &&
    asset.longitude >= -180 && asset.longitude <= 180
  );

  // Apply filters
  const filteredAssets = assetsWithLocation.filter(asset => {
    if (filters.assetType && asset.assetType !== filters.assetType) return false;
    if (filters.status && asset.status !== filters.status) return false;
    if (filters.condition && asset.condition !== filters.condition) return false;
    if (filters.priority && asset.priority !== filters.priority) return false;
    return true;
  });

  // Get unique values for filter dropdowns
  const assetTypes = [...new Set(assetsWithLocation.map(a => a.assetType))];
  const statuses = [...new Set(assetsWithLocation.map(a => a.status))];
  const conditions = [...new Set(assetsWithLocation.map(a => a.condition))];
  const priorities = [...new Set(assetsWithLocation.map(a => a.priority))];

  // Default map center (Sydney, Australia)
  const defaultCenter: [number, number] = [-33.8688, 151.2093];
  const defaultZoom = 10;

  // Get map center from selected asset or use default
  const mapCenter = selectedAsset && selectedAsset.latitude && selectedAsset.longitude
    ? [selectedAsset.latitude, selectedAsset.longitude] as [number, number]
    : defaultCenter;

  // Get asset icon based on type and condition
  const getAssetIcon = (asset: Asset) => {
    const condition = asset.condition.toLowerCase();
    const type = asset.assetType.toLowerCase();
    
    // Color based on condition
    let color = "#3b82f6"; // default blue
    if (condition === "critical") color = "#ef4444"; // red
    else if (condition === "poor") color = "#f59e0b"; // orange
    else if (condition === "fair") color = "#eab308"; // yellow
    else if (condition === "good" || condition === "excellent") color = "#10b981"; // green

    // Icon based on type
    let IconComponent = MapPin; // default pin
    if (type.includes("building")) IconComponent = Building2;
    else if (type.includes("road") || type.includes("bridge")) IconComponent = Road;
    else if (type.includes("park") || type.includes("playground")) IconComponent = TreePine;
    else if (type.includes("library")) IconComponent = BookOpen;
    else if (type.includes("sports")) IconComponent = Activity;
    else if (type.includes("traffic") || type.includes("light")) IconComponent = TrafficCone;
    else if (type.includes("water") || type.includes("drainage")) IconComponent = Droplets;
    else if (type.includes("electrical")) IconComponent = Zap;

    return { IconComponent, color };
  };

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

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Asset Map
          </CardTitle>
          <CardDescription>
            {filteredAssets.length} assets displayed on map
            {assetsWithLocation.length !== assets.length && (
              <span className="text-orange-600 ml-2">
                ({assets.length - assetsWithLocation.length} assets without location data)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Asset Type</label>
              <select
                value={filters.assetType}
                onChange={(e) => setFilters(prev => ({ ...prev, assetType: e.target.value }))}
                className="w-full p-2 border rounded-md text-sm"
                title="Filter by asset type"
              >
                <option value="">All Types</option>
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border rounded-md text-sm"
                title="Filter by asset status"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full p-2 border rounded-md text-sm"
                title="Filter by asset condition"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-2 border rounded-md text-sm"
                title="Filter by asset priority"
              >
                <option value="">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({
                  assetType: "",
                  status: "",
                  condition: "",
                  priority: "",
                  hasLocation: true,
                })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Good/Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Poor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Unknown</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <div className="relative" style={{ height }}>
            {typeof window !== "undefined" && (
              <MapContainer
                center={mapCenter}
                zoom={defaultZoom}
                className="h-full w-full rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MarkerClusterGroup>
                  {filteredAssets.map((asset) => {
                    const { IconComponent, color } = getAssetIcon(asset);
                    return (
                      <Marker
                        key={asset.id}
                        position={[asset.latitude!, asset.longitude!]}
                        eventHandlers={{
                          click: () => onAssetSelect?.(asset),
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                              <IconComponent className="h-5 w-5" style={{ color }} />
                              <div>
                                <h4 className="font-semibold text-sm">{asset.name}</h4>
                                <p className="text-xs text-gray-600">{asset.assetNumber}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-1 mb-3">
                              <Badge variant={getStatusBadgeVariant(asset.status)} className="text-xs">
                                {asset.status.replace("_", " ")}
                              </Badge>
                              <Badge variant={getConditionBadgeVariant(asset.condition)} className="text-xs ml-1">
                                {asset.condition}
                              </Badge>
                              <Badge variant="outline" className="text-xs ml-1">
                                {asset.priority}
                              </Badge>
                            </div>
                            
                            {asset.address && (
                              <p className="text-xs text-gray-600 mb-2">
                                📍 {asset.address}
                                {asset.suburb && `, ${asset.suburb}`}
                                {asset.postcode && ` ${asset.postcode}`}
                              </p>
                            )}
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/assets/${asset.id}`, '_blank')}
                                className="text-xs"
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onAssetSelect?.(asset)}
                                className="text-xs"
                              >
                                Select
                              </Button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </MapContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asset Summary */}
      {filteredAssets.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{filteredAssets.length}</div>
                <div className="text-sm text-muted-foreground">Total Assets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredAssets.filter(a => a.condition === "GOOD" || a.condition === "EXCELLENT").length}
                </div>
                <div className="text-sm text-muted-foreground">Good Condition</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredAssets.filter(a => a.condition === "FAIR" || a.condition === "POOR").length}
                </div>
                <div className="text-sm text-muted-foreground">Needs Attention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredAssets.filter(a => a.condition === "CRITICAL").length}
                </div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
