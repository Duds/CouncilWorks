'use client';

import AppLayout from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  Shield,
  Target,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Asset Register Page
 *
 * Purpose-driven asset search and discovery interface showcasing Rule 1: Every Asset Has a Purpose
 * Provides asset lookup by service purpose, not just asset type
 */
export default function AssetRegisterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock asset data demonstrating purpose-driven organization
  const mockAssets = [
    {
      id: 'A001',
      name: 'Main Water Treatment Plant',
      assetType: 'Water Infrastructure',
      purpose: 'Safe Drinking Water Control',
      condition: 'GOOD',
      criticality: 'CRITICAL',
      location: 'Industrial Zone',
      lastInspection: '2024-12-01',
      nextInspection: '2024-12-08',
      riskScore: 25,
    },
    {
      id: 'A002',
      name: 'City Centre Traffic Lights',
      assetType: 'Traffic Control',
      purpose: 'Road Safety Control',
      condition: 'FAIR',
      criticality: 'HIGH',
      location: 'City Centre',
      lastInspection: '2024-11-28',
      nextInspection: '2024-12-05',
      riskScore: 45,
    },
    {
      id: 'A003',
      name: 'Community Swimming Pool',
      assetType: 'Recreation Facility',
      purpose: 'Community Recreation Control',
      condition: 'EXCELLENT',
      criticality: 'MEDIUM',
      location: 'Recreation Centre',
      lastInspection: '2024-11-15',
      nextInspection: '2024-12-15',
      riskScore: 15,
    },
  ];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return 'text-green-600';
      case 'GOOD':
        return 'text-blue-600';
      case 'FAIR':
        return 'text-yellow-600';
      case 'POOR':
        return 'text-orange-600';
      case 'CRITICAL':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'GOOD':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'FAIR':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'POOR':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'outline';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredAssets = mockAssets.filter(asset => {
    return (
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Asset Register"
      description="Purpose-driven asset search and management"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Asset Register
            </h1>
            <p className="text-muted-foreground">
              Comprehensive asset register with purpose-driven organization
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Rule 1: Every Asset Has a Purpose
            </Badge>
            <Button variant="outline" size="sm">
              <Building2 className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Purpose-Driven Asset Search
            </CardTitle>
            <CardDescription>
              Search for assets by their service purpose, contribution, or
              function
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by purpose, asset name, or type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Asset Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map(asset => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {asset.assetType}
                    </CardDescription>
                  </div>
                  <Badge variant={getCriticalityBadge(asset.criticality)}>
                    {asset.criticality}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Service Purpose
                    </div>
                    <p className="text-sm">{asset.purpose}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getConditionIcon(asset.condition)}
                      <span
                        className={`text-sm font-medium ${getConditionColor(asset.condition)}`}
                      >
                        {asset.condition}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Risk: {asset.riskScore}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{asset.location}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Next:{' '}
                      {new Date(asset.nextInspection).toLocaleDateString(
                        'en-AU'
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Target className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
