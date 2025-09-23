"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {
  QrCode,
  Camera,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
  Flashlight,
  FlashlightOff,
  RotateCw,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface BarcodeResult {
  type: string;
  data: string;
  timestamp: string;
}

interface BarcodeScannerProps {
  onScan: (result: BarcodeResult) => void;
  onClose?: () => void;
  mode?: 'camera' | 'manual';
}

/**
 * Barcode/QR Code Scanner Component
 * Scan barcodes and QR codes for asset identification
 */
export function BarcodeScanner({ onScan, onClose, mode = 'camera' }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResults, setScanResults] = useState<BarcodeResult[]>([]);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (mode === 'camera') {
      initializeCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [mode]);

  const initializeCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Camera access denied or not available');
      toast.error('Could not access camera');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const toggleFlashlight = async () => {
    if (!streamRef.current) return;
    
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashlightOn }]
        });
        setFlashlightOn(!flashlightOn);
      } else {
        toast.error('Flashlight not supported on this device');
      }
    } catch (error) {
      console.error('Error toggling flashlight:', error);
      toast.error('Could not toggle flashlight');
    }
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast.error('Please enter a code');
      return;
    }

    const result: BarcodeResult = {
      type: 'MANUAL',
      data: manualCode.trim(),
      timestamp: new Date().toISOString(),
    };

    setScanResults(prev => [...prev, result]);
    onScan(result);
    setManualCode("");
    toast.success('Code scanned manually');
  };

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    // Simulate barcode detection on click
    // In a real implementation, this would use a barcode scanning library
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simulate scanning result
    const mockResult: BarcodeResult = {
      type: 'QR_CODE',
      data: `ASSET_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    
    setScanResults(prev => [...prev, mockResult]);
    onScan(mockResult);
    toast.success('Barcode detected');
  };

  const clearResults = () => {
    setScanResults([]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Barcode Scanner</h3>
          
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Camera Mode */}
      {mode === 'camera' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Camera Scanner</CardTitle>
            <CardDescription>
              Point camera at barcode or QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                {scanning ? (
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    onClick={handleVideoClick}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center">
                    {error ? (
                      <div className="text-center text-white">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-sm">{error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={initializeCamera}
                        >
                          <RotateCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                        <p className="text-sm">Initializing camera...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Scanner Overlay */}
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {scanning && (
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFlashlight}
                  >
                    {flashlightOn ? (
                      <FlashlightOff className="h-4 w-4" />
                    ) : (
                      <Flashlight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopCamera}
                  >
                    Stop Camera
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Entry Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manual Entry</CardTitle>
          <CardDescription>
            Enter barcode or QR code manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="manualCode">Barcode/QR Code</Label>
              <Input
                id="manualCode"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter barcode or QR code..."
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
            </div>
            
            <Button onClick={handleManualSubmit} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Add Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Scan Results</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearResults}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" size="sm">
                        {result.type}
                      </Badge>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="font-mono text-sm">{result.data}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleString("en-AU")}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onScan(result)}
                  >
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium text-foreground">Scanning Tips:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure good lighting for camera scanning</li>
              <li>Hold device steady and point directly at the code</li>
              <li>Make sure the code is fully visible in the frame</li>
              <li>Use manual entry if camera scanning fails</li>
              <li>Tap on the camera view to simulate scanning</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
