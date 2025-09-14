"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  GripVertical,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Map,
  Download,
  Save,
  Eye,
  Settings,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ReportWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'map';
  title: string;
  dataSource: string;
  chartType?: 'bar' | 'pie' | 'line' | 'area';
  position: { x: number; y: number; w: number; h: number };
  filters: Record<string, any>;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  widgets: ReportWidget[];
  filters: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom Report Builder Component
 * Drag-and-drop interface for creating custom reports and dashboards
 */
export function CustomReportBuilder() {
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [currentReport, setCurrentReport] = useState<CustomReport | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const widgetTypes = [
    {
      id: 'chart',
      name: 'Chart',
      description: 'Visual data representation',
      icon: <BarChart3 className="h-5 w-5" />,
      categories: ['bar', 'pie', 'line', 'area'],
    },
    {
      id: 'table',
      name: 'Data Table',
      description: 'Tabular data display',
      icon: <Table className="h-5 w-5" />,
    },
    {
      id: 'metric',
      name: 'KPI Metric',
      description: 'Key performance indicator',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: 'map',
      name: 'Map View',
      description: 'Geographic visualization',
      icon: <Map className="h-5 w-5" />,
    },
  ];

  const dataSources = [
    { value: 'assets', label: 'Asset Data' },
    { value: 'work-orders', label: 'Work Orders' },
    { value: 'maintenance', label: 'Maintenance Records' },
    { value: 'inspections', label: 'Inspections' },
    { value: 'financial', label: 'Financial Data' },
    { value: 'compliance', label: 'Compliance Data' },
  ];

  const createNewReport = () => {
    const newReport: CustomReport = {
      id: `report-${Date.now()}`,
      name: reportName || "Untitled Report",
      description: reportDescription,
      widgets: [],
      filters: {},
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentReport(newReport);
    setShowBuilder(true);
    setReportName("");
    setReportDescription("");
  };

  const addWidget = (type: string) => {
    if (!currentReport) return;

    const newWidget: ReportWidget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `New ${type} Widget`,
      dataSource: 'assets',
      position: { x: 0, y: 0, w: 6, h: 4 },
      filters: {},
    };

    const updatedReport = {
      ...currentReport,
      widgets: [...currentReport.widgets, newWidget],
      updatedAt: new Date().toISOString(),
    };

    setCurrentReport(updatedReport);
    toast.success(`${type} widget added to report`);
  };

  const removeWidget = (widgetId: string) => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      widgets: currentReport.widgets.filter(w => w.id !== widgetId),
      updatedAt: new Date().toISOString(),
    };

    setCurrentReport(updatedReport);
    toast.success("Widget removed from report");
  };

  const updateWidget = (widgetId: string, updates: Partial<ReportWidget>) => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      widgets: currentReport.widgets.map(w => 
        w.id === widgetId ? { ...w, ...updates } : w
      ),
      updatedAt: new Date().toISOString(),
    };

    setCurrentReport(updatedReport);
  };

  const saveReport = async () => {
    if (!currentReport) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedReports = reports.filter(r => r.id !== currentReport.id);
      setReports([currentReport, ...updatedReports]);
      
      toast.success("Report saved successfully");
      setShowBuilder(false);
      setCurrentReport(null);
    } catch (error) {
      console.error("Failed to save report:", error);
      toast.error("Failed to save report");
    } finally {
      setSaving(false);
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'chart': return <BarChart3 className="h-4 w-4" />;
      case 'table': return <Table className="h-4 w-4" />;
      case 'metric': return <BarChart3 className="h-4 w-4" />;
      case 'map': return <Map className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getWidgetPreview = (widget: ReportWidget) => {
    switch (widget.type) {
      case 'chart':
        return (
          <div className="h-20 bg-blue-50 rounded border-2 border-dashed border-blue-300 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <div className="text-xs text-blue-600">{widget.title}</div>
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="h-20 bg-green-50 rounded border-2 border-dashed border-green-300 flex items-center justify-center">
            <div className="text-center">
              <Table className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <div className="text-xs text-green-600">{widget.title}</div>
            </div>
          </div>
        );
      case 'metric':
        return (
          <div className="h-20 bg-purple-50 rounded border-2 border-dashed border-purple-300 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <div className="text-xs text-purple-600">{widget.title}</div>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="h-20 bg-orange-50 rounded border-2 border-dashed border-orange-300 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-6 w-6 mx-auto mb-1 text-orange-600" />
              <div className="text-xs text-orange-600">{widget.title}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Custom Report Builder</h1>
          <p className="text-muted-foreground">
            Create custom reports and dashboards with drag-and-drop widgets
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Start building your custom report
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  placeholder="Enter report description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </div>
              
              <Button onClick={createNewReport} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report Builder */}
      {showBuilder && currentReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{currentReport.name}</CardTitle>
                <CardDescription>{currentReport.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button onClick={saveReport} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Widget Library */}
              <div className="lg:col-span-1">
                <h3 className="font-semibold mb-3">Widget Library</h3>
                <div className="space-y-2">
                  {widgetTypes.map((widgetType) => (
                    <Button
                      key={widgetType.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addWidget(widgetType.id)}
                    >
                      {widgetType.icon}
                      <span className="ml-2">{widgetType.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Report Canvas */}
              <div className="lg:col-span-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px]">
                  <div className="grid grid-cols-12 gap-4">
                    {currentReport.widgets.map((widget) => (
                      <div
                        key={widget.id}
                        className="col-span-6 border border-gray-200 rounded-lg p-3 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getWidgetIcon(widget.type)}
                            <span className="font-medium text-sm">{widget.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWidget(widget.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {getWidgetPreview(widget)}
                        
                        <div className="mt-2 space-y-2">
                          <div>
                            <Label className="text-xs">Title</Label>
                            <Input
                              size="sm"
                              value={widget.title}
                              onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                              className="h-6 text-xs"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Data Source</Label>
                            <Select
                              value={widget.dataSource}
                              onValueChange={(value) => updateWidget(widget.id, { dataSource: value })}
                            >
                              <SelectTrigger className="h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {dataSources.map((source) => (
                                  <SelectItem key={source.value} value={source.value}>
                                    {source.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {currentReport.widgets.length === 0 && (
                      <div className="col-span-12 flex items-center justify-center h-32 text-gray-500">
                        <div className="text-center">
                          <Plus className="h-8 w-8 mx-auto mb-2" />
                          <p>Add widgets to build your report</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Saved Reports
          </CardTitle>
          <CardDescription>
            Your custom reports and dashboards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <p>No custom reports created yet</p>
              <p className="text-sm">Create your first custom report to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {report.description}
                        </CardDescription>
                      </div>
                      <Badge variant={report.isPublic ? "default" : "secondary"}>
                        {report.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{report.widgets.length} widgets</span>
                        <span>{new Date(report.updatedAt).toLocaleDateString("en-AU")}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
