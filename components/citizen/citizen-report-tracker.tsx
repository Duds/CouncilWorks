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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  User,
  Calendar,
  MessageSquare,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface ReportStatus {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'completed' | 'closed';
  submittedAt: string;
  lastUpdated: string;
  estimatedResolution?: string;
  actualResolution?: string;
  assignedTo?: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

/**
 * Citizen Report Status Tracker Component
 * Allows citizens to track the progress of their submitted reports
 */
export function CitizenReportTracker() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'reference' | 'email'>('reference');

  const mockReportData: ReportStatus = {
    id: 'report-123456',
    referenceNumber: 'REF-ABC123XYZ',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing damage to vehicles near the intersection with Oak Street',
    category: 'road-maintenance',
    priority: 'high',
    status: 'in-progress',
    submittedAt: '2025-01-10T09:30:00Z',
    lastUpdated: '2025-01-13T14:20:00Z',
    estimatedResolution: '2025-01-20T17:00:00Z',
    assignedTo: 'Road Maintenance Team',
    location: {
      address: '123 Main Street, Anytown, NSW 2000',
      lat: -33.8688,
      lng: 151.2093,
    },
    contactInfo: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '0400 000 000',
    },
    statusHistory: [
      {
        status: 'submitted',
        timestamp: '2025-01-10T09:30:00Z',
        note: 'Report submitted via citizen portal',
        updatedBy: 'System',
      },
      {
        status: 'acknowledged',
        timestamp: '2025-01-10T10:15:00Z',
        note: 'Report received and assigned reference number',
        updatedBy: 'Sarah Johnson',
      },
      {
        status: 'in-progress',
        timestamp: '2025-01-12T08:30:00Z',
        note: 'Site inspection completed. Work order created for repairs.',
        updatedBy: 'Mike Wilson',
      },
      {
        status: 'in-progress',
        timestamp: '2025-01-13T14:20:00Z',
        note: 'Materials ordered. Work scheduled for next week.',
        updatedBy: 'Mike Wilson',
      },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'pothole-photo.jpg',
        type: 'image/jpeg',
        url: '/uploads/pothole-photo.jpg',
        uploadedAt: '2025-01-10T09:30:00Z',
      },
    ],
  };

  const handleSearch = async () => {
    if (searchMethod === 'reference' && !referenceNumber.trim()) {
      toast.error("Please enter a reference number");
      return;
    }
    
    if (searchMethod === 'email' && !email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, return mock data if reference matches
      if (referenceNumber === 'REF-ABC123XYZ' || email === 'john.smith@email.com') {
        setReportStatus(mockReportData);
        toast.success("Report found!");
      } else {
        setReportStatus(null);
        toast.error("No report found with the provided information");
      }
    } catch (error) {
      console.error("Failed to search report:", error);
      toast.error("Failed to search for report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'acknowledged': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'closed': return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted': return <Badge variant="secondary">Submitted</Badge>;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Track Your Report</CardTitle>
          <CardDescription>
            Enter your reference number or email address to check the status of your report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Search Method</Label>
              <Select value={searchMethod} onValueChange={(value: any) => setSearchMethod(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reference">Reference Number</SelectItem>
                  <SelectItem value="email">Email Address</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {searchMethod === 'reference' ? (
              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="e.g., REF-ABC123XYZ"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleSearch} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" mr-2 />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Status Display */}
      {reportStatus && (
        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{reportStatus.title}</CardTitle>
                  <CardDescription>
                    Reference: {reportStatus.referenceNumber}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(reportStatus.status)}
                  {getStatusBadge(reportStatus.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Priority</Label>
                  <div className="mt-1">
                    {getPriorityBadge(reportStatus.priority)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Submitted</Label>
                  <p className="text-sm">{formatDate(reportStatus.submittedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                  <p className="text-sm">{formatDate(reportStatus.lastUpdated)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Timeline</CardTitle>
              <CardDescription>
                Track the progress of your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportStatus.statusHistory.map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {getStatusIcon(entry.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">
                          {entry.status.replace('-', ' ')}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                      )}
                      {entry.updatedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated by: {entry.updatedBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-sm mt-1">{reportStatus.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Location</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{reportStatus.location.address}</span>
                </div>
              </div>

              {reportStatus.assignedTo && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Assigned To</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{reportStatus.assignedTo}</span>
                  </div>
                </div>
              )}

              {reportStatus.estimatedResolution && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estimated Resolution</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{formatDate(reportStatus.estimatedResolution)}</span>
                  </div>
                </div>
              )}

              {reportStatus.attachments.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Attachments</Label>
                  <div className="mt-2 space-y-2">
                    {reportStatus.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{attachment.name}</span>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Reporter</Label>
                  <p className="text-sm">{reportStatus.contactInfo.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{reportStatus.contactInfo.email}</p>
                </div>
                {reportStatus.contactInfo.phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-sm">{reportStatus.contactInfo.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results */}
      {reportStatus === null && !loading && (referenceNumber || email) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Report Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find a report matching your search criteria.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Please check that you've entered the correct:</p>
                <ul className="list-disc list-inside">
                  <li>Reference number (case sensitive)</li>
                  <li>Email address (exactly as provided during submission)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
