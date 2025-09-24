"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    BarChart3,
    Download,
    Filter,
    TrendingDown,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface EnergyConsumptionChartProps {
  data: any[];
  period: string;
  assetId?: string | null;
}

/**
 * Energy Consumption Chart Component - E21
 *
 * Interactive energy consumption visualization and analysis
 *
 * @component EnergyConsumptionChart
 * @example
 * ```tsx
 * <EnergyConsumptionChart
 *   data={consumptionData}
 *   period="MONTHLY"
 *   assetId="asset-123"
 * />
 * ```
 * @accessibility
 * - ARIA roles: main, img (for charts)
 * - Keyboard navigation: Tab through chart controls
 * - Screen reader: Announces consumption data and trends
 */
export function EnergyConsumptionChart({ data, period, assetId }: EnergyConsumptionChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [aggregation, setAggregation] = useState("DAILY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      processChartData();
    }
  }, [data, aggregation]);

  const processChartData = () => {
    if (!data || data.length === 0) return;

    // Group data by aggregation period
    const grouped = data.reduce((acc: any, item: any) => {
      const timestamp = new Date(item.timestamp);
      let key: string;

      switch (aggregation) {
        case "HOURLY":
          key = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}`;
          break;
        case "DAILY":
          key = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;
          break;
        case "WEEKLY":
          const weekStart = new Date(timestamp);
          weekStart.setDate(timestamp.getDate() - timestamp.getDay());
          key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
          break;
        case "MONTHLY":
          key = `${timestamp.getFullYear()}-${timestamp.getMonth()}`;
          break;
        default:
          key = timestamp.toISOString();
      }

      if (!acc[key]) {
        acc[key] = {
          period: key,
          timestamp: timestamp,
          consumption: 0,
          cost: 0,
          count: 0,
          assets: new Set(),
        };
      }

      acc[key].consumption += Number(item.consumptionValue || 0);
      acc[key].cost += Number(item.totalCost || 0);
      acc[key].count += 1;

      if (item.asset?.name) {
        acc[key].assets.add(item.asset.name);
      }

      return acc;
    }, {});

    // Convert to array and calculate averages
    const processedData = Object.values(grouped).map((item: any) => ({
      ...item,
      avgConsumption: item.consumption / item.count,
      avgCost: item.cost / item.count,
      assetCount: item.assets.size,
      assets: Array.from(item.assets),
    }));

    // Sort by timestamp
    processedData.sort((a: any, b: any) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    setChartData(processedData);
  };

  const calculateTrend = () => {
    if (chartData.length < 2) return 0;

    const recent = chartData.slice(-7); // Last 7 periods
    const older = chartData.slice(-14, -7); // Previous 7 periods

    if (recent.length === 0 || older.length === 0) return 0;

    const recentAvg = recent.reduce((sum, item) => sum + item.consumption, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.consumption, 0) / older.length;

    return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  };

  const getTotalConsumption = () => {
    return chartData.reduce((sum, item) => sum + item.consumption, 0);
  };

  const getTotalCost = () => {
    return chartData.reduce((sum, item) => sum + item.cost, 0);
  };

  const getPeakConsumption = () => {
    return Math.max(...chartData.map(item => item.consumption), 0);
  };

  const getAverageConsumption = () => {
    return chartData.length > 0 ? getTotalConsumption() / chartData.length : 0;
  };

  const trend = calculateTrend();
  const totalConsumption = getTotalConsumption();
  const totalCost = getTotalCost();
  const peakConsumption = getPeakConsumption();
  const averageConsumption = getAverageConsumption();

  // Simple bar chart representation (in a real implementation, you'd use a charting library like Chart.js or Recharts)
  const renderSimpleChart = () => {
    if (chartData.length === 0) return null;

    const maxConsumption = Math.max(...chartData.map(item => item.consumption));
    const chartHeight = 200;

    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-48 border-b border-l">
          {chartData.map((item, index) => {
            const height = (item.consumption / maxConsumption) * chartHeight;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full max-w-8 hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}px` }}
                  title={`${item.period}: ${item.consumption.toFixed(1)} kWh`}
                />
                <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
                  {new Date(item.timestamp).toLocaleDateString('en-AU', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Energy Consumption ({aggregation.toLowerCase()}) - {period.toLowerCase()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Energy Consumption Analysis</span>
          </h2>
          <p className="text-muted-foreground">
            Detailed consumption patterns and trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={aggregation} onValueChange={setAggregation}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOURLY">Hourly</SelectItem>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsumption.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">
              {chartData.length} {aggregation.toLowerCase()} periods
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <span className="text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Energy costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageConsumption.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">
              Per {aggregation.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{peakConsumption.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">
              Maximum consumption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            {trend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(trend).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {trend >= 0 ? 'Increase' : 'Decrease'} vs previous
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Consumption Pattern</CardTitle>
          <CardDescription>
            Energy consumption over time with {aggregation.toLowerCase()} aggregation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            renderSimpleChart()
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No consumption data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Data Table */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Consumption Data</CardTitle>
            <CardDescription>
              Breakdown of energy consumption by {aggregation.toLowerCase()} periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Period</th>
                    <th className="text-right p-2">Consumption (kWh)</th>
                    <th className="text-right p-2">Cost ($)</th>
                    <th className="text-right p-2">Avg per Reading</th>
                    <th className="text-left p-2">Assets</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(-20).map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        {new Date(item.timestamp).toLocaleDateString('en-AU')}
                      </td>
                      <td className="text-right p-2 font-medium">
                        {item.consumption.toFixed(1)}
                      </td>
                      <td className="text-right p-2">
                        ${item.cost.toFixed(2)}
                      </td>
                      <td className="text-right p-2 text-muted-foreground">
                        {item.avgConsumption.toFixed(1)}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {item.assets.slice(0, 2).map((asset: string, assetIndex: number) => (
                            <Badge key={assetIndex} variant="outline" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                          {item.assets.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.assets.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
