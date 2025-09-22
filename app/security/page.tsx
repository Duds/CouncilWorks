import { SecurityDashboard } from '@/components/security/security-dashboard';

/**
 * Security Page
 * 
 * Essential Eight compliance monitoring and security management
 * Provides comprehensive security dashboard for administrators and managers
 */
export default function SecurityPage() {
  return (
    <div className="container mx-auto py-6">
      <SecurityDashboard />
    </div>
  );
}