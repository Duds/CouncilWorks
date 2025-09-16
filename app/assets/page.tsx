import { AssetList } from "@/components/assets/asset-list";
import AppLayout from "@/components/layout/app-layout";

/**
 * Assets Page
 * Main page for viewing and managing council assets
 */
export default function AssetsPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR', 'CREW']}
      title="Assets"
      description="Manage and view all council assets"
    >
      <AssetList />
    </AppLayout>
  );
}
