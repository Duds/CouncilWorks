"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Activity, 
  BarChart3, 
  Shield,
  Settings as SettingsIcon,
  User,
  Bell,
  Key,
  Monitor,
  Globe
} from "lucide-react";
import { canAccessAdmin } from "@/lib/rbac";

/**
 * Settings Page
 * Central location for all user and system settings
 * @component SettingsPage
 * @example
 * ```tsx
 * <SettingsPage />
 * ```
 * @accessibility
 * - ARIA roles: main, region
 * - Keyboard navigation: Tab through settings sections
 * - Screen reader: Announces settings categories and options
 */
export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and system configuration.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information and account preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/profile"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <User className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Profile Management</div>
                  <div className="text-sm text-muted-foreground">
                    Update personal details
                  </div>
                </div>
              </Link>
              <Link
                href="/activity"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Activity className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Activity Log</div>
                  <div className="text-sm text-muted-foreground">
                    View account activity
                  </div>
                </div>
              </Link>
              <Link
                href="/sessions"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Monitor className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Session Management</div>
                  <div className="text-sm text-muted-foreground">
                    Manage active sessions
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security features and authentication methods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/profile?tab=mfa"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Key className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Multi-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Enable MFA security
                  </div>
                </div>
              </Link>
              <Link
                href="/profile?tab=password"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Shield className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Password Settings</div>
                  <div className="text-sm text-muted-foreground">
                    Change password
                  </div>
                </div>
              </Link>
              <Link
                href="/sessions"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Monitor className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Security Sessions</div>
                  <div className="text-sm text-muted-foreground">
                    Review login history
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications and updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/profile?tab=notifications"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Bell className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Notification Preferences</div>
                  <div className="text-sm text-muted-foreground">
                    Email and alert settings
                  </div>
                </div>
              </Link>
              <Link
                href="/profile?tab=language"
                className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Globe className="h-5 w-5 text-primary mr-3" />
                <div>
                  <div className="font-medium">Language & Region</div>
                  <div className="text-sm text-muted-foreground">
                    Timezone and language
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Administrative Functions */}
        {session?.user && canAccessAdmin(session.user.role) && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Administrative Functions
                </CardTitle>
                <CardDescription>
                  Access administrative functions and system management tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    href="/admin"
                    className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <BarChart3 className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">Admin Dashboard</div>
                      <div className="text-sm text-muted-foreground">
                        System overview
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">User Management</div>
                      <div className="text-sm text-muted-foreground">
                        Manage users
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/admin/audit-logs"
                    className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Activity className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">Audit Logs</div>
                      <div className="text-sm text-muted-foreground">
                        System activity
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/admin/security"
                    className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Shield className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">Security Settings</div>
                      <div className="text-sm text-muted-foreground">
                        System security
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
