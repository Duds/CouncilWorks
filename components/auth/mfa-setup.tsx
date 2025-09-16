"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Shield, Smartphone, Key } from "lucide-react";

interface MFASetupProps {
  onComplete: () => void;
}

/**
 * MFA Setup Component
 * Guides users through setting up multi-factor authentication
 */
export function MFASetup({ onComplete }: MFASetupProps) {
  const [step, setStep] = useState<"setup" | "verify" | "backup" | "complete">("setup");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateSecret = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to generate MFA secret");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const enableMFA = async () => {
    if (!token || token.length !== 6) {
      setError("Please enter a valid 6-digit token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/mfa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enable MFA");
      }

      const data = await response.json();
      setBackupCodes(data.status.backupCodesCount > 0 ? [] : await getBackupCodes());
      setStep("backup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getBackupCodes = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/mfa/backup-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to get backup codes");
      }

      const data = await response.json();
      return data.codes;
    } catch {
      return [];
    }
  };

  const completeSetup = () => {
    setStep("complete");
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Enable Multi-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account with MFA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How MFA works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>• Scan the QR code or enter the secret key</li>
                <li>• Use the 6-digit code from your app to verify</li>
                <li>• Save backup codes for emergency access</li>
              </ul>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={generateSecret} disabled={loading} className="w-full">
              {loading ? "Generating..." : "Start Setup"}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "verify" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Scan QR Code
            </CardTitle>
            <CardDescription>
              Use your authenticator app to scan this QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCode && (
              <div className="flex justify-center">
                <img src={qrCode} alt="MFA QR Code" className="border rounded" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="secret">Or enter this secret key manually:</Label>
              <Input
                id="secret"
                value={secret}
                readOnly
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Enter the 6-digit code from your app:</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="text-center font-mono text-lg"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("setup")} className="flex-1">
                Back
              </Button>
              <Button onClick={enableMFA} disabled={loading || token.length !== 6} className="flex-1">
                {loading ? "Verifying..." : "Enable MFA"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "backup" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Backup Codes
            </CardTitle>
            <CardDescription>
              Save these backup codes in a secure location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                These codes can be used to access your account if you lose your authenticator device. 
                Each code can only be used once.
              </AlertDescription>
            </Alert>

            {backupCodes.length > 0 && (
              <div className="space-y-2">
                <Label>Your backup codes:</Label>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={completeSetup} className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "complete" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">MFA Enabled Successfully!</h3>
                <p className="text-muted-foreground">
                  Your account is now protected with multi-factor authentication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
