/**
 * Dashboard Grid Component
 * Manages the layout and rendering of dashboard cards
 */

import React, { useState } from 'react';
import { DashboardCard, DashboardPreferences } from '@/types/dashboard';
import { DashboardCardComponent } from './DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Settings, 
  Grid3X3, 
  List, 
  Maximize2,
  Download
} from 'lucide-react';

interface DashboardGridProps {
  cards: DashboardCard[];
  preferences: DashboardPreferences;
  loading?: boolean;
  onCardAction?: (cardId: string, action: string) => void;
  onRefresh?: () => void;
  onSettingsClick?: () => void;
}

/**
 * Dashboard Grid Component
 * Renders cards in a responsive grid layout
 */
export function DashboardGrid({ 
  cards, 
  preferences, 
  loading = false,
  onCardAction,
  onRefresh,
  onSettingsClick
}: DashboardGridProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const getCardSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1';
      case 'large':
        return 'col-span-2';
      case 'full-width':
        return 'col-span-4';
      default:
        return 'col-span-1';
    }
  };

  const getGridLayoutClass = () => {
    switch (preferences.layout) {
      case 'list':
        return 'grid-cols-1';
      case 'compact':
        return 'grid-cols-2 lg:grid-cols-3';
      case 'grid':
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  // Group cards by category for better organization
  const groupedCards = cards.reduce((acc, card) => {
    const category = card.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {} as Record<string, DashboardCard[]>);

  const categoryOrder = ['financial', 'operational', 'compliance', 'maintenance', 'team', 'risk'];

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Badge variant="outline" className="capitalize">
            {preferences.defaultView} view
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Layout Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Layout:</span>
        <div className="flex items-center gap-1">
          <Button
            variant={preferences.layout === 'grid' ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={preferences.layout === 'list' ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={preferences.layout === 'compact' ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className={`grid ${getGridLayoutClass()} gap-6`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 w-full rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const categoryCards = groupedCards[category];
            if (!categoryCards || categoryCards.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold capitalize">{category}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {categoryCards.length} cards
                  </Badge>
                </div>
                
                <div className={`grid ${getGridLayoutClass()} gap-6`}>
                  {categoryCards.map((card) => (
                    <div 
                      key={card.id} 
                      className={`${getCardSizeClass(card.size)} ${
                        preferences.layout === 'list' ? 'col-span-1' : ''
                      }`}
                    >
                      <DashboardCardComponent
                        card={card}
                        loading={loading}
                        onAction={onCardAction}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && cards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Grid3X3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No cards available</h3>
            <p className="text-sm mb-4">
              Your dashboard is empty. Contact your administrator to configure dashboard cards.
            </p>
            <Button onClick={onSettingsClick}>
              <Settings className="h-4 w-4 mr-2" />
              Configure Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
