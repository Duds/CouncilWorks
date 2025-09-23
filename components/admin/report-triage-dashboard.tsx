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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  Search,
  Filter,
  Loader2,
  Eye,
  Edit,
  Send,
  MessageSquare,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface CitizenReport {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'acknowledged' | 'in-progress' | 'completed' | 'closed';
  source: 'portal' | 'snap-send-solve' | 'email' | 'phone';
  submittedAt: string;
  lastUpdated: string;
  location: {
    address: string;
    suburb: string;
    lat?: number;
    lng?: number;
  };
  reporter: {
    name: string;
    email: string;
    phone?: string;
    isAnonymous: boolean;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  estimatedResolution?: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    author: string;
    createdAt: string;
  }>;
}

interface TriageAction {
  type: 'assign' | 'priority' | 'category' | 'note' | 'status';
  reportId: string;
  value: any;
  reason?: string;
}

/**
 * Report Triage Dashboard Component
 * Administrative interface for triaging and assigning citizen reports
 */
export function ReportTriageDashboard() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [showTriageDialog, setShowTriageDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockReports: CitizenReport[] = [
        {
          id: '1',
          referenceNumber: 'REF-ABC123XYZ',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing damage to vehicles near the intersection with Oak Street',
          category: 'road-maintenance',
          priority: 'high',
          status: 'new',
          source: 'portal',
          submittedAt: '2025-01-13T09:30:00Z',
          lastUpdated: '2025-01-13T09:30:00Z',
          location: {
            address: '123 Main Street',
            suburb: 'Anytown',
            lat: -33.8688,
            lng: 151.2093,
          },
          reporter: {
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '0400 000 000',
            isAnonymous: false,
          },
          attachments: [
            {
              id: 'att-1',
              name: 'pothole-photo.jpg',
              type: 'image/jpeg',
              url: '/uploads/pothole-photo.jpg',
            },
          ],
          notes: [],
        },
        {
          id: '2',
          referenceNumber: 'REF-SSS789DEF',
          title: 'Broken Street Light',
          description: 'Street light not working, area is very dark at night',
          category: 'street-lighting',
          priority: 'medium',
          status: 'new',
          source: 'snap-send-solve',
          submittedAt: '2025-01-13T08:15:00Z',
          lastUpdated: '2025-01-13T08:15:00Z',
          location: {
            address: '45 Park Lane',
            suburb: 'Greenville',
          },
          reporter: {
            name: 'Anonymous',
            email: 'anonymous@snapsendsolve.com',
            isAnonymous: true,
          },
          attachments: [],
          notes: [],
        },
        {
          id: '3',
          referenceNumber: 'REF-GHI456JKL',
          title: 'Graffiti on Community Center',
          description: 'Inappropriate graffiti on the community center wall',
          category: 'building-maintenance',
          priority: 'low',
          status: 'acknowledged',
          source: 'email',
          submittedAt: '2025-01-12T14:45:00Z',
          lastUpdated: '2025-01-12T16:20:00Z',
          location: {
            address: 'Community Center',
            suburb: 'Riverside',
          },
          reporter: {
            name: 'Sarah Wilson',
            email: 'sarah.wilson@email.com',
            isAnonymous: false,
          },
          assignedTo: {
            id: 'staff-1',
            name: 'Mike Johnson',
            role: 'Building Maintenance Supervisor',
          },
          attachments: [
            {
              id: 'att-2',
              name: 'graffiti-photo.jpg',
              type: 'image/jpeg',
              url: '/uploads/graffiti-photo.jpg',
            },
          ],
          notes: [
            {
              id: 'note-1',
              content: 'Report acknowledged and assigned to building maintenance team',
              author: 'Mike Johnson',
              createdAt: '2025-01-12T16:20:00Z',
            },
          ],
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
    toast.success("Reports refreshed");
  };

  const handleTriageAction = async (action: TriageAction) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.map(report => {
        if (report.id === action.reportId) {
          const updatedReport = { ...report };
          
          switch (action.type) {
            case 'assign':
              updatedReport.assignedTo = action.value;
              updatedReport.status = 'acknowledged';
              break;
            case 'priority':
              updatedReport.priority = action.value;
              break;
            case 'category':
              updatedReport.category = action.value;
              break;
            case 'status':
              updatedReport.status = action.value;
              break;
            case 'note':
              updatedReport.notes.push({
                id: `note-${Date.now()}`,
                content: action.value,
                author: 'Current User',
                createdAt: new Date().toISOString(),
              });
              break;
          }
          
          updatedReport.lastUpdated = new Date().toISOString();
          return updatedReport;
        }
        return report;
      }));

      toast.success("Report updated successfully");
      setShowTriageDialog(false);
      setSelectedReport(null);
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("Failed to update report");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="destructive">New</Badge>;
      case 'acknowledged': return <Badge variant="default">Acknowledged</Badge>;
      case 'in-progress': return <Badge variant="outline">In Progress</Badge>;
      case 'completed': return <Badge variant="default">Completed</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'urgent': return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'portal': return <Badge variant="outline">Portal</Badge>;
      case 'snap-send-solve': return <Badge variant="secondary">Snap Send Solve</Badge>;
      case 'email': return <Badge variant="outline">Email</Badge>;
      case 'phone': return <Badge variant="outline">Phone</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.suburb.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesSource = sourceFilter === 'all' || report.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Report Triage Dashboard</h1>
          
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <LoadingSpinner size="sm" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reports.filter(r => r.status === 'new').length}
            </div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reports.filter(r => r.status === 'in-progress').length}
            </div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'completed').length}
            </div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reports.length}
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="portal">Portal</SelectItem>
                <SelectItem value="snap-send-solve">Snap Send Solve</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Citizen Reports</CardTitle>
          <CardDescription>
            Manage and triage reports from all sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-sm">
                    {report.referenceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-500">
                        {report.location.suburb}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {report.category.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(report.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell>
                    {getSourceBadge(report.source)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(report.submittedAt)}
                  </TableCell>
                  <TableCell>
                    {report.assignedTo ? (
                      <div>
                        <div className="font-medium">{report.assignedTo.name}</div>
                        <div className="text-sm text-gray-500">
                          {report.assignedTo.role}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setShowTriageDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Triage Dialog */}
      <Dialog open={showTriageDialog} onOpenChange={setShowTriageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Triage Report: {selectedReport?.referenceNumber}</DialogTitle>
            <DialogDescription>
              Review and assign this citizen report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Report Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm">{selectedReport.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{selectedReport.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedReport.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <div className="mt-1">{getSourceBadge(selectedReport.source)}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedReport.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm mt-1">{selectedReport.location.address}</p>
              </div>

              {/* Triage Actions */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assign-to">Assign To</Label>
                  <Select onValueChange={(value) => handleTriageAction({
                    type: 'assign',
                    reportId: selectedReport.id,
                    value: { id: value, name: 'Staff Member', role: 'Staff' }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff-1">Mike Johnson - Building Maintenance</SelectItem>
                      <SelectItem value="staff-2">Sarah Wilson - Road Maintenance</SelectItem>
                      <SelectItem value="staff-3">Tom Brown - Electrical Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Update Priority</Label>
                  <Select onValueChange={(value) => handleTriageAction({
                    type: 'priority',
                    reportId: selectedReport.id,
                    value: value
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Update Status</Label>
                  <Select onValueChange={(value) => handleTriageAction({
                    type: 'status',
                    reportId: selectedReport.id,
                    value: value
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="note">Add Note</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note about this report..."
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        const content = e.currentTarget.value;
                        if (content.trim()) {
                          handleTriageAction({
                            type: 'note',
                            reportId: selectedReport.id,
                            value: content
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Press Ctrl+Enter to add note
                  </p>
                </div>
              </div>

              {/* Notes History */}
              {selectedReport.notes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <div className="space-y-2 mt-2">
                    {selectedReport.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {note.author} • {formatDate(note.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
