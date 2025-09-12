import { AssetList } from "@/components/assets/asset-list";
import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * Assets Page
 * Main page for viewing and managing council assets
 */
export default function AssetsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <AssetList />
      </div>
    </ProtectedRoute>
  );
}
