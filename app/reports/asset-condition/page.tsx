import AppLayout from "@/components/layout/app-layout";
import { AssetConditionTrending } from "@/components/reports/asset-condition-trending";

/**
 * Asset Condition Trending Page
 * Predictive analytics and condition monitoring for asset lifecycle management
 */
export default function AssetConditionTrendingPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Asset Condition Trending"
      description="Predictive analytics and condition monitoring for asset lifecycle management"
    >
      <AssetConditionTrending />
    </AppLayout>
  );
}
