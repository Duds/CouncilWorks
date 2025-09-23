"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  RefreshCw,
  AlertCircle,
  Zap,
  Building2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  assetType: string;
  condition: string;
  priority: string;
}

interface RCMTemplate {
  id: string;
  name: string;
  assetType: string;
  maintenanceTasks: Array<{
    id: string;
    name: string;
    type: string;
    frequency: string;
    estimatedCost?: number;
  }>;
}

interface GeneratedWorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  assetName: string;
  priority: string;
  dueDate: string;
  estimatedCost: number;
  templateName: string;
}

interface GenerationResult {
  success: boolean;
  generatedWorkOrders: GeneratedWorkOrder[];
  errors: Array<{
    assetId: string;
    assetName: string;
    error: string;
  }>;
  summary: {
    totalGenerated: number;
    totalErrors: number;
    assetsProcessed: number;
  };
}

/**
 * Auto Work Order Generator Component
 * Generates work orders automatically from RCM templates
 */
export function AutoWorkOrderGenerator() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [templates, setTemplates] = useState<RCMTemplate[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [riskThreshold, setRiskThreshold] = useState<string>("0");
  const [timeHorizon, setTimeHorizon] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  useEffect(() => {
    loadAssetsAndTemplates();
  }, []);

  const loadAssetsAndTemplates = async () => {
    setLoading(true);
    
    try {
      // Load assets
      const assetsResponse = await fetch("/api/assets");
      if (assetsResponse.ok) {
        const assetsData = await assetsResponse.json();
        setAssets(assetsData.assets || []);
      }

      // Load RCM templates
      const templatesResponse = await fetch("/api/rcm-templates");
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData.templates || []);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkOrders = async () => {
    if (selectedAssets.length === 0) {
      toast.error("Please select at least one asset");
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch("/api/maintenance/auto-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetIds: selectedAssets,
          templateIds: selectedTemplates.length > 0 ? selectedTemplates : undefined,
          riskThreshold: parseInt(riskThreshold),
          timeHorizon: timeHorizon !== "ALL" ? timeHorizon : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        
        if (data.summary.totalGenerated > 0) {
          toast.success(`Generated ${data.summary.totalGenerated} work orders successfully`);
        } else {
          toast.warning("No work orders were generated");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to generate work orders");
      }
    } catch (error) {
      toast.error("Failed to generate work orders");
    } finally {
      setGenerating(false);
    }
  };

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const selectAllAssets = () => {
    setSelectedAssets(assets.map(asset => asset.id));
  };

  const clearAllAssets = () => {
    setSelectedAssets([]);
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "CRITICAL": return "destructive";
      case "POOR": return "destructive";
      case "FAIR": return "outline";
      case "GOOD": return "secondary";
      case "EXCELLENT": return "secondary";
      default: return "default";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "outline";
      case "LOW": return "secondary";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading assets and templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Auto Work Order Generator</h2>
          
        </div>
        <Button variant="outline" onClick={loadAssetsAndTemplates}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Generation Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Threshold</label>
              <Select value={riskThreshold} onValueChange={setRiskThreshold}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Assets</SelectItem>
                  <SelectItem value="20">Low Risk (20+)</SelectItem>
                  <SelectItem value="40">Medium Risk (40+)</SelectItem>
                  <SelectItem value="60">High Risk (60+)</SelectItem>
                  <SelectItem value="80">Critical Risk (80+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Time Horizon</label>
              <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Frequencies</SelectItem>
                  <SelectItem value="IMMEDIATE">Immediate (Daily/Weekly)</SelectItem>
                  <SelectItem value="SHORT_TERM">Short Term (Monthly)</SelectItem>
                  <SelectItem value="MEDIUM_TERM">Medium Term (Quarterly)</SelectItem>
                  <SelectItem value="LONG_TERM">Long Term (Annual)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateWorkOrders} 
                disabled={generating || selectedAssets.length === 0}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Work Orders
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Asset Selection
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllAssets}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllAssets}>
                Clear All
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Select assets to generate work orders for ({selectedAssets.length} selected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => handleAssetToggle(asset.id)}
              >
                <Checkbox
                  checked={selectedAssets.includes(asset.id)}
                  onChange={() => handleAssetToggle(asset.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{asset.name}</h4>
                    <div className="flex gap-1">
                      <Badge variant={getConditionBadgeVariant(asset.condition)} size="sm">
                        {asset.condition}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(asset.priority)} size="sm">
                        {asset.priority}
                      </Badge>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            RCM Template Selection (Optional)
          </CardTitle>
          <CardDescription>
            Select specific templates to use, or leave empty to use all applicable templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => handleTemplateToggle(template.id)}
              >
                <Checkbox
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => handleTemplateToggle(template.id)}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Generation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.summary.totalGenerated}</div>
                
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{result.summary.totalErrors}</div>
                
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.summary.assetsProcessed}</div>
                
              </div>
            </div>

            {result.generatedWorkOrders.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Generated Work Orders:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.generatedWorkOrders.map((wo) => (
                    <div key={wo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{wo.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {wo.assetName} • {wo.templateName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityBadgeVariant(wo.priority)}>
                          {wo.priority}
                        </Badge>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${wo.estimatedCost}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Due: {new Date(wo.dueDate).toLocaleDateString("en-AU")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-orange-600">Errors:</h4>
                <div className="space-y-2">
                  {result.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="text-sm font-medium">{error.assetName}</div>
                        <div className="text-xs text-muted-foreground">{error.error}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
