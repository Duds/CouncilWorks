import { AssetImport } from "@/components/assets/asset-import";
import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * Asset Import Page
 * Page for importing assets from CSV/Excel files
 */
export default function AssetImportPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <AssetImport />
      </div>
    </ProtectedRoute>
  );
}
