import AppLayout from "@/components/layout/app-layout";
import { CustomReportBuilder } from "@/components/reports/custom-report-builder";

/**
 * Custom Report Builder Page
 * Drag-and-drop interface for creating custom reports and dashboards
 */
export default function CustomReportBuilderPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER']}
      title="Custom Report Builder"
      description="Drag-and-drop interface for creating custom reports and dashboards"
    >
      <CustomReportBuilder />
    </AppLayout>
  );
}
