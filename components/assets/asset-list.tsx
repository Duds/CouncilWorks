"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Upload
} from "lucide-react";
import Link from "next/link";

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  description?: string;
  assetType: string;
  status: string;
  condition: string;
  priority: string;
  address?: string;
  suburb?: string;
  latitude?: number;
  longitude?: number;
  purchasePrice?: number;
  currentValue?: number;
  lastInspection?: string;
  nextInspection?: string;
  createdAt: string;
  _count: {
    documents: number;
    inspections: number;
    maintenance: number;
    workOrders: number;
  };
}

interface AssetListProps {
  initialAssets?: Asset[];
}

/**
 * Asset List Component
 * Displays a paginated list of assets with filtering and search capabilities
 */
export function AssetList({ initialAssets = [] }: AssetListProps) {
  const { data: session } = useSession();
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    assetType: "",
    status: "",
    condition: "",
    priority: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch assets with current filters and pagination
  const fetchAssets = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.assetType && { assetType: filters.assetType }),
        ...(filters.status && { status: filters.status }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.priority && { priority: filters.priority }),
      });

      const response = await fetch(`/api/assets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (initialAssets.length === 0) {
      fetchAssets();
    }
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchAssets(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchAssets(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      assetType: "",
      status: "",
      condition: "",
      priority: "",
    });
    setSearchTerm("");
    fetchAssets(1);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground">
            Manage and monitor council assets
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/assets/import">
              <Upload className="h-4 w-4 mr-2" />
              Import Assets
            </Link>
          </Button>
          <Button asChild>
            <Link href="/assets/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, number, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Asset Type</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.assetType}
                onChange={(e) => handleFilterChange("assetType", e.target.value)}
                title="Select asset type to filter by"
              >
                <option value="">All Types</option>
                <option value="BUILDING">Building</option>
                <option value="ROAD">Road</option>
                <option value="BRIDGE">Bridge</option>
                <option value="FOOTPATH">Footpath</option>
                <option value="PARK">Park</option>
                <option value="PLAYGROUND">Playground</option>
                <option value="SPORTS_FACILITY">Sports Facility</option>
                <option value="LIBRARY">Library</option>
                <option value="COMMUNITY_CENTRE">Community Centre</option>
                <option value="CAR_PARK">Car Park</option>
                <option value="STREET_FURNITURE">Street Furniture</option>
                <option value="TRAFFIC_LIGHT">Traffic Light</option>
                <option value="STREET_LIGHT">Street Light</option>
                <option value="DRAINAGE">Drainage</option>
                <option value="WATER_SUPPLY">Water Supply</option>
                <option value="SEWER">Sewer</option>
                <option value="ELECTRICAL_INFRASTRUCTURE">Electrical Infrastructure</option>
                <option value="TELECOMMUNICATIONS">Telecommunications</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                title="Select status to filter by"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="DECOMMISSIONED">Decommissioned</option>
                <option value="PLANNED">Planned</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Condition</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.condition}
                onChange={(e) => handleFilterChange("condition", e.target.value)}
                title="Select condition to filter by"
              >
                <option value="">All Conditions</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
                <option value="CRITICAL">Critical</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                title="Select priority to filter by"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2">
            <Button onClick={applyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No assets found matching your criteria.</p>
            <Button asChild className="mt-4">
              <Link href="/assets/new">Add Your First Asset</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {asset.assetNumber} • {asset.assetType.replace("_", " ")}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
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
                </div>

                {/* Description */}
                {asset.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {asset.description}
                  </p>
                )}

                {/* Location */}
                {asset.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">
                      {asset.address}
                      {asset.suburb && `, ${asset.suburb}`}
                    </span>
                  </div>
                )}

                {/* Financial Info */}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium">
                    {formatCurrency(asset.currentValue || asset.purchasePrice)}
                  </span>
                </div>

                {/* Inspection Info */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Inspection:</span>
                  <span className="font-medium">
                    {formatDate(asset.lastInspection)}
                  </span>
                </div>

                {/* Counts */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{asset._count.documents} documents</span>
                  <span>{asset._count.inspections} inspections</span>
                  <span>{asset._count.maintenance} maintenance</span>
                  <span>{asset._count.workOrders} work orders</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/assets/${asset.id}`}>View Details</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/assets/${asset.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} assets
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAssets(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAssets(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
