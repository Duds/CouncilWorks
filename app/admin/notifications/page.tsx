import AppLayout from "@/components/layout/app-layout";
import { CitizenNotificationSystem } from "@/components/citizen/citizen-notification-system";

/**
 * Citizen Notification System Page
 * Administrative interface for managing notification templates and citizen communication preferences
 */
export default function CitizenNotificationPage() {
  return (
    <AppLayout
      requiredRoles={['ADMIN']}
      title="Citizen Notifications"
      description="Administrative interface for managing notification templates and citizen communication preferences"
    >
      <CitizenNotificationSystem />
    </AppLayout>
  );
}
