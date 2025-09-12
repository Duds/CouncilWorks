"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Smartphone, Key } from "lucide-react";

interface MFAVerificationProps {
  onVerify: (token: string) => Promise<void>;
  onBackupCode: (code: string) => Promise<void>;
  loading?: boolean;
}

/**
 * MFA Verification Component
 * Handles MFA token verification during login
 */
export function MFAVerification({ onVerify, onBackupCode, loading = false }: MFAVerificationProps) {
  const [token, setToken] = useState<string>("");
  const [backupCode, setBackupCode] = useState<string>("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState<string>("");

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length !== 6) {
      setError("Please enter a valid 6-digit token");
      return;
    }
    
    setError("");
    try {
      await onVerify(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid token");
    }
  };

  const handleBackupCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupCode.trim()) {
      setError("Please enter a backup code");
      return;
    }
    
    setError("");
    try {
      await onBackupCode(backupCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid backup code");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Enter the verification code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!useBackupCode ? (
            <>
              <form onSubmit={handleTokenSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">6-digit verification code:</Label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center font-mono text-lg"
                    autoComplete="one-time-code"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || token.length !== 6} 
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setUseBackupCode(true)}
                  className="text-sm"
                >
                  Use backup code instead
                </Button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleBackupCodeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backupCode">Backup code:</Label>
                  <Input
                    id="backupCode"
                    value={backupCode}
                    onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                    placeholder="Enter backup code"
                    className="font-mono"
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || !backupCode.trim()} 
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Use Backup Code"}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setUseBackupCode(false)}
                  className="text-sm"
                >
                  Use authenticator app instead
                </Button>
              </div>
            </>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Don't have access to your authenticator app?</p>
            <p>Use one of your backup codes to sign in.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
