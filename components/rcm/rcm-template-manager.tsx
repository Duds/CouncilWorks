"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface RCMTemplate {
  id: string;
  name: string;
  description?: string;
  assetType: string;
  version: string;
  status: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdByUser: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  failureModes: Array<{
    id: string;
    name: string;
    type: string;
    severity: string;
    probability?: number;
    impact?: number;
    riskScore?: number;
  }>;
  maintenanceTasks: Array<{
    id: string;
    name: string;
    type: string;
    frequency: string;
    duration?: number;
    estimatedCost?: number;
  }>;
  _count: {
    assetsUsingTemplate: number;
  };
}

interface RCMTemplateManagerProps {
  assetType?: string;
  onTemplateSelect?: (template: RCMTemplate) => void;
}

/**
 * RCM Template Manager Component
 * Manages RCM templates for asset maintenance planning
 */
export function RCMTemplateManager({ 
  assetType, 
  onTemplateSelect 
}: RCMTemplateManagerProps) {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<RCMTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assetTypeFilter, setAssetTypeFilter] = useState(assetType || "ALL");

  useEffect(() => {
    loadTemplates();
  }, [assetTypeFilter, statusFilter]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (assetTypeFilter !== "ALL") params.append("assetType", assetTypeFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/rcm-templates?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        setError("Failed to load RCM templates");
      }
    } catch (error) {
      setError("Failed to load RCM templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/rcm-templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Template deleted successfully");
        loadTemplates();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete template");
      }
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleCopy = async (template: RCMTemplate) => {
    try {
      const response = await fetch(`/api/rcm-templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          description: template.description,
          assetType: template.assetType,
          version: "1.0",
          isPublic: false,
          failureModes: template.failureModes.map(fm => ({
            name: fm.name,
            type: fm.type,
            severity: fm.severity,
            probability: fm.probability,
            impact: fm.impact,
          })),
          maintenanceTasks: template.maintenanceTasks.map(mt => ({
            name: mt.name,
            type: mt.type,
            frequency: mt.frequency,
            duration: mt.duration,
            estimatedCost: mt.estimatedCost,
          })),
        }),
      });

      if (response.ok) {
        toast.success("Template copied successfully");
        loadTemplates();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to copy template");
      }
    } catch (error) {
      toast.error("Failed to copy template");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "DRAFT": return "secondary";
      case "ARCHIVED": return "outline";
      case "REVIEW_REQUIRED": return "destructive";
      default: return "default";
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      default: return "default";
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">RCM Templates</h2>
          <p className="text-muted-foreground">
            Manage Reliability Centered Maintenance templates for asset classes
          </p>
        </div>
        <Button onClick={() => {/* TODO: Open create template modal */}}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Templates</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={assetTypeFilter}
                onValueChange={setAssetTypeFilter}
                name="assetType"
                title="Filter by asset type"
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Asset Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Asset Types</SelectItem>
                  <SelectItem value="BUILDING">Building</SelectItem>
                  <SelectItem value="ROAD">Road</SelectItem>
                  <SelectItem value="BRIDGE">Bridge</SelectItem>
                  <SelectItem value="PARK">Park</SelectItem>
                  <SelectItem value="LIBRARY">Library</SelectItem>
                  <SelectItem value="SPORTS_FACILITY">Sports Facility</SelectItem>
                  <SelectItem value="TRAFFIC_LIGHT">Traffic Light</SelectItem>
                  <SelectItem value="WATER_TREATMENT">Water Treatment</SelectItem>
                  <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                name="status"
                title="Filter by template status"
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="REVIEW_REQUIRED">Review Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={loadTemplates} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading templates...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "ALL" || assetTypeFilter !== "ALL"
                  ? "Try adjusting your search criteria"
                  : "Create your first RCM template to get started"}
              </p>
              <Button onClick={() => {/* TODO: Open create template modal */}}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      {template.description || "No description provided"}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{template.assetType}</Badge>
                      <Badge variant={getStatusBadgeVariant(template.status)}>
                        {template.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="secondary">v{template.version}</Badge>
                      {template.isPublic && (
                        <Badge variant="default">Public</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTemplateSelect?.(template)}
                      title="View template details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(template)}
                      title="Copy template"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Edit template"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(template.id, template.name)}
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Failure Modes */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Failure Modes ({template.failureModes.length})
                    </h4>
                    <div className="space-y-1">
                      {template.failureModes.slice(0, 3).map((fm) => (
                        <div key={fm.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{fm.name}</span>
                          <Badge variant={getSeverityBadgeVariant(fm.severity)} size="sm">
                            {fm.severity}
                          </Badge>
                        </div>
                      ))}
                      {template.failureModes.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{template.failureModes.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Maintenance Tasks */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Maintenance Tasks ({template.maintenanceTasks.length})
                    </h4>
                    <div className="space-y-1">
                      {template.maintenanceTasks.slice(0, 3).map((mt) => (
                        <div key={mt.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{mt.name}</span>
                          <Badge variant="outline" size="sm">
                            {mt.frequency}
                          </Badge>
                        </div>
                      ))}
                      {template.maintenanceTasks.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{template.maintenanceTasks.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Usage & Metadata */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Usage & Info
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>{template._count.assetsUsingTemplate} assets using</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Created {new Date(template.createdAt).toLocaleDateString("en-AU")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>By {template.createdByUser.name || template.createdByUser.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
