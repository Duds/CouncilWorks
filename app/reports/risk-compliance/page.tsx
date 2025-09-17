import AppLayout from "@/components/layout/app-layout";
import { RiskComplianceReport } from "@/components/reports/risk-compliance-report";

/**
 * Risk and Compliance Report Page
 * Comprehensive risk assessment and regulatory compliance tracking
 */
export default function RiskComplianceReportPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN', 'MANAGER', 'EXEC']}
      title="Risk & Compliance Report"
      description="Comprehensive risk assessment and regulatory compliance tracking"
    >
      <RiskComplianceReport />
    </AppLayout>
  );
}
