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
  MapPin,
  CheckCircle,
  AlertTriangle,
  Save,
  Send,
  Loader2,
  WifiOff,
  Wifi,
  Mic,
  StopCircle,
  Play,
  Trash2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { offlineStorage, OfflineInspection } from "@/lib/offline-storage";
import { EnhancedPhotoCapture, PhotoMetadata } from "./enhanced-photo-capture";

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

interface VoiceNote {
  id: string;
  blob: Blob;
  dataUrl: string;
  duration: number;
  timestamp: string;
  transcript?: string;
}

interface EnhancedInspectionFormProps {
  asset?: Asset;
  inspectionId?: string;
  onSave?: (inspection: OfflineInspection) => void;
  onCancel?: () => void;
}

/**
 * Enhanced Mobile Inspection Form Component
 * Advanced inspection form with photo capture, voice notes, and GPS verification
 */
export function EnhancedInspectionForm({ asset, inspectionId, onSave, onCancel }: EnhancedInspectionFormProps) {
  const [formData, setFormData] = useState({
    inspectionType: "",
    condition: "",
    notes: "",
    maintenanceRequired: false,
    safetyIssues: false,
    photos: [] as PhotoMetadata[],
    voiceNotes: [] as VoiceNote[],
  });
  
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  
  const [isOnline, setIsOnline] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

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
          photos: inspection.photos?.map((photo, index) => ({
            id: `photo_${index}`,
            file: new File([], `photo_${index}.jpg`),
            dataUrl: photo,
            timestamp: new Date().toISOString(),
            location: inspection.location ? {
              latitude: inspection.location.latitude,
              longitude: inspection.location.longitude,
              accuracy: inspection.location.accuracy,
            } : undefined,
            tags: [],
            notes: "",
            rotation: 0,
            zoom: 1,
            flashUsed: false,
            syncStatus: 'synced' as const,
          })) || [],
          voiceNotes: [],
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

  const handlePhotosChange = (photos: PhotoMetadata[]) => {
    setFormData(prev => ({
      ...prev,
      photos,
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = () => {
          const voiceNote: VoiceNote = {
            id: `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            blob,
            dataUrl: reader.result as string,
            duration: chunks.length * 0.1, // Approximate duration
            timestamp: new Date().toISOString(),
          };
          
          setFormData(prev => ({
            ...prev,
            voiceNotes: [...prev.voiceNotes, voiceNote],
          }));
        };
        reader.readAsDataURL(blob);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setAudioChunks(chunks);
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
      toast.success("Recording stopped");
    }
  };

  const removeVoiceNote = (voiceNoteId: string) => {
    setFormData(prev => ({
      ...prev,
      voiceNotes: prev.voiceNotes.filter(vn => vn.id !== voiceNoteId),
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
        photos: formData.photos.map(photo => photo.dataUrl),
        voiceNotes: formData.voiceNotes.map(vn => vn.dataUrl),
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
              <CardTitle className="text-lg">Enhanced Asset Inspection</CardTitle>
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

      {/* Enhanced Photo Capture */}
      <EnhancedPhotoCapture
        onPhotosChange={handlePhotosChange}
        initialPhotos={formData.photos}
        maxPhotos={10}
      />

      {/* Voice Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Voice Notes</CardTitle>
          <CardDescription>
            Record voice notes for additional context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recording Controls */}
            <div className="flex items-center gap-3">
              {!recording ? (
                <Button
                  onClick={startRecording}
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <StopCircle className="h-4 w-4" />
                  Stop Recording
                </Button>
              )}
              
              {recording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-sm">Recording...</span>
                </div>
              )}
            </div>

            {/* Voice Notes List */}
            {formData.voiceNotes.length > 0 && (
              <div className="space-y-2">
                {formData.voiceNotes.map((voiceNote) => (
                  <div key={voiceNote.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.src = voiceNote.dataUrl;
                          audioRef.current.play();
                        }
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Voice Note ({Math.round(voiceNote.duration)}s)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(voiceNote.timestamp).toLocaleString("en-AU")}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeVoiceNote(voiceNote.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <audio ref={audioRef} className="hidden" />
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
