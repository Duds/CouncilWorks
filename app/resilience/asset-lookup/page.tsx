'use client';

import AppLayout from '@/components/layout/app-layout';
// Alert component no longer needed - using toast notifications
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SmartSearchInput } from '@/components/ui/smart-search-input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    Activity,
    // AlertTriangle,
    Building2,
    Clock,
    LayoutGrid,
    List,
    MapPin,
    MoreHorizontal,
    Search
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  assetType: string;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  servicePurposes: ServicePurpose[];
  lastInspection?: string;
  nextInspection?: string;
  riskScore?: number;
}

interface ServicePurpose {
  id: string;
  name: string;
  contribution: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface SearchResult {
  assets: Asset[];
  totalCount: number;
  searchMethod: 'PURPOSE' | 'ASSET' | 'EMERGENCY';
}

// Column definitions for the data table
const columns: ColumnDef<Asset>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset" />
    ),
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <div>
          <div className="font-medium">{asset.name}</div>
          <div className="text-sm text-muted-foreground">{asset.assetNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "assetType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm">
          {row.getValue("assetType").toString().replace('_', ' ')}
        </span>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {row.getValue("location")}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityVariant = (priority: string) => {
        switch (priority) {
          case 'CRITICAL':
            return 'priority-critical';
          case 'HIGH':
            return 'priority-high';
          case 'MEDIUM':
            return 'priority-medium';
          case 'LOW':
            return 'priority-low';
          default:
            return 'priority-medium';
        }
      };

      return (
        <Badge variant={getPriorityVariant(priority)} className="text-xs">
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition" />
    ),
    cell: ({ row }) => {
      const condition = row.getValue("condition") as string;
      const getConditionVariant = (condition: string) => {
        switch (condition) {
          case 'EXCELLENT':
            return 'condition-excellent';
          case 'GOOD':
            return 'condition-good';
          case 'FAIR':
            return 'condition-fair';
          case 'POOR':
            return 'condition-poor';
          case 'CRITICAL':
            return 'condition-critical';
          default:
            return 'condition-unknown';
        }
      };

      return (
        <Badge variant={getConditionVariant(condition)} className="text-xs">
          {condition}
        </Badge>
      );
    },
  },
  {
    id: "servicePurposes",
    header: "Service Purpose",
    cell: ({ row }) => {
      const asset = row.original;
      const purposes = asset.servicePurposes;
      const getPriorityVariant = (priority: string) => {
        switch (priority) {
          case 'CRITICAL':
            return 'priority-critical';
          case 'HIGH':
            return 'priority-high';
          case 'MEDIUM':
            return 'priority-medium';
          case 'LOW':
            return 'priority-low';
          default:
            return 'priority-medium';
        }
      };

      return (
        <div className="space-y-1">
          {purposes.slice(0, 2).map((purpose) => (
            <div key={purpose.id} className="flex items-center gap-1">
              <Badge variant={getPriorityVariant(purpose.criticality)} className="text-xs">
                {purpose.criticality}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {purpose.name}
              </span>
            </div>
          ))}
          {purposes.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{purposes.length - 2} more
            </span>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "lastInspection",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Inspection" />
    ),
    cell: ({ row }) => {
      const lastInspection = row.getValue("lastInspection") as string | undefined;
      return (
        <span className="text-sm">
          {lastInspection ? new Date(lastInspection).toLocaleDateString('en-AU') : 'Never'}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const asset = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(asset.id)}
            >
              Copy asset ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Activity className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * Asset Lookup Component
 * Purpose-driven asset search aligned with Aegrid Rules
 * Provides contextual asset access with behavioral guidance
 * @component AssetLookup
 * @example
 * ```tsx
 * <AssetLookup />
 * ```
 * @accessibility
 * - ARIA roles: main, region, search, tablist, tabpanel
 * - Keyboard navigation: Tab through search and results
 * - Screen reader: Announces search results and asset details
 */
export default function AssetLookup() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to show all assets
  // Error handling now uses toast notifications
  const [searchMethod, setSearchMethod] = useState<'PURPOSE' | 'ASSET' | 'EMERGENCY'>('PURPOSE');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // TanStack Table state
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: searchResults?.assets || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Load all assets on component mount to show transparency
  useEffect(() => {
    // Wait for authentication to complete
    if (status === 'loading') {
      return; // Still loading authentication
    }

    if (!session) {
      toast.error('Please log in to view assets');
      setLoading(false);
      return;
    }

    const loadAllAssets = async () => {
      try {
        setLoading(true);

        // Fetch all assets from the API
        const response = await fetch('/api/assets?limit=1000', {
          credentials: 'include', // Include cookies for authentication
        }); // Get all assets

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please log in to view assets');
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch assets');
        }

        const data = await response.json();

        // Transform API response to match our interface
        const transformedAssets = data.assets.map((asset: any) => ({
          id: asset.id,
          assetNumber: asset.assetNumber,
          name: asset.name,
          assetType: asset.assetType,
          condition: asset.condition,
          priority: asset.priority,
          location: asset.address || asset.location,
          servicePurposes: asset.assetPurposeMappings?.map((mapping: any) => ({
            id: mapping.servicePurpose.id,
            name: mapping.servicePurpose.name,
            contribution: mapping.contribution,
            criticality: mapping.criticality,
          })) || [],
          lastInspection: asset.lastInspection,
          nextInspection: asset.nextInspection,
          riskScore: 0, // Will be calculated from risk profiles
        }));

        setSearchResults({
          assets: transformedAssets,
          totalCount: data.pagination.total,
          searchMethod: 'ALL_ASSETS'
        });
        setLoading(false);
                } catch (err) {
                  console.error('Error loading assets:', err);
                  toast.error('Failed to load assets. Please try again.');
                  setLoading(false);
                }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(loadAllAssets, 100);
    return () => clearTimeout(timer);
  }, [session, status]);

  // Asset data is now fetched from the API instead of using mock data

  const handleSearch = async (query?: string) => {
    const searchQuery = query || searchTerm;
    setLoading(true);

    try {
      let apiUrl = '/api/assets?limit=1000';

      // Use semantic search if there's a query
      if (searchQuery.trim()) {
        // Use the new semantic search API
        apiUrl = `/api/assets/search?q=${encodeURIComponent(searchQuery)}&limit=1000`;
      }

      const response = await fetch(apiUrl, {
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please log in to search assets');
          return;
        }
        throw new Error('Failed to search assets');
      }

      const data = await response.json();

      // Transform API response to match our interface
      const transformedAssets = data.assets.map((asset: any) => ({
        id: asset.id,
        assetNumber: asset.assetNumber,
        name: asset.name,
        assetType: asset.assetType,
        condition: asset.condition,
        priority: asset.priority,
        location: asset.address || asset.location,
        servicePurposes: asset.assetPurposeMappings?.map((mapping: any) => ({
          id: mapping.servicePurpose.id,
          name: mapping.servicePurpose.name,
          contribution: mapping.contribution,
          criticality: mapping.criticality,
        })) || [],
        lastInspection: asset.lastInspection,
        nextInspection: asset.nextInspection,
        riskScore: 0, // Will be calculated from risk profiles
      }));

      setSearchResults({
        assets: transformedAssets,
        totalCount: data.totalCount || data.pagination?.total || transformedAssets.length,
        searchMethod: searchQuery.trim() ? searchMethod : 'ALL_ASSETS'
      });

      // Show search suggestions if provided
      if (data.suggestions && data.suggestions.length > 0 && searchQuery.trim()) {
        toast.info(`Search suggestions: ${data.suggestions.slice(0, 2).join(', ')}`);
      }

    } catch (err) {
      console.error('Search error:', err);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'priority-critical';
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getConditionVariant = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return 'condition-excellent';
      case 'GOOD':
        return 'condition-good';
      case 'FAIR':
        return 'condition-fair';
      case 'POOR':
        return 'condition-poor';
      case 'CRITICAL':
        return 'condition-critical';
      default:
        return 'condition-unknown';
    }
  };

  const getRiskLevel = (score?: number) => {
    if (!score) return { level: 'UNKNOWN', variant: 'condition-unknown' };
    if (score >= 40) return { level: 'CRITICAL', variant: 'priority-critical' };
    if (score >= 25) return { level: 'HIGH', variant: 'priority-high' };
    if (score >= 15) return { level: 'MEDIUM', variant: 'priority-medium' };
    return { level: 'LOW', variant: 'priority-low' };
  };

  // Show loading state while authentication is being checked
  if (status === 'loading') {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
        title="Asset Lookup"
        description="Purpose-driven asset search and emergency override"
      >
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </AppLayout>
    );
  }

  // Show loading state while assets are being fetched
  if (loading) {
    return (
      <AppLayout
        requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
        title="Asset Lookup"
        description="Purpose-driven asset search and emergency override"
      >
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading assets..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Asset Lookup"
      description="Purpose-driven asset search and emergency override"
    >
      <div className="space-y-6">

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Smart Asset Search
          </CardTitle>
          <CardDescription>
            Search assets using natural language, asset names, or service purposes. Try queries like "critical water pumps" or "assets needing maintenance"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={searchMethod} onValueChange={(value: 'PURPOSE' | 'ASSET' | 'EMERGENCY') => setSearchMethod(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="PURPOSE">By Purpose</TabsTrigger>
              <TabsTrigger value="ASSET">By Asset</TabsTrigger>
              <TabsTrigger value="EMERGENCY">Emergency</TabsTrigger>
            </TabsList>
          </Tabs>

          <SmartSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder={
              searchMethod === 'PURPOSE'
                ? 'Search by service purpose (e.g., "water treatment", "transportation")'
                : searchMethod === 'ASSET'
                ? 'Search by asset name or number (e.g., "WTP-001", "water pump")'
                : 'Emergency search - show all assets'
            }
            loading={loading}
            disabled={loading}
            context={{
              assets: searchResults?.assets.map(asset => ({
                name: asset.name,
                assetNumber: asset.assetNumber,
                location: asset.location,
              })),
              purposes: searchResults?.assets.flatMap(asset =>
                asset.servicePurposes.map(purpose => ({
                  name: purpose.name,
                  description: `${purpose.name} - ${purpose.criticality} priority`,
                }))
              ).filter((purpose, index, self) =>
                index === self.findIndex(p => p.name === purpose.name)
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Search Insights and Suggestions */}
      {searchTerm && searchResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" />
              Search Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Search Query</div>
                <div className="text-sm text-muted-foreground">"{searchTerm}"</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Results Found</div>
                <div className="text-sm text-muted-foreground">{searchResults.totalCount} assets</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Search Method</div>
                <div className="text-sm text-muted-foreground">{searchResults.searchMethod.replace('_', ' ').toLowerCase()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Asset Display Card */}
      {searchResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {searchResults.searchMethod === 'ALL_ASSETS' ? 'All Assets' : 'Search Results'}
                  <Badge variant="outline" className="ml-2">
                    {searchResults.totalCount} assets found
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {searchResults.searchMethod === 'ALL_ASSETS'
                    ? 'Purpose-driven asset search aligned with Aegrid Rules'
                    : `Found ${searchResults.totalCount} assets using ${searchResults.searchMethod.toLowerCase()} search`
                  }
                </CardDescription>
              </div>
              <div className="flex items-center border rounded-md p-1 bg-muted/50">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Cards
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Search interface moved to separate card above */}

              {/* Asset Display */}
              {searchResults.assets.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or using a different search method.
                  </p>
                </div>
              ) : viewMode === 'table' ? (
                /* Enhanced Data Table View */
                <div className="w-full space-y-4">
                  {/* Table Toolbar */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Filter assets..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                          table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                      />
                      <span className="text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} assets
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DataTableViewOptions
                        table={table}
                        columnDisplayNames={{
                          'name': 'Asset Name',
                          'assetType': 'Type',
                          'location': 'Location',
                          'priority': 'Priority',
                          'condition': 'Condition',
                          'servicePurposes': 'Service Purpose',
                          'lastInspection': 'Last Inspection',
                          'actions': 'Actions'
                        }}
                      />
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <DataTablePagination table={table} />
                </div>
              ) : (
                /* Card View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.assets.map((asset) => {
                    const riskLevel = getRiskLevel(asset.riskScore);
                    return (
                      <Card key={asset.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{asset.name}</CardTitle>
                              <CardDescription>{asset.assetNumber}</CardDescription>
                            </div>
                            <Badge variant={getPriorityVariant(asset.priority)}>
                              {asset.priority}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {/* Asset Type and Location */}
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium">{asset.assetType.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium">{asset.location}</span>
                            </div>

                            {/* Condition and Risk */}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Condition:</span>
                              <Badge variant={getConditionVariant(asset.condition)} className="text-xs">
                                {asset.condition}
                              </Badge>
                            </div>
                            {asset.riskScore && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Risk Level:</span>
                                <Badge variant={riskLevel.variant} className="text-xs">
                                  {riskLevel.level}
                                </Badge>
                              </div>
                            )}

                            {/* Service Purposes */}
                            <div className="border-t pt-3">
                              <div className="text-sm font-medium mb-2">Service Purposes:</div>
                              <div className="space-y-2">
                                {asset.servicePurposes.map((purpose) => (
                                  <div key={purpose.id} className="text-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{purpose.name}</span>
                                      <Badge variant={getPriorityVariant(purpose.criticality)} className="text-xs">
                                        {purpose.criticality}
                                      </Badge>
                                    </div>
                                    <div className="text-muted-foreground mt-1">
                                      {purpose.contribution}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Inspection Info */}
                            <div className="border-t pt-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Last Inspection:</span>
                                <span className="font-medium">
                                  {asset.lastInspection ? new Date(asset.lastInspection).toLocaleDateString('en-AU') : 'Never'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Next Due:</span>
                                <span className="font-medium">
                                  {asset.nextInspection ? new Date(asset.nextInspection).toLocaleDateString('en-AU') : 'Not scheduled'}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Activity className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Clock className="h-4 w-4 mr-2" />
                                Schedule
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error handling now uses toast notifications */}
      </div>
    </AppLayout>
  );
}
