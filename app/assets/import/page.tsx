import { AssetImport } from "@/components/assets/asset-import";
import AppLayout from "@/components/layout/app-layout";

/**
 * Asset Import Page
 * Page for importing assets from CSV/Excel files
 */
export default function AssetImportPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'EXEC', 'MANAGER', 'SUPERVISOR']}
      title="Import Assets"
      description="Import assets from CSV or Excel files"
    >
      <AssetImport />
    </AppLayout>
  );
}
