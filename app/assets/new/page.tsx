import { AssetForm } from "@/components/assets/asset-form";
import AppLayout from "@/components/layout/app-layout";

/**
 * Create New Asset Page
 * Page for creating new assets
 */
export default function CreateAssetPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
      title="Create New Asset"
      description="Add a new asset to the council registry"
    >
      <AssetForm mode="create" />
    </AppLayout>
  );
}
