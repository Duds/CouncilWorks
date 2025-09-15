"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppLayout from '@/components/layout/app-layout';
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
 * Settings Page following shadcn/ui standards
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
    <AppLayout 
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
      title="Settings"
      description="Manage your account settings, preferences, and system configuration"
    >
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
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/profile" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Profile Management</div>
                        <div className="text-sm text-muted-foreground">
                          Update personal details
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/activity" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Activity Log</div>
                        <div className="text-sm text-muted-foreground">
                          View account activity
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/sessions" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Monitor className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Session Management</div>
                        <div className="text-sm text-muted-foreground">
                          Manage active sessions
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
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
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/profile?tab=mfa" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Multi-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">
                          Enable MFA security
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/profile?tab=password" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Password Settings</div>
                        <div className="text-sm text-muted-foreground">
                          Change password
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/sessions" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Monitor className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Security Sessions</div>
                        <div className="text-sm text-muted-foreground">
                          Review login history
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
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
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/profile?tab=notifications" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Notification Preferences</div>
                        <div className="text-sm text-muted-foreground">
                          Email and alert settings
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors">
                <Link href="/profile?tab=language" className="block">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="font-medium">Language & Region</div>
                        <div className="text-sm text-muted-foreground">
                          Timezone and language
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
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
                  <Card className="hover:bg-muted/50 transition-colors">
                    <Link href="/admin" className="block">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <div className="font-medium">Admin Dashboard</div>
                            <div className="text-sm text-muted-foreground">
                              System overview
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <Link href="/admin/users" className="block">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <div className="font-medium">User Management</div>
                            <div className="text-sm text-muted-foreground">
                              Manage users
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <Link href="/admin/audit-logs" className="block">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Activity className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <div className="font-medium">Audit Logs</div>
                            <div className="text-sm text-muted-foreground">
                              System activity
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <Link href="/admin/security" className="block">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <div className="font-medium">Security Settings</div>
                            <div className="text-sm text-muted-foreground">
                              System security
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
