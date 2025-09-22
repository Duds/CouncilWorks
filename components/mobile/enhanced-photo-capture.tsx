"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  MapPin,
  Clock,
  Tag,
  Trash2,
  Edit3,
  Save,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Flashlight,
  FlashlightOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getDynamicTransformStyle } from "@/lib/dynamic-styles";

interface PhotoMetadata {
  id: string;
  file: File;
  dataUrl: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  tags: string[];
  notes: string;
  rotation: number;
  zoom: number;
  flashUsed: boolean;
  syncStatus: 'pending' | 'synced' | 'failed';
}

interface EnhancedPhotoCaptureProps {
  onPhotosChange: (photos: PhotoMetadata[]) => void;
  initialPhotos?: PhotoMetadata[];
  maxPhotos?: number;
}

/**
 * Enhanced Photo Capture Component
 * Advanced photo capture with GPS tagging, metadata, and editing capabilities
 */
export function EnhancedPhotoCapture({ 
  onPhotosChange, 
  initialPhotos = [], 
  maxPhotos = 10 
}: EnhancedPhotoCaptureProps) {
  const [photos, setPhotos] = useState<PhotoMetadata[]>(initialPhotos);
  const [editingPhoto, setEditingPhoto] = useState<PhotoMetadata | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<PermissionState>('prompt');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onPhotosChange(photos);
    checkLocationPermission();
    getCurrentLocation();
  }, [photos, onPhotosChange]);

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationPermission(permission.state);
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Could not get current location');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (photos.length + files.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        processPhotoFile(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processPhotoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const photo: PhotoMetadata = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        dataUrl,
        timestamp: new Date().toISOString(),
        location: currentLocation ? {
          ...currentLocation,
          address: undefined, // Would be reverse geocoded
        } : undefined,
        tags: [],
        notes: '',
        rotation: 0,
        zoom: 1,
        flashUsed: false,
        syncStatus: 'pending',
      };
      
      setPhotos(prev => [...prev, photo]);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileCapture = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    if (editingPhoto?.id === photoId) {
      setEditingPhoto(null);
    }
  };

  const startEditing = (photo: PhotoMetadata) => {
    setEditingPhoto(photo);
  };

  const savePhotoEdit = (updatedPhoto: PhotoMetadata) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
    setEditingPhoto(null);
    toast.success('Photo updated');
  };

  const rotatePhoto = (photoId: string, direction: 'left' | 'right') => {
    setPhotos(prev => prev.map(photo => {
      if (photo.id === photoId) {
        const rotationDelta = direction === 'right' ? 90 : -90;
        return {
          ...photo,
          rotation: (photo.rotation + rotationDelta) % 360,
        };
      }
      return photo;
    }));
  };

  const addTag = (photoId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setPhotos(prev => prev.map(photo => {
      if (photo.id === photoId && !photo.tags.includes(tag)) {
        return {
          ...photo,
          tags: [...photo.tags, tag],
        };
      }
      return photo;
    }));
  };

  const removeTag = (photoId: string, tag: string) => {
    setPhotos(prev => prev.map(photo => {
      if (photo.id === photoId) {
        return {
          ...photo,
          tags: photo.tags.filter(t => t !== tag),
        };
      }
      return photo;
    }));
  };

  const getLocationStatus = () => {
    if (!currentLocation) return { status: 'error', text: 'No location' };
    if (currentLocation.accuracy > 100) return { status: 'warning', text: 'Low accuracy' };
    return { status: 'success', text: 'Good location' };
  };

  const locationStatus = getLocationStatus();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Photos ({photos.length}/{maxPhotos})</h3>
          <p className="text-sm text-muted-foreground">Capture photos with GPS metadata</p>
        </div>
        <div className="flex items-center gap-2">
          {currentLocation && (
            <Badge 
              variant={locationStatus.status === 'success' ? 'default' : 'secondary'}
              className="gap-1"
            >
              <MapPin className="h-3 w-3" />
              {locationStatus.text}
            </Badge>
          )}
        </div>
      </div>

      {/* Capture Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCameraCapture}
              className="h-16 flex-col gap-2"
              disabled={capturing}
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm">Take Photo</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFileCapture}
              className="h-16 flex-col gap-2"
              disabled={capturing}
            >
              <Edit3 className="h-6 w-6" />
              <span className="text-sm">Choose File</span>
            </Button>
          </div>
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={photo.dataUrl}
                  alt={`Inspection photo ${photo.id}`}
                  className="w-full h-32 object-cover dynamic-transform"
                  style={getDynamicTransformStyle(`rotate(${photo.rotation}deg)`)}
                />
                
                {/* Photo Overlay */}
                <div className="absolute top-2 left-2 right-2 flex justify-between">
                  <div className="flex gap-1">
                    {photo.location && (
                      <Badge variant="secondary" size="sm" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        GPS
                      </Badge>
                    )}
                    {photo.tags.length > 0 && (
                      <Badge variant="outline" size="sm">
                        {photo.tags.length} tags
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0"
                      onClick={() => startEditing(photo)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Sync Status */}
                <div className="absolute bottom-2 right-2">
                  {photo.syncStatus === 'synced' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {photo.syncStatus === 'pending' && (
                    <Clock className="h-4 w-4 text-orange-600" />
                  )}
                  {photo.syncStatus === 'failed' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground mb-2">
                  {new Date(photo.timestamp).toLocaleString("en-AU")}
                </div>
                
                {photo.location && (
                  <div className="text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {photo.location.latitude.toFixed(6)}, {photo.location.longitude.toFixed(6)}
                    <span className="ml-2">(±{Math.round(photo.location.accuracy)}m)</span>
                  </div>
                )}
                
                {photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Editor Modal */}
      {editingPhoto && (
        <PhotoEditor
          photo={editingPhoto}
          onSave={savePhotoEdit}
          onCancel={() => setEditingPhoto(null)}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onRotate={rotatePhoto}
        />
      )}
    </div>
  );
}

/**
 * Photo Editor Component
 * Edit photo metadata, tags, and notes
 */
interface PhotoEditorProps {
  photo: PhotoMetadata;
  onSave: (photo: PhotoMetadata) => void;
  onCancel: () => void;
  onAddTag: (photoId: string, tag: string) => void;
  onRemoveTag: (photoId: string, tag: string) => void;
  onRotate: (photoId: string, direction: 'left' | 'right') => void;
}

function PhotoEditor({ 
  photo, 
  onSave, 
  onCancel, 
  onAddTag, 
  onRemoveTag, 
  onRotate 
}: PhotoEditorProps) {
  const [editedPhoto, setEditedPhoto] = useState<PhotoMetadata>(photo);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    onSave(editedPhoto);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(photo.id, newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-lg">Edit Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Preview */}
          <div className="relative">
            <img
              src={editedPhoto.dataUrl}
              alt="Photo preview"
              className="w-full h-48 object-cover rounded-lg dynamic-transform"
              style={getDynamicTransformStyle(`rotate(${editedPhoto.rotation}deg)`)}
            />
            
            {/* Rotation Controls */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onRotate(photo.id, 'left')}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onRotate(photo.id, 'right')}
              >
                <RotateCw className="h-4 w-4 dynamic-transform" style={getDynamicTransformStyle('scaleX(-1)')} />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editedPhoto.notes}
              onChange={(e) => setEditedPhoto(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add notes about this photo..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            
            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {photo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => onRemoveTag(photo.id, tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Location Info */}
          {photo.location && (
            <div>
              <Label>Location</Label>
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>GPS Coordinates</span>
                </div>
                <div>Lat: {photo.location.latitude.toFixed(6)}</div>
                <div>Lng: {photo.location.longitude.toFixed(6)}</div>
                <div>Accuracy: ±{Math.round(photo.location.accuracy)}m</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
