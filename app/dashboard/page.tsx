"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { useDashboardCards, useDashboardPreferences, useCardData, useDashboardActions } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  RefreshCw, 
  Grid3X3, 
  List, 
  Maximize2,
  User,
  Shield,
  Wrench
} from 'lucide-react';

/**
 * Unified Dashboard Page following shadcn/ui standards
 * Single dashboard that adapts based on user role and preferences
 */
export default function UnifiedDashboardPage() {
  const [showSettings, setShowSettings] = useState(false);
  
  // Dashboard hooks
  const { cards, loading: cardsLoading, refreshCards, userRole } = useDashboardCards();
  const { preferences, loading: prefsLoading, updateLayout, updateDefaultView } = useDashboardPreferences();
  const { refreshCardData } = useCardData(cards, preferences.refreshInterval);
  const { handleCardAction } = useDashboardActions();

  const handleRefresh = async () => {
    await refreshCards();
    await refreshCardData();
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'EXEC': return 'Executive';
      case 'ADMIN': return 'Administrator';
      case 'MANAGER': return 'Manager';
      case 'SUPERVISOR': return 'Supervisor';
      case 'CREW': return 'Crew Member';
      case 'CITIZEN': return 'Citizen';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'EXEC': return Shield;
      case 'ADMIN': return Shield;
      case 'MANAGER': return User;
      case 'SUPERVISOR': return Wrench;
      case 'CREW': return Wrench;
      case 'CITIZEN': return User;
      default: return User;
    }
  };

  const RoleIcon = userRole ? getRoleIcon(userRole) : User;

  return (
    <AppLayout 
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
      title={`${getRoleDisplayName(userRole || '')} Dashboard`}
      description="Unified dashboard with role-based customisation"
    >
      <div className="space-y-6">
        {/* Dashboard Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <RoleIcon className="h-8 w-8 text-primary" />
              <Badge variant="outline" className="capitalize">
                {preferences.defaultView} view
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={cardsLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${cardsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dashboard Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Layout</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={preferences.layout === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateLayout('grid')}
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      variant={preferences.layout === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateLayout('list')}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                    <Button
                      variant={preferences.layout === 'compact' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateLayout('compact')}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Compact
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Default View</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={preferences.defaultView === 'executive' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDefaultView('executive')}
                    >
                      Executive
                    </Button>
                    <Button
                      variant={preferences.defaultView === 'manager' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDefaultView('manager')}
                    >
                      Manager
                    </Button>
                    <Button
                      variant={preferences.defaultView === 'supervisor' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDefaultView('supervisor')}
                    >
                      Supervisor
                    </Button>
                    <Button
                      variant={preferences.defaultView === 'custom' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDefaultView('custom')}
                    >
                      Custom
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Grid */}
        <DashboardGrid
          cards={cards}
          preferences={preferences}
          loading={cardsLoading || prefsLoading}
          onCardAction={handleCardAction}
          onSettingsClick={handleSettingsClick}
        />
      </div>
    </AppLayout>
  );
}