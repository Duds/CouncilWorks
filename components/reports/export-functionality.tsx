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
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Calendar,
  Filter,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Table,
  Map,
} from "lucide-react";
import { toast } from "sonner";

interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'Image';
  icon: React.ReactNode;
  category: 'dashboard' | 'report' | 'data' | 'chart';
  size?: string;
}

interface ExportJob {
  id: string;
  name: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}

/**
 * Export Functionality Component
 * Comprehensive export capabilities for reports, dashboards, and data
 */
export function ExportFunctionality() {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeData, setIncludeData] = useState(true);
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const exportOptions: ExportOption[] = [
    {
      id: 'unified-dashboard',
      name: 'Unified Dashboard',
      description: 'Role-based dashboard with KPIs and metrics',
      format: 'PDF',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'dashboard',
      size: '2-3 pages',
    },
    {
      id: 'asset-condition-report',
      name: 'Asset Condition Report',
      description: 'Asset condition trending and predictive analytics',
      format: 'PDF',
      icon: <PieChart className="h-5 w-5" />,
      category: 'report',
      size: '5-6 pages',
    },
    {
      id: 'risk-compliance-report',
      name: 'Risk & Compliance Report',
      description: 'Risk assessment and regulatory compliance',
      format: 'PDF',
      icon: <AlertCircle className="h-5 w-5" />,
      category: 'report',
      size: '4-5 pages',
    },
    {
      id: 'asset-register',
      name: 'Asset Register',
      description: 'Complete asset inventory with details',
      format: 'Excel',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      category: 'data',
      size: 'Large dataset',
    },
    {
      id: 'maintenance-schedule',
      name: 'Maintenance Schedule',
      description: 'Upcoming and completed maintenance tasks',
      format: 'Excel',
      icon: <Calendar className="h-5 w-5" />,
      category: 'data',
      size: 'Medium dataset',
    },
    {
      id: 'asset-map',
      name: 'Asset Map',
      description: 'Geographic visualization of asset locations',
      format: 'Image',
      icon: <Map className="h-5 w-5" />,
      category: 'chart',
      size: 'High resolution',
    },
    {
      id: 'work-orders',
      name: 'Work Orders',
      description: 'Work order history and status tracking',
      format: 'CSV',
      icon: <FileText className="h-5 w-5" />,
      category: 'data',
      size: 'Medium dataset',
    },
  ];

  const formatOptions = [
    { value: 'PDF', label: 'PDF Document', icon: <FileText className="h-4 w-4" /> },
    { value: 'Excel', label: 'Excel Spreadsheet', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { value: 'CSV', label: 'CSV Data File', icon: <FileText className="h-4 w-4" /> },
    { value: 'Image', label: 'Image (PNG/JPEG)', icon: <FileImage className="h-4 w-4" /> },
  ];

  const handleExport = async () => {
    if (!selectedReport || !selectedFormat) {
      toast.error("Please select a report and format");
      return;
    }

    setIsExporting(true);
    
    // Simulate export job creation
    const newJob: ExportJob = {
      id: `export-${Date.now()}`,
      name: `${selectedReport} (${selectedFormat})`,
      format: selectedFormat,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setExportJobs(prev => [newJob, ...prev]);
    setShowExportDialog(false);

    // Simulate export processing
    const processExport = async () => {
      // Update status to processing
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'processing', progress: 25 }
          : job
      ));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update progress
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, progress: 50 }
          : job
      ));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update progress
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, progress: 75 }
          : job
      ));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Complete export
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'completed', 
              progress: 100,
              completedAt: new Date().toISOString(),
              downloadUrl: `/downloads/${newJob.id}.${selectedFormat.toLowerCase()}`
            }
          : job
      ));

      toast.success(`Export completed: ${selectedReport}`);
    };

    await processExport();
    setIsExporting(false);
  };

  const handleDownload = (job: ExportJob) => {
    if (job.downloadUrl) {
      // In real implementation, this would trigger the actual download
      toast.success(`Downloading ${job.name}...`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      case 'processing': return <Badge variant="secondary">Processing</Badge>;
      case 'completed': return <Badge variant="default">Completed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dashboard': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'data': return 'bg-purple-100 text-purple-800';
      case 'chart': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOptions = selectedFormat 
    ? exportOptions.filter(option => option.format === selectedFormat)
    : exportOptions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Export Reports & Data</h1>
          <p className="text-muted-foreground">
            Export dashboards, reports, and data in multiple formats
          </p>
        </div>
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogTrigger asChild>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              New Export
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Export Report or Data</DialogTitle>
              <DialogDescription>
                Select the content and format for your export
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          {format.icon}
                          {format.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Report/Data</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content to export" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={!selectedReport || !selectedFormat || isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Export Options Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exportOptions.map((option) => (
          <Card key={option.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <div>
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getCategoryColor(option.category)}>
                  {option.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {option.format} • {option.size}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedFormat(option.format);
                    setSelectedReport(option.id);
                    setShowExportDialog(true);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Jobs */}
      {exportJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Export Jobs
            </CardTitle>
            <CardDescription>
              Track your export progress and download completed files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="font-medium">{job.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(job.createdAt).toLocaleString("en-AU")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {job.status === 'processing' && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {job.progress}%
                        </span>
                      </div>
                    )}
                    
                    {getStatusBadge(job.status)}
                    
                    {job.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(job)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Export Actions
          </CardTitle>
          <CardDescription>
            Common export tasks and scheduled reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => {
                setSelectedFormat('PDF');
                setSelectedReport('unified-dashboard');
                setShowExportDialog(true);
              }}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Executive Summary</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => {
                setSelectedFormat('Excel');
                setSelectedReport('asset-register');
                setShowExportDialog(true);
              }}
            >
              <FileSpreadsheet className="h-6 w-6" />
              <span className="text-sm">Asset Register</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => {
                setSelectedFormat('PDF');
                setSelectedReport('risk-compliance-report');
                setShowExportDialog(true);
              }}
            >
              <AlertCircle className="h-6 w-6" />
              <span className="text-sm">Risk Report</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => {
                setSelectedFormat('CSV');
                setSelectedReport('work-orders');
                setShowExportDialog(true);
              }}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Work Orders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
