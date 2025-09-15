import { redirect } from 'next/navigation';

/**
 * Supervisor Dashboard Redirect
 * Redirects to the unified dashboard with supervisor view
 */
export default function SupervisorDashboardRedirect() {
  redirect('/dashboard');
}