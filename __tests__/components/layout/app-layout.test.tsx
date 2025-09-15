import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppLayout from '@/components/layout/app-layout';
import '@testing-library/jest-dom';

// Mock next-auth
const mockSession = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    role: 'MANAGER'
  },
  expires: '2024-12-31'
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock ProtectedRoute
jest.mock('@/components/auth/protected-route', () => ({
  ProtectedRoute: ({ children }: any) => <div data-testid="protected-route">{children}</div>,
}));

// Mock Header component
jest.mock('@/components/dashboard/Header', () => ({
  __esModule: true,
  default: ({ title, description }: any) => (
    <header data-testid="header">
      {title && <h1>{title}</h1>}
      {description && <p>{description}</p>}
    </header>
  ),
}));

const { useSession } = require('next-auth/react');

describe('AppLayout Integration with JourneySidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ data: mockSession });
  });

  describe('Layout Structure', () => {
    it('should render AppLayout with JourneySidebar', () => {
      render(
        <AppLayout title="Test Page" description="Test description">
          <div>Test Content</div>
        </AppLayout>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render JourneySidebar with proper navigation groups', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Check for journey-centric navigation groups
      expect(screen.getByText('Strategic Overview')).toBeInTheDocument();
      expect(screen.getByText('Asset Planning')).toBeInTheDocument();
      expect(screen.getByText('Operations Management')).toBeInTheDocument();
      expect(screen.getByText('Community Engagement')).toBeInTheDocument();
    });

    it('should not render System Administration for MANAGER role', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      expect(screen.queryByText('System Administration')).not.toBeInTheDocument();
    });

    it('should render System Administration for ADMIN role', () => {
      const adminSession = { ...mockSession, user: { ...mockSession.user, role: 'ADMIN' } };
      useSession.mockReturnValue({ data: adminSession });

      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      expect(screen.getByText('System Administration')).toBeInTheDocument();
    });
  });

  describe('Sidebar Functionality', () => {
    it('should have collapsible sidebar', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Check for sidebar trigger button
      const sidebarTrigger = screen.getByRole('button', { name: /toggle sidebar/i });
      expect(sidebarTrigger).toBeInTheDocument();
    });

    it('should display user information in sidebar footer', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display Aegrid logo in sidebar header', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      expect(screen.getByText('Aegrid')).toBeInTheDocument();
    });
  });

  describe('Navigation Links Integration', () => {
    it('should have correct navigation links for MANAGER role', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Strategic Overview Group
      expect(screen.getByRole('link', { name: /strategic dashboard/i })).toHaveAttribute('href', '/dashboard');
      expect(screen.getByRole('link', { name: /asset performance/i })).toHaveAttribute('href', '/reports/asset-condition');
      expect(screen.getByRole('link', { name: /risk overview/i })).toHaveAttribute('href', '/risk-analysis');
      expect(screen.getByRole('link', { name: /compliance status/i })).toHaveAttribute('href', '/reports/risk-compliance');

      // Asset Planning Group
      expect(screen.getByRole('link', { name: /asset register/i })).toHaveAttribute('href', '/assets');
      expect(screen.getByRole('link', { name: /rcm templates/i })).toHaveAttribute('href', '/rcm-templates');
      expect(screen.getByRole('link', { name: /maintenance planning/i })).toHaveAttribute('href', '/maintenance');
      expect(screen.getByRole('link', { name: /custom reports/i })).toHaveAttribute('href', '/reports/builder');
      expect(screen.getByRole('link', { name: /data import/i })).toHaveAttribute('href', '/imports');

      // Operations Management Group
      expect(screen.getByRole('link', { name: /asset map/i })).toHaveAttribute('href', '/assets/map');
      expect(screen.getByRole('link', { name: /field operations/i })).toHaveAttribute('href', '/field-tool');
      expect(screen.getByRole('link', { name: /mobile dashboard/i })).toHaveAttribute('href', '/mobile/dashboard');
      expect(screen.getByRole('link', { name: /inspections/i })).toHaveAttribute('href', '/mobile/inspections');
      expect(screen.getByRole('link', { name: /work orders/i })).toHaveAttribute('href', '/mobile/work-orders');
      expect(screen.getByRole('link', { name: /work sessions/i })).toHaveAttribute('href', '/sessions');

      // Community Engagement Group
      expect(screen.getByRole('link', { name: /community portal/i })).toHaveAttribute('href', '/citizen');
      expect(screen.getByRole('link', { name: /track requests/i })).toHaveAttribute('href', '/citizen/track');
      expect(screen.getByRole('link', { name: /activity logs/i })).toHaveAttribute('href', '/activity');
      expect(screen.getByRole('link', { name: /report triage/i })).toHaveAttribute('href', '/admin/triage');
    });

    it('should have correct navigation links for ADMIN role', () => {
      const adminSession = { ...mockSession, user: { ...mockSession.user, role: 'ADMIN' } };
      useSession.mockReturnValue({ data: adminSession });

      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // System Administration Group
      expect(screen.getByRole('link', { name: /admin dashboard/i })).toHaveAttribute('href', '/admin');
      expect(screen.getByRole('link', { name: /user management/i })).toHaveAttribute('href', '/admin/users');
      expect(screen.getByRole('link', { name: /audit logs/i })).toHaveAttribute('href', '/admin/audit-logs');
      expect(screen.getByRole('link', { name: /notifications/i })).toHaveAttribute('href', '/admin/notifications');
      expect(screen.getByRole('link', { name: /system settings/i })).toHaveAttribute('href', '/settings');
    });
  });

  describe('Role-Based Access Control', () => {
    it('should show appropriate navigation groups for CREW role', () => {
      const crewSession = { ...mockSession, user: { ...mockSession.user, role: 'CREW' } };
      useSession.mockReturnValue({ data: crewSession });

      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Should not show Strategic Overview or Asset Planning
      expect(screen.queryByText('Strategic Overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Asset Planning')).not.toBeInTheDocument();

      // Should show Operations Management and Community Engagement
      expect(screen.getByText('Operations Management')).toBeInTheDocument();
      expect(screen.getByText('Community Engagement')).toBeInTheDocument();
    });

    it('should show appropriate navigation groups for SUPERVISOR role', () => {
      const supervisorSession = { ...mockSession, user: { ...mockSession.user, role: 'SUPERVISOR' } };
      useSession.mockReturnValue({ data: supervisorSession });

      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Should not show Strategic Overview
      expect(screen.queryByText('Strategic Overview')).not.toBeInTheDocument();

      // Should show Asset Planning, Operations Management, and Community Engagement
      expect(screen.getByText('Asset Planning')).toBeInTheDocument();
      expect(screen.getByText('Operations Management')).toBeInTheDocument();
      expect(screen.getByText('Community Engagement')).toBeInTheDocument();
    });

    it('should show appropriate navigation groups for EXEC role', () => {
      const execSession = { ...mockSession, user: { ...mockSession.user, role: 'EXEC' } };
      useSession.mockReturnValue({ data: execSession });

      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Should show Strategic Overview
      expect(screen.getByText('Strategic Overview')).toBeInTheDocument();

      // Should not show Asset Planning or System Administration
      expect(screen.queryByText('Asset Planning')).not.toBeInTheDocument();
      expect(screen.queryByText('System Administration')).not.toBeInTheDocument();
    });
  });

  describe('Content Area Integration', () => {
    it('should render children content in main area', () => {
      render(
        <AppLayout title="Dashboard" description="Main dashboard">
          <div data-testid="page-content">
            <h2>Dashboard Content</h2>
            <p>This is the main dashboard content</p>
          </div>
        </AppLayout>
      );

      expect(screen.getByTestId('page-content')).toBeInTheDocument();
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      expect(screen.getByText('This is the main dashboard content')).toBeInTheDocument();
    });

    it('should pass title and description to Header component', () => {
      render(
        <AppLayout title="Test Page" description="Test description">
          <div>Test Content</div>
        </AppLayout>
      );

      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have proper CSS classes for responsive design', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Check for responsive classes
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('flex-1', 'p-6');
    });
  });

  describe('Accessibility Integration', () => {
    it('should have proper ARIA roles and structure', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Check for proper ARIA structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have keyboard navigation support', () => {
      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Check for keyboard accessible elements
      const navigationLinks = screen.getAllByRole('link');
      expect(navigationLinks.length).toBeGreaterThan(0);

      // First link should be focusable
      navigationLinks[0].focus();
      expect(navigationLinks[0]).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing session gracefully', () => {
      useSession.mockReturnValue({ data: null });

      render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Should still render basic structure
      expect(screen.getByText('Aegrid')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should handle missing required roles gracefully', () => {
      render(
        <AppLayout requiredRoles={['ADMIN']}>
          <div>Test Content</div>
        </AppLayout>
      );

      // Should still render with protected route wrapper
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should render efficiently with minimal re-renders', () => {
      const { rerender } = render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Re-render with same props
      rerender(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Should maintain same structure
      expect(screen.getByText('Strategic Overview')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
});
