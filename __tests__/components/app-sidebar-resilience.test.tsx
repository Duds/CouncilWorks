/**
 * @jest-environment jsdom
 */

import { AppSidebar } from '@/components/app-sidebar';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/dashboard',
  }),
  usePathname: () => '/dashboard',
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock fetch for asset count
global.fetch = jest.fn();

// Mock session data
const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test Manager',
    email: 'manager@test.com',
    role: 'MANAGER',
    image: null,
  },
  expires: '2024-12-31T23:59:59.999Z',
};

const mockAdminSession = {
  user: {
    id: 'admin-1',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'ADMIN',
    image: null,
  },
  expires: '2024-12-31T23:59:59.999Z',
};

const mockSupervisorSession = {
  user: {
    id: 'supervisor-1',
    name: 'Test Supervisor',
    email: 'supervisor@test.com',
    role: 'SUPERVISOR',
    image: null,
  },
  expires: '2024-12-31T23:59:59.999Z',
};

describe('AppSidebar - Resilience Command Migration', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 150 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSidebar = (session: any = mockSession) => {
    return render(
      <SessionProvider session={session}>
        <AppSidebar variant="sidebar" collapsible="none" />
      </SessionProvider>
    );
  };

  describe('Resilience Command Group', () => {
    it('should display Resilience Command group for MANAGER role', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      // Check that the group is collapsible
      const groupLabel = screen.getByText('Resilience Command');
      expect(groupLabel).toBeInTheDocument();
    });

    it('should display Resilience Command group for ADMIN role', async () => {
      renderSidebar(mockAdminSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });
    });

    it('should display Resilience Command group for SUPERVISOR role', async () => {
      renderSidebar(mockSupervisorSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });
    });

    it('should not display Resilience Command group for CREW role', async () => {
      const crewSession = {
        ...mockSession,
        user: { ...mockSession.user, role: 'CREW' },
      };

      renderSidebar(crewSession);

      await waitFor(() => {
        expect(screen.queryByText('Resilience Command')).not.toBeInTheDocument();
      });
    });

    it('should expand Resilience Command group when clicked', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      // Click to expand the group
      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);

      // Check that the group items are visible
      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
        expect(screen.getByText('Margin Operations')).toBeInTheDocument();
        expect(screen.getByText('Asset Lookup')).toBeInTheDocument();
      });

      // Control Dashboard should NOT be in the sidebar (it's now the main dashboard)
      expect(screen.queryByText('Control Dashboard')).not.toBeInTheDocument();
    });

    it('should collapse Resilience Command group when clicked again', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');

      // Expand the group
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
      });

      // Collapse the group
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.queryByText('Risk Rhythm')).not.toBeInTheDocument();
      });
    });
  });

  describe('Resilience Command Menu Items', () => {
    beforeEach(async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      // Expand the group
      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);
    });

    it('should NOT display Control Dashboard menu item (moved to main dashboard)', async () => {
      // Control Dashboard is now the main dashboard, not a sidebar item
      expect(screen.queryByText('Control Dashboard')).not.toBeInTheDocument();
    });

    it('should display Risk Rhythm menu item', async () => {
      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
      });

      const riskRhythmLink = screen.getByText('Risk Rhythm');
      expect(riskRhythmLink.closest('a')).toHaveAttribute('href', '/resilience/risk-rhythm');
    });

    it('should display Margin Operations menu item', async () => {
      await waitFor(() => {
        expect(screen.getByText('Margin Operations')).toBeInTheDocument();
      });

      const marginOpsLink = screen.getByText('Margin Operations');
      expect(marginOpsLink.closest('a')).toHaveAttribute('href', '/resilience/margin-operations');
    });

    it('should display Asset Lookup menu item with asset count badge', async () => {
      await waitFor(() => {
        expect(screen.getByText('Asset Lookup')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument(); // Asset count badge
      });

      const assetLookupLink = screen.getByText('Asset Lookup');
      expect(assetLookupLink.closest('a')).toHaveAttribute('href', '/resilience/asset-lookup');
    });
  });

  describe('Role-based Access Control', () => {
    it('should show Resilience Command group for MANAGER role', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
        expect(screen.getByText('Margin Operations')).toBeInTheDocument();
        expect(screen.getByText('Asset Lookup')).toBeInTheDocument();
      });
    });

    it('should show Resilience Command group for ADMIN role', async () => {
      renderSidebar(mockAdminSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
        expect(screen.getByText('Margin Operations')).toBeInTheDocument();
        expect(screen.getByText('Asset Lookup')).toBeInTheDocument();
      });
    });

    it('should show Resilience Command group for EXEC role', async () => {
      const execSession = {
        ...mockSession,
        user: { ...mockSession.user, role: 'EXEC' },
      };

      renderSidebar(execSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
        expect(screen.getByText('Margin Operations')).toBeInTheDocument();
        expect(screen.getByText('Asset Lookup')).toBeInTheDocument();
      });
    });

    it('should show Risk Rhythm for SUPERVISOR role', async () => {
      renderSidebar(mockSupervisorSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
      });
    });

    it('should show Asset Lookup for SUPERVISOR role', async () => {
      renderSidebar(mockSupervisorSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);

      await waitFor(() => {
        expect(screen.getByText('Asset Lookup')).toBeInTheDocument();
      });
    });
  });

  describe('Asset Planning Group Removal', () => {
    it('should not display Asset Planning group', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.queryByText('Asset Planning')).not.toBeInTheDocument();
      });
    });

    it('should not display traditional asset planning items', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.queryByText('Asset Register')).not.toBeInTheDocument();
        expect(screen.queryByText('Risk Planner')).not.toBeInTheDocument();
        expect(screen.queryByText('RCM Templates')).not.toBeInTheDocument();
        expect(screen.queryByText('Maintenance Planning')).not.toBeInTheDocument();
        expect(screen.queryByText('Custom Reports')).not.toBeInTheDocument();
        expect(screen.queryByText('Data Import')).not.toBeInTheDocument();
      });
    });

    it('should still display Critical Controls in Strategic Overview for EXEC role', async () => {
      const execSession = {
        ...mockSession,
        user: { ...mockSession.user, role: 'EXEC' },
      };

      renderSidebar(execSession);

      await waitFor(() => {
        expect(screen.getByText('Strategic Overview')).toBeInTheDocument();
      });

      const strategicGroup = screen.getByText('Strategic Overview');
      fireEvent.click(strategicGroup);

      await waitFor(() => {
        expect(screen.getByText('Critical Controls')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Links', () => {
    beforeEach(async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');
      fireEvent.click(groupLabel);
    });

    it('should have correct href attributes for all resilience links', async () => {
      await waitFor(() => {
        expect(screen.getByText('Risk Rhythm')).toBeInTheDocument();
      });

      const links = [
        { text: 'Risk Rhythm', href: '/resilience/risk-rhythm' },
        { text: 'Margin Operations', href: '/resilience/margin-operations' },
        { text: 'Asset Lookup', href: '/resilience/asset-lookup' },
      ];

      links.forEach(({ text, href }) => {
        const linkElement = screen.getByText(text).closest('a');
        expect(linkElement).toHaveAttribute('href', href);
      });
    });
  });

  describe('Icon Usage', () => {
    it('should use Shield icon for Resilience Command group', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      // The Shield icon should be present (Lucide React icon)
      const groupLabel = screen.getByText('Resilience Command');
      const iconElement = groupLabel.querySelector('svg');
      expect(iconElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for navigation', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      // Check that the sidebar has proper navigation role
      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      renderSidebar(mockSession);

      await waitFor(() => {
        expect(screen.getByText('Resilience Command')).toBeInTheDocument();
      });

      const groupLabel = screen.getByText('Resilience Command');

      // Should be focusable
      groupLabel.focus();
      expect(document.activeElement).toBe(groupLabel);
    });
  });
});
