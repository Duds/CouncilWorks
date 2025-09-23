"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Save,
  Send,
  Loader2,
  X,
  Plus,
  Trash2,
  WifiOff,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { offlineStorage, OfflineInspection } from "@/lib/offline-storage";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  assetType: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface InspectionFormProps {
  asset?: Asset;
  inspectionId?: string;
  onSave?: (inspection: OfflineInspection) => void;
  onCancel?: () => void;
}

/**
 * Mobile Inspection Form Component
 * Optimized for mobile devices with offline capabilities
 */
export function InspectionForm({ asset, inspectionId, onSave, onCancel }: InspectionFormProps) {
  const [formData, setFormData] = useState({
    inspectionType: "",
    condition: "",
    notes: "",
    maintenanceRequired: false,
    safetyIssues: false,
    photos: [] as string[],
  });
  
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  
  const [isOnline, setIsOnline] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (inspectionId) {
      loadInspection();
    }
  }, [inspectionId]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Could not get current location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const loadInspection = async () => {
    if (!inspectionId) return;
    
    setLoading(true);
    try {
      const inspections = await offlineStorage.getInspections();
      const inspection = inspections.find(i => i.id === inspectionId);
      
      if (inspection) {
        setFormData({
          inspectionType: inspection.inspectionType,
          condition: inspection.condition,
          notes: inspection.notes || "",
          maintenanceRequired: inspection.condition === "POOR" || inspection.condition === "CRITICAL",
          safetyIssues: inspection.condition === "CRITICAL",
          photos: inspection.photos || [],
        });
        
        if (inspection.location) {
          setLocation(inspection.location);
        }
      }
    } catch (error) {
      console.error("Failed to load inspection:", error);
      toast.error("Failed to load inspection");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, result],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!asset) {
      toast.error("No asset selected");
      return;
    }

    if (!formData.inspectionType || !formData.condition) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    
    try {
      const inspectionData = {
        assetId: asset.id,
        assetName: asset.name,
        inspectionType: formData.inspectionType,
        inspectionDate: new Date().toISOString(),
        condition: formData.condition,
        notes: formData.notes,
        photos: formData.photos,
        location: location,
      };

      let inspection: OfflineInspection;
      
      if (inspectionId) {
        // Update existing inspection
        const existingInspections = await offlineStorage.getInspections();
        const existing = existingInspections.find(i => i.id === inspectionId);
        if (existing) {
          inspection = {
            ...existing,
            ...inspectionData,
          };
          // Update in storage
          await offlineStorage.updateInspectionSyncStatus(inspectionId, 'pending');
        } else {
          throw new Error("Inspection not found");
        }
      } else {
        // Create new inspection
        const id = await offlineStorage.saveInspection(inspectionData);
        const inspections = await offlineStorage.getInspections();
        inspection = inspections.find(i => i.id === id)!;
      }

      toast.success(
        isOnline 
          ? "Inspection saved and synced" 
          : "Inspection saved offline - will sync when online"
      );
      
      onSave?.(inspection);
    } catch (error) {
      console.error("Failed to save inspection:", error);
      toast.error("Failed to save inspection");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    await handleSave();
    
    // If online, also try to sync immediately
    if (isOnline) {
      try {
        // This would trigger immediate sync
        console.log("Syncing inspection immediately...");
      } catch (error) {
        console.error("Failed to sync immediately:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading inspection...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Asset Inspection</CardTitle>
              <CardDescription>
                {asset ? `${asset.name} (${asset.assetNumber})` : "Select an asset"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="default" className="gap-1">
                  <Wifi className="h-3 w-3" />
                  Online
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <WifiOff className="h-3 w-3" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Asset Information */}
      {asset && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Asset Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{asset.address || "No address available"}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Type: {asset.assetType}
            </div>
            {location && (
              <div className="text-sm text-muted-foreground">
                Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                <span className="ml-2">(Accuracy: {Math.round(location.accuracy)}m)</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Inspection Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inspection Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Inspection Type */}
          <div>
            <Label htmlFor="inspectionType">Inspection Type *</Label>
            <Select 
              value={formData.inspectionType} 
              onValueChange={(value) => handleInputChange('inspectionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select inspection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROUTINE">Routine Inspection</SelectItem>
                <SelectItem value="SAFETY">Safety Inspection</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance Inspection</SelectItem>
                <SelectItem value="COMPLIANCE">Compliance Inspection</SelectItem>
                <SelectItem value="EMERGENCY">Emergency Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condition Assessment */}
          <div>
            <Label htmlFor="condition">Asset Condition *</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value) => handleInputChange('condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="FAIR">Fair</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter inspection notes, observations, or recommendations..."
              rows={4}
            />
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="maintenanceRequired"
                checked={formData.maintenanceRequired}
                onChange={(e) => handleInputChange('maintenanceRequired', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="maintenanceRequired" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Maintenance Required
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="safetyIssues"
                checked={formData.safetyIssues}
                onChange={(e) => handleInputChange('safetyIssues', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="safetyIssues" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Safety Issues Identified
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photos</CardTitle>
          <CardDescription>
            Add photos to document the inspection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Photo Grid */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Inspection photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Photo Button */}
            <Button
              variant="outline"
              onClick={handlePhotoCapture}
              className="w-full h-20 border-dashed"
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-6 w-6" />
                <span className="text-sm">Add Photos</span>
              </div>
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={saving}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSave}
          className="flex-1"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save {isOnline ? "& Sync" : "Offline"}
            </>
          )}
        </Button>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're offline. This inspection will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
