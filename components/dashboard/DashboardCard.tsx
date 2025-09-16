/**
 * Dashboard Card Components
 * Individual card components for the unified dashboard system
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Building2,
  Wrench,
  Calendar,
  BarChart3,
  DollarSign,
  MapPin,
  Eye,
  Edit
} from 'lucide-react';
import { DashboardCard } from '@/types/dashboard';

// Icon mapping for dynamic icon access
const iconMap = {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Building2,
  Wrench,
  Calendar,
  BarChart3,
  DollarSign,
  MapPin,
  Eye,
  Edit
} as const;

interface CardComponentProps {
  card: DashboardCard;
  data?: any;
  loading?: boolean;
  onAction?: (cardId: string, action: string) => void;
}

/**
 * KPI Card Component
 * Displays key performance indicators with trends
 */
export function KPICard({ card, data, loading }: CardComponentProps) {
  const config = card.config;
  const value = data?.value ?? config.value ?? 0;
  const change = data?.change ?? config.change ?? 0;
  const changeType = data?.changeType ?? config.changeType ?? 'neutral';
  const format = config.format ?? 'number';

  // Get icon component
  const IconComponent = config.icon ? iconMap[config.icon as keyof typeof iconMap] : Activity;

  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-AU', {
          style: 'currency',
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-AU').format(val);
      default:
        return val.toString();
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {card.title}
          </CardTitle>
          <div className="text-muted-foreground">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-pulse bg-muted h-8 w-24 rounded"></div>
          <div className="flex items-center gap-1 text-xs mt-2">
            <div className="animate-pulse bg-muted h-4 w-16 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.title}
        </CardTitle>
        <div className="text-muted-foreground">
          <IconComponent className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value, format)}
        </div>
        <div className="flex items-center gap-1 text-xs">
          {getChangeIcon(changeType)}
          <span className={getChangeColor(changeType)}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
        {card.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {card.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Chart Card Component
 * Displays various chart types
 */
export function ChartCard({ card, data, loading }: CardComponentProps) {
  const config = card.config;
  const chartData = data?.data ?? config.data ?? [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{card.title}</CardTitle>
          {card.description && (
            <CardDescription>{card.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse bg-muted h-48 w-full rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{card.title}</CardTitle>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p>Chart visualization</p>
            <p className="text-sm">({config.chartType} chart)</p>
            <p className="text-xs mt-2">
              {chartData.length} data points
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Data Card Component
 * Displays tabular data
 */
export function DataCard({ card, data, loading }: CardComponentProps) {
  const config = card.config;
  const columns = data?.columns ?? config.columns ?? [];
  const rows = data?.rows ?? config.rows ?? [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{card.title}</CardTitle>
          {card.description && (
            <CardDescription>{card.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted h-8 w-full rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{card.title}</CardTitle>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.map((row: any, index: number) => (
            <Card key={index} className="border border-border">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {columns.map((column: string, colIndex: number) => (
                      <div key={colIndex} className="flex items-center gap-2">
                        {column === 'Icon' && row[column] ? (
                          <div className="text-muted-foreground">
                            {React.createElement(iconMap[row[column] as keyof typeof iconMap] || Activity, { className: "h-4 w-4" })}
                          </div>
                        ) : (
                          <span className="text-sm font-medium">{row[column]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Action Card Component
 * Displays quick action buttons
 */
export function ActionCard({ card, data, loading, onAction }: CardComponentProps) {
  const config = card.config;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{card.title}</CardTitle>
          {card.description && (
            <CardDescription>{card.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted h-16 w-full rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(card.id, action);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{card.title}</CardTitle>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => handleAction('financial-report')}
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm">Financial Report</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => handleAction('risk-analysis')}
          >
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm">Risk Analysis</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => handleAction('team-performance')}
          >
            <Users className="h-6 w-6" />
            <span className="text-sm">Team Performance</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => handleAction('export-data')}
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm">Export Data</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Alert Card Component
 * Displays alerts and notifications
 */
export function AlertCard({ card, data, loading }: CardComponentProps) {
  const config = card.config;
  const severity = data?.severity ?? config.severity ?? 'medium';
  const alertCount = data?.alertCount ?? config.alertCount ?? 0;

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{card.title}</CardTitle>
          {card.description && (
            <CardDescription>{card.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-20 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{card.title}</CardTitle>
        {card.description && (
          <CardDescription>{card.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg border ${getSeverityColor(severity)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">{alertCount} Active Alerts</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {severity}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Dashboard Card Component
 * Renders the appropriate card type based on card configuration
 */
export function DashboardCardComponent(props: CardComponentProps) {
  const { card } = props;

  switch (card.type) {
    case 'kpi':
      return <KPICard {...props} />;
    case 'chart':
      return <ChartCard {...props} />;
    case 'data':
      return <DataCard {...props} />;
    case 'action':
      return <ActionCard {...props} />;
    case 'alert':
      return <AlertCard {...props} />;
    default:
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Unknown card type: {card.type}</p>
          </CardContent>
        </Card>
      );
  }
}
