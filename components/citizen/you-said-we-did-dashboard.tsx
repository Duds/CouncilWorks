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
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Search,
  Filter,
  Loader2,
  Eye,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface CompletedReport {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  completedAt: string;
  location: {
    address: string;
    suburb: string;
  };
  reporter: {
    name: string;
    isAnonymous: boolean;
  };
  assignedTo: string;
  resolution: string;
  impact: {
    peopleAffected: number;
    costSavings?: number;
    improvement: string;
  };
  beforeImage?: string;
  afterImage?: string;
  testimonial?: {
    quote: string;
    author: string;
  };
}

interface DashboardStats {
  totalReportsCompleted: number;
  reportsThisMonth: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  totalPeopleHelped: number;
  costSavings: number;
}

/**
 * You Said, We Did Dashboard Component
 * Public dashboard showing completed citizen reports and their impact
 */
export function YouSaidWeDidDashboard() {
  const [reports, setReports] = useState<CompletedReport[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [suburbFilter, setSuburbFilter] = useState("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockReports: CompletedReport[] = [
        {
          id: '1',
          title: 'Pothole Repaired on Main Street',
          description: 'Large pothole causing damage to vehicles near the intersection with Oak Street',
          category: 'road-maintenance',
          priority: 'high',
          submittedAt: '2025-01-10T09:30:00Z',
          completedAt: '2025-01-18T16:45:00Z',
          location: {
            address: '123 Main Street',
            suburb: 'Anytown',
          },
          reporter: {
            name: 'John Smith',
            isAnonymous: false,
          },
          assignedTo: 'Road Maintenance Team',
          resolution: 'Pothole filled and road surface restored. Additional inspection conducted for similar issues in the area.',
          impact: {
            peopleAffected: 150,
            costSavings: 25000,
            improvement: 'Reduced vehicle damage and improved road safety',
          },
          beforeImage: '/images/pothole-before.jpg',
          afterImage: '/images/pothole-after.jpg',
          testimonial: {
            quote: 'Thank you for the quick response! The road is much safer now.',
            author: 'John Smith',
          },
        },
        {
          id: '2',
          title: 'Street Light Restored in Park Lane',
          description: 'Broken street light leaving the area in darkness',
          category: 'street-lighting',
          priority: 'medium',
          submittedAt: '2025-01-08T18:20:00Z',
          completedAt: '2025-01-12T14:30:00Z',
          location: {
            address: '45 Park Lane',
            suburb: 'Greenville',
          },
          reporter: {
            name: 'Anonymous',
            isAnonymous: true,
          },
          assignedTo: 'Electrical Services',
          resolution: 'Street light replaced with energy-efficient LED fixture. Additional maintenance check conducted on nearby lights.',
          impact: {
            peopleAffected: 80,
            improvement: 'Improved safety and security in the area',
          },
          testimonial: {
            quote: 'Much safer walking home at night now. Great work!',
            author: 'Local Resident',
          },
        },
        {
          id: '3',
          title: 'Playground Equipment Fixed',
          description: 'Broken swing set in community playground',
          category: 'parks-recreation',
          priority: 'medium',
          submittedAt: '2025-01-05T10:15:00Z',
          completedAt: '2025-01-15T11:20:00Z',
          location: {
            address: 'Community Park',
            suburb: 'Sunnyvale',
          },
          reporter: {
            name: 'Sarah Johnson',
            isAnonymous: false,
          },
          assignedTo: 'Parks & Recreation Team',
          resolution: 'Swing set repaired and safety inspection completed. All playground equipment checked for similar issues.',
          impact: {
            peopleAffected: 200,
            improvement: 'Children can safely enjoy the playground again',
          },
          testimonial: {
            quote: 'My kids are so happy to be able to play on the swings again!',
            author: 'Sarah Johnson',
          },
        },
        {
          id: '4',
          title: 'Graffiti Removed from Community Center',
          description: 'Inappropriate graffiti on the community center wall',
          category: 'building-maintenance',
          priority: 'low',
          submittedAt: '2025-01-03T14:45:00Z',
          completedAt: '2025-01-09T10:15:00Z',
          location: {
            address: 'Community Center',
            suburb: 'Riverside',
          },
          reporter: {
            name: 'Anonymous',
            isAnonymous: true,
          },
          assignedTo: 'Building Maintenance',
          resolution: 'Graffiti removed and wall repainted. Security measures reviewed to prevent future incidents.',
          impact: {
            peopleAffected: 120,
            improvement: 'Cleaner, more welcoming community space',
          },
        },
      ];

      const mockStats: DashboardStats = {
        totalReportsCompleted: 1247,
        reportsThisMonth: 89,
        averageResolutionTime: 8.5,
        satisfactionRate: 94.2,
        totalPeopleHelped: 15420,
        costSavings: 485000,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
      setStats(mockStats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'road-maintenance', label: 'Road Maintenance' },
    { value: 'street-lighting', label: 'Street Lighting' },
    { value: 'parks-recreation', label: 'Parks & Recreation' },
    { value: 'building-maintenance', label: 'Building Maintenance' },
    { value: 'waste-management', label: 'Waste Management' },
  ];

  const suburbs = [
    { value: 'all', label: 'All Suburbs' },
    { value: 'Anytown', label: 'Anytown' },
    { value: 'Greenville', label: 'Greenville' },
    { value: 'Sunnyvale', label: 'Sunnyvale' },
    { value: 'Riverside', label: 'Riverside' },
  ];

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
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
      day: 'numeric'
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesSuburb = suburbFilter === 'all' || report.location.suburb === suburbFilter;
    
    return matchesSearch && matchesCategory && matchesSuburb;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">You Said, We Did</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how your reports are making a difference in our community. 
          Every issue you report helps us improve services for everyone.
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalReportsCompleted}</div>
                <div className="text-sm text-gray-600">Reports Completed</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.reportsThisMonth}</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.averageResolutionTime}</div>
                <div className="text-sm text-gray-600">Avg. Days to Resolve</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.satisfactionRate}%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalPeopleHelped.toLocaleString()}</div>
                <div className="text-sm text-gray-600">People Helped</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">${(stats.costSavings / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Cost Savings</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search completed reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={suburbFilter} onValueChange={setSuburbFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {suburbs.map((suburb) => (
                  <SelectItem key={suburb.value} value={suburb.value}>
                    {suburb.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Completed Reports */}
      <div className="grid gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <CardDescription>
                    {getCategoryLabel(report.category)} • {report.location.suburb}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Badge variant="default">Completed</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What you reported:</h4>
                <p className="text-gray-600">{report.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What we did:</h4>
                <p className="text-gray-600">{report.resolution}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{report.location.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Completed {formatDate(report.completedAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{report.impact.peopleAffected} people helped</span>
                </div>
              </div>
              
              {report.testimonial && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <blockquote className="text-gray-700 italic">
                        "{report.testimonial.quote}"
                      </blockquote>
                      <cite className="text-sm text-gray-600 mt-1 block">
                        — {report.testimonial.author}
                      </cite>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Reported by {report.reporter.isAnonymous ? 'Anonymous' : report.reporter.name}</span>
                  <span>•</span>
                  <span>Assigned to {report.assignedTo}</span>
                </div>
                
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Have an issue to report?</h3>
            <p className="text-blue-100 mb-6">
              Help us make our community even better by reporting issues you encounter.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Submit a Report
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Track Existing Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
