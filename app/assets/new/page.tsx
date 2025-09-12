import { AssetForm } from "@/components/assets/asset-form";
import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * Create New Asset Page
 * Page for creating new assets
 */
export default function CreateAssetPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <AssetForm mode="create" />
      </div>
    </ProtectedRoute>
  );
}
