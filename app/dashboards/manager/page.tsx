import { redirect } from 'next/navigation';

/**
 * Manager Dashboard Redirect
 * Redirects to the unified dashboard with manager view
 */
export default function ManagerDashboardRedirect() {
  redirect('/dashboard');
}