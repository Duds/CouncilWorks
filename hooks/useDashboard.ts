/**
 * Dashboard Hooks
 * Custom hooks for managing dashboard state and data
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardCard, DashboardPreferences, Role } from '@/types/dashboard';
import { DASHBOARD_TEMPLATES } from '@/lib/dashboard-templates';

/**
 * Hook for managing dashboard cards based on user role
 */
export function useDashboardCards() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCards = useCallback(async () => {
    if (!session?.user?.role) return;

    setLoading(true);
    
    try {
      // Get template for user role
      const template = DASHBOARD_TEMPLATES[session.user.role as Role];
      
      if (template) {
        // Filter cards based on user permissions
        const userCards = template.cards.filter(card => 
          card.permissions.includes(session.user.role as Role)
        );
        
        setCards(userCards);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.role]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const refreshCards = useCallback(() => {
    loadCards();
  }, [loadCards]);

  return {
    cards,
    loading,
    refreshCards,
    userRole: session?.user?.role as Role
  };
}

/**
 * Hook for managing dashboard preferences
 */
export function useDashboardPreferences() {
  const [preferences, setPreferences] = useState<DashboardPreferences>({
    layout: 'grid',
    refreshInterval: 300, // 5 minutes
    defaultView: 'custom',
    customCards: [],
    savedLayouts: [],
    showCardTitles: true,
    showCardDescriptions: true
  });
  const [loading, setLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    
    try {
      // In a real app, this would load from user preferences API
      const savedPreferences = localStorage.getItem('dashboard-preferences');
      
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load dashboard preferences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePreferences = useCallback(async (newPreferences: Partial<DashboardPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      
      // In a real app, this would save to user preferences API
      localStorage.setItem('dashboard-preferences', JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Failed to save dashboard preferences:', error);
    }
  }, [preferences]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    savePreferences,
    updateLayout: (layout: DashboardPreferences['layout']) => 
      savePreferences({ layout }),
    updateRefreshInterval: (interval: number) => 
      savePreferences({ refreshInterval: interval }),
    updateDefaultView: (view: DashboardPreferences['defaultView']) => 
      savePreferences({ defaultView: view })
  };
}

/**
 * Hook for managing card data and refresh intervals
 */
export function useCardData(cards: DashboardCard[], refreshInterval: number = 300) {
  const [cardData, setCardData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchCardData = useCallback(async (card: DashboardCard) => {
    if (!card.dataSource) return;

    setLoading(prev => ({ ...prev, [card.id]: true }));
    
    try {
      // In a real app, this would fetch from the actual API
      const response = await fetch(card.dataSource);
      const data = await response.json();
      
      setCardData(prev => ({ ...prev, [card.id]: data }));
    } catch (error) {
      console.error(`Failed to fetch data for card ${card.id}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [card.id]: false }));
    }
  }, []);

  const refreshCardData = useCallback(async (cardId?: string) => {
    if (cardId) {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        await fetchCardData(card);
      }
    } else {
      // Refresh all cards
      for (const card of cards) {
        if (card.dataSource) {
          await fetchCardData(card);
        }
      }
    }
  }, [cards, fetchCardData]);

  // Set up refresh intervals
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    cards.forEach(card => {
      if (card.dataSource && card.refreshInterval) {
        const interval = setInterval(() => {
          fetchCardData(card);
        }, card.refreshInterval * 1000);
        
        intervals.push(interval);
      }
    });

    // Global refresh interval
    if (refreshInterval > 0) {
      const globalInterval = setInterval(() => {
        refreshCardData();
      }, refreshInterval * 1000);
      
      intervals.push(globalInterval);
    }

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [cards, refreshInterval, fetchCardData, refreshCardData]);

  // Initial data load
  useEffect(() => {
    cards.forEach(card => {
      if (card.dataSource) {
        fetchCardData(card);
      }
    });
  }, [cards, fetchCardData]);

  return {
    cardData,
    loading,
    refreshCardData,
    fetchCardData
  };
}

/**
 * Hook for managing dashboard actions
 */
export function useDashboardActions() {
  const handleCardAction = useCallback((cardId: string, action: string) => {
    console.log(`Card action: ${cardId} - ${action}`);
    
    // Handle different action types
    switch (action) {
      case 'financial-report':
        window.open('/reports/financial', '_blank');
        break;
      case 'risk-analysis':
        window.open('/risk-analysis', '_blank');
        break;
      case 'team-performance':
        window.open('/reports/team-performance', '_blank');
        break;
      case 'export-data':
        // Trigger data export
        console.log('Exporting dashboard data...');
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }, []);

  return {
    handleCardAction
  };
}
