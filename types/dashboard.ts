/**
 * Dashboard Card System Types
 * Defines the structure for the unified dashboard card system
 */

export type CardType = 'kpi' | 'chart' | 'data' | 'action' | 'alert';
export type CardSize = 'small' | 'medium' | 'large' | 'full-width';
export type Role = 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'CREW' | 'EXEC' | 'CITIZEN';
export type CardCategory = 'financial' | 'operational' | 'compliance' | 'maintenance' | 'team' | 'risk';

export interface DashboardCard {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  size: CardSize;
  position: { x: number; y: number };
  config: CardConfig;
  permissions: Role[];
  category: CardCategory;
  refreshInterval?: number; // in seconds
  dataSource?: string; // API endpoint or data key
}

export interface CardConfig {
  // KPI specific
  value?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
  icon?: string; // Lucide icon name
  
  // Chart specific
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  data?: any[];
  
  // Data specific
  columns?: string[];
  rows?: any[];
  
  // Action specific
  actionUrl?: string;
  actionText?: string;
  
  // Alert specific
  severity?: 'low' | 'medium' | 'high' | 'critical';
  alertCount?: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  cards: DashboardCard[];
  isDefault?: boolean;
  role?: Role;
}

export interface DashboardPreferences {
  layout: 'grid' | 'list' | 'compact';
  refreshInterval: number;
  defaultView: 'executive' | 'manager' | 'supervisor' | 'custom';
  customCards: string[];
  savedLayouts: DashboardLayout[];
  showCardTitles: boolean;
  showCardDescriptions: boolean;
}
