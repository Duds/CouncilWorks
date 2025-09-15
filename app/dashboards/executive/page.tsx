import { redirect } from 'next/navigation';

/**
 * Executive Dashboard Redirect
 * Redirects to the unified dashboard with executive view
 */
export default function ExecutiveDashboardRedirect() {
  redirect('/dashboard');
}