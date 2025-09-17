import AppLayout from "@/components/layout/app-layout";
import { ReportTriageDashboard } from "@/components/admin/report-triage-dashboard";

/**
 * Report Triage Dashboard Page
 * Administrative interface for triaging and assigning citizen reports
 */
export default function ReportTriagePage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}
      title="Report Triage"
      description="Administrative interface for triaging and assigning citizen reports"
    >
      <ReportTriageDashboard />
    </AppLayout>
  );
}
