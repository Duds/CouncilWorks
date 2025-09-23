"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getAvatarImage, getUserInitials, handleAvatarError } from "@/lib/avatar-utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phoneNumber: string | null;
  bio: string | null;
  timezone: string;
  language: string;
  notificationPreferences: any;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
  maintenanceUpdates: boolean;
}

/**
 * Profile Management Component
 * Allows users to update their profile information and preferences
 */
export function ProfileManagement() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true,
    securityAlerts: true,
    maintenanceUpdates: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    bio: "",
    timezone: "Australia/Sydney",
    language: "en-AU",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        bio: data.bio || "",
        timezone: data.timezone || "Australia/Sydney",
        language: data.language || "en-AU",
      });

      if (data.notificationPreferences) {
        setNotifications(data.notificationPreferences);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async (key: keyof NotificationPreferences, value: boolean) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      const response = await fetch("/api/profile/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNotifications),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification preferences");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update preferences");
      // Revert the change
      setNotifications(notifications);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('File size must be less than 2MB');
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload avatar');
      }

      const result = await response.json();

      // Update the profile with new avatar URL
      setProfile(prev => prev ? { ...prev, image: result.avatarUrl } : null);
      setSuccess('Avatar updated successfully');

      // Refresh the page to update the session
      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleAvatarRemoval = async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove avatar');
      }

      // Update the profile to remove avatar
      setProfile(prev => prev ? { ...prev, image: null } : null);
      setSuccess('Avatar removed successfully');

      // Refresh the page to update the session
      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove avatar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load profile. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="mfa" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={getAvatarImage(profile.image)}
                    alt={profile.name || "User avatar"}
                    onError={() => handleAvatarError(profile.image)}
                  />
                  <AvatarFallback>
                    {getUserInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={saving}
                    aria-label="Upload avatar image"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-2"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={saving}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {saving ? "Uploading..." : "Change Photo"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, GIF or WebP. Max size 2MB.
                  </p>
                  {profile.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-destructive hover:text-destructive"
                      onClick={handleAvatarRemoval}
                      disabled={saving}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{profile.email}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+61 4XX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md"
                      title="Select your timezone"
                    >
                      <option value="Australia/Sydney">Australia/Sydney</option>
                      <option value="Australia/Melbourne">Australia/Melbourne</option>
                      <option value="Australia/Brisbane">Australia/Brisbane</option>
                      <option value="Australia/Perth">Australia/Perth</option>
                      <option value="Australia/Adelaide">Australia/Adelaide</option>
                      <option value="Australia/Darwin">Australia/Darwin</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md"
                      title="Select your language preference"
                    >
                      <option value="en-AU">English (Australia)</option>
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("smsNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("pushNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary emails
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("weeklyDigest", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="security-alerts">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security notifications
                    </p>
                  </div>
                  <Switch
                    id="security-alerts"
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("securityAlerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="maintenance-updates">Maintenance Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      System maintenance notifications
                    </p>
                  </div>
                  <Switch
                    id="maintenance-updates"
                    checked={notifications.maintenanceUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("maintenanceUpdates", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityComponent />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <SessionsComponent />
        </TabsContent>

        <TabsContent value="mfa" className="mt-6">
          <MFAComponent />
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <PasswordComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * MFA Component
 * Handles multi-factor authentication setup and management
 */
function MFAComponent() {
  const [mfaStatus, setMfaStatus] = useState<{
    enabled: boolean;
    verifiedAt: string | null;
    backupCodesCount: number;
  } | null>(null);
  const [setupStep, setSetupStep] = useState<'status' | 'setup' | 'verify' | 'backup'>('status');
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationToken, setVerificationToken] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [copied, setCopied] = useState<string>("");

  useEffect(() => {
    fetchMFAStatus();
  }, []);

  const fetchMFAStatus = async () => {
    try {
      const response = await fetch("/api/mfa");
      if (!response.ok) {
        throw new Error("Failed to fetch MFA status");
      }
      const status = await response.json();
      setMfaStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load MFA status");
    } finally {
      setLoading(false);
    }
  };

  const startMFASetup = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/mfa", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate MFA secret");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setSetupStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start MFA setup");
    } finally {
      setSaving(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/mfa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enable MFA");
      }

      const data = await response.json();
      setSuccess("MFA enabled successfully!");
      setSetupStep('backup');

      // Generate backup codes
      const backupResponse = await fetch("/api/mfa/backup-codes", {
        method: "POST",
      });

      if (backupResponse.ok) {
        const backupData = await backupResponse.json();
        setBackupCodes(backupData.codes);
      }

      // Refresh MFA status
      await fetchMFAStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable MFA");
    } finally {
      setSaving(false);
    }
  };

  const disableMFA = async () => {
    if (!confirm("Are you sure you want to disable MFA? This will make your account less secure.")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/mfa", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to disable MFA");
      }

      setSuccess("MFA disabled successfully");
      await fetchMFAStatus();
      setSetupStep('status');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable MFA");
    } finally {
      setSaving(false);
    }
  };

  const generateNewBackupCodes = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/mfa/backup-codes", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate backup codes");
      }

      const data = await response.json();
      setBackupCodes(data.codes);
      setSuccess("New backup codes generated successfully");
      await fetchMFAStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate backup codes");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Multi-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enhance your account security with MFA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {setupStep === 'status' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className={`h-5 w-5 ${mfaStatus?.enabled ? 'text-green-600' : 'text-muted-foreground'}`} />
                <div>
                  <h3 className="font-medium">MFA Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {mfaStatus?.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {mfaStatus?.enabled ? (
                  <Button variant="outline" onClick={disableMFA} disabled={saving}>
                    Disable MFA
                  </Button>
                ) : (
                  <Button onClick={startMFASetup} disabled={saving}>
                    <Key className="h-4 w-4 mr-2" />
                    Enable MFA
                  </Button>
                )}
              </div>
            </div>

            {mfaStatus?.enabled && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Backup Codes</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You have {mfaStatus.backupCodesCount} backup codes remaining.
                  </p>
                  <Button variant="outline" size="sm" onClick={generateNewBackupCodes} disabled={saving}>
                    Generate New Codes
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {setupStep === 'verify' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Set Up Authenticator App</h3>
              <p className="text-muted-foreground mb-4">
                Scan the QR code with your authenticator app or enter the secret key manually.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="font-medium mb-2">QR Code</h4>
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  {qrCode && <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-medium mb-2">Secret Key</h4>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {secret}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(secret, 'secret')}
                >
                  {copied === 'secret' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied === 'secret' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="verification-token">Enter 6-digit code from your authenticator app</Label>
                <Input
                  id="verification-token"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={verifyAndEnableMFA} disabled={saving || verificationToken.length !== 6}>
                  {saving ? "Verifying..." : "Verify & Enable MFA"}
                </Button>
                <Button variant="outline" onClick={() => setSetupStep('status')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {setupStep === 'backup' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Save Your Backup Codes</h3>
              <p className="text-muted-foreground mb-4">
                These codes can be used to access your account if you lose your authenticator device.
                Save them in a secure location.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-background rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Each backup code can only be used once.
                Store them securely and don't share them with anyone.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={() => setSetupStep('status')}>
                Done
              </Button>
              <Button variant="outline" onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}>
                {copied === 'backup' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied === 'backup' ? 'Copied!' : 'Copy All Codes'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Activity Component
 * Displays user activity log
 */
function ActivityComponent() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/profile/activity");
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
        return <LogOut className="h-4 w-4 text-green-600" />;
      case "USER_LOGOUT":
        return <LogOut className="h-4 w-4 text-red-600" />;
      case "USER_UPDATED":
        return <User className="h-4 w-4 text-blue-600" />;
      case "USER_PASSWORD_RESET":
        return <Lock className="h-4 w-4 text-orange-600" />;
      case "MFA_ENABLED":
      case "MFA_DISABLED":
        return <Key className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Recent account activity and security events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                  {activity.ipAddress && (
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.ipAddress}
                      </div>
                      {activity.userAgent && (
                        <div className="truncate max-w-xs">
                          {activity.userAgent.split(" ")[0]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Sessions Component
 * Displays and manages user sessions
 */
function SessionsComponent() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/profile/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      const data = await response.json();
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to revoke this session?")) {
      return;
    }

    setRevoking(sessionId);
    try {
      const response = await fetch(`/api/profile/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to revoke session");
      }

      // Remove session from list
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke session");
    } finally {
      setRevoking(null);
    }
  };

  const revokeAllOtherSessions = async () => {
    if (!confirm("Are you sure you want to revoke all other sessions? This will sign you out of all other devices.")) {
      return;
    }

    setRevoking("all");
    try {
      const response = await fetch("/api/profile/sessions", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to revoke sessions");
      }

      // Keep only current session
      setSessions(sessions.filter(s => s.isCurrentSession));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke sessions");
    } finally {
      setRevoking(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes("mobile")) {
      return <Smartphone className="h-4 w-4" />;
    } else if (deviceName.toLowerCase().includes("tablet")) {
      return <Monitor className="h-4 w-4" />;
    } else {
      return <Monitor className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getDeviceIcon(session.deviceName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{session.deviceName}</p>
                    {session.isCurrentSession && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Current
                      </span>
                    )}
                    {session.isActive ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Expired
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <div>{session.browserName} on {session.osName}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.ipAddress || "Unknown location"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last used: {formatTimestamp(session.lastUsed)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!session.isCurrentSession && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revokeSession(session.id)}
                  disabled={revoking === session.id}
                >
                  {revoking === session.id ? (
                    "Revoking..."
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {sessions.filter(s => !s.isCurrentSession).length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={revokeAllOtherSessions}
              disabled={revoking === "all"}
            >
              {revoking === "all" ? (
                "Revoking All..."
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Revoke All Other Sessions
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will sign you out of all devices except this one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Password Component
 * Handles password change functionality
 */
function PasswordComponent() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword) {
      setError("Please enter your current password");
      setSaving(false);
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      setSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      setSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Password Settings
        </CardTitle>
        <CardDescription>
          Change your account password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Changing Password..." : "Change Password"}
          </Button>
        </form>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Tip:</strong> Use a strong, unique password that you don't use elsewhere.
            Consider using a password manager to generate and store secure passwords.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
