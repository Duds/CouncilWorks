import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import JourneySidebar from '@/components/dashboard/JourneySidebar';
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

const mockAdminSession = {
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    image: null,
    role: 'ADMIN'
  },
  expires: '2024-12-31'
};

const mockCrewSession = {
  user: {
    name: 'Crew Member',
    email: 'crew@example.com',
    image: null,
    role: 'CREW'
  },
  expires: '2024-12-31'
};

const mockCitizenSession = {
  user: {
    name: 'Citizen User',
    email: 'citizen@example.com',
    image: null,
    role: 'CITIZEN'
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

const { useSession, signOut } = require('next-auth/react');

describe('JourneySidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Strategic Overview Group (Rule 1: Purpose-driven navigation)', () => {
    it('should display Strategic Overview group for MANAGER role', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Strategic Overview')).toBeInTheDocument();
      expect(screen.getByText('Strategic Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Asset Performance')).toBeInTheDocument();
      expect(screen.getByText('Risk Overview')).toBeInTheDocument();
      expect(screen.getByText('Compliance Status')).toBeInTheDocument();
    });

    it('should display Strategic Overview group for ADMIN role', () => {
      useSession.mockReturnValue({ data: mockAdminSession });
      
      render(
        <SessionProvider session={mockAdminSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Strategic Overview')).toBeInTheDocument();
    });

    it('should display Strategic Overview group for EXEC role', () => {
      const execSession = { ...mockSession, user: { ...mockSession.user, role: 'EXEC' } };
      useSession.mockReturnValue({ data: execSession });
      
      render(
        <SessionProvider session={execSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Strategic Overview')).toBeInTheDocument();
    });

    it('should not display Strategic Overview group for CREW role', () => {
      useSession.mockReturnValue({ data: mockCrewSession });
      
      render(
        <SessionProvider session={mockCrewSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.queryByText('Strategic Overview')).not.toBeInTheDocument();
    });
  });

  describe('Asset Planning Group (Rule 2: Risk-based grouping)', () => {
    it('should display Asset Planning group for MANAGER role', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Asset Planning')).toBeInTheDocument();
      expect(screen.getByText('Asset Register')).toBeInTheDocument();
      expect(screen.getByText('RCM Templates')).toBeInTheDocument();
      expect(screen.getByText('Maintenance Planning')).toBeInTheDocument();
    });

    it('should display Asset Planning group for SUPERVISOR role', () => {
      const supervisorSession = { ...mockSession, user: { ...mockSession.user, role: 'SUPERVISOR' } };
      useSession.mockReturnValue({ data: supervisorSession });
      
      render(
        <SessionProvider session={supervisorSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Asset Planning')).toBeInTheDocument();
    });

    it('should not display Asset Planning group for CREW role', () => {
      useSession.mockReturnValue({ data: mockCrewSession });
      
      render(
        <SessionProvider session={mockCrewSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.queryByText('Asset Planning')).not.toBeInTheDocument();
    });
  });

  describe('Operations Management Group (Rule 3: Critical asset focus)', () => {
    it('should display Operations Management group for all roles', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Operations Management')).toBeInTheDocument();
      expect(screen.getByText('Asset Map')).toBeInTheDocument();
      expect(screen.getByText('Field Operations')).toBeInTheDocument();
      expect(screen.getByText('Mobile Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Inspections')).toBeInTheDocument();
      expect(screen.getByText('Work Orders')).toBeInTheDocument();
    });

    it('should display Operations Management group for CREW role', () => {
      useSession.mockReturnValue({ data: mockCrewSession });
      
      render(
        <SessionProvider session={mockCrewSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Operations Management')).toBeInTheDocument();
    });
  });

  describe('Community Engagement Group', () => {
    it('should display Community Engagement group for all roles', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Community Engagement')).toBeInTheDocument();
      expect(screen.getByText('Community Portal')).toBeInTheDocument();
      expect(screen.getByText('Track Requests')).toBeInTheDocument();
      expect(screen.getByText('Activity Logs')).toBeInTheDocument();
      expect(screen.getByText('Report Triage')).toBeInTheDocument();
    });

    it('should display Community Portal for CITIZEN role', () => {
      useSession.mockReturnValue({ data: mockCitizenSession });
      
      render(
        <SessionProvider session={mockCitizenSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Community Portal')).toBeInTheDocument();
      expect(screen.getByText('Track Requests')).toBeInTheDocument();
    });
  });

  describe('System Administration Group (Rule 4: Future-oriented workflow)', () => {
    it('should display System Administration group for ADMIN role', () => {
      useSession.mockReturnValue({ data: mockAdminSession });
      
      render(
        <SessionProvider session={mockAdminSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('System Administration')).toBeInTheDocument();
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Audit Logs')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });

    it('should not display System Administration group for MANAGER role', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.queryByText('System Administration')).not.toBeInTheDocument();
    });
  });

  describe('User Interface and Accessibility', () => {
    it('should display user information in footer', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display user initials when no image provided', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('TU')).toBeInTheDocument(); // Test User initials
    });

    it('should have proper ARIA roles and navigation structure', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      // Check for navigation structure
      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toBeInTheDocument();
    });

    it('should handle logout functionality', async () => {
      useSession.mockReturnValue({ data: mockSession });
      signOut.mockResolvedValue(undefined);
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith({
          callbackUrl: "/auth/sign-in",
          redirect: true
        });
      });
    });
  });

  describe('Asset Register Badge Display', () => {
    it('should display asset count badge for Asset Register', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByText('1,247')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes for navigation links', () => {
      useSession.mockReturnValue({ data: mockSession });
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      expect(screen.getByRole('link', { name: /strategic dashboard/i })).toHaveAttribute('href', '/dashboard');
      expect(screen.getByRole('link', { name: /asset register/i })).toHaveAttribute('href', '/assets');
      expect(screen.getByRole('link', { name: /asset map/i })).toHaveAttribute('href', '/assets/map');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing session gracefully', () => {
      useSession.mockReturnValue({ data: null });
      
      render(
        <SessionProvider session={null}>
          <JourneySidebar />
        </SessionProvider>
      );

      // Should still render basic structure
      expect(screen.getByText('Aegrid')).toBeInTheDocument();
    });

    it('should handle logout error gracefully', async () => {
      useSession.mockReturnValue({ data: mockSession });
      signOut.mockRejectedValue(new Error('Logout failed'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(
        <SessionProvider session={mockSession}>
          <JourneySidebar />
        </SessionProvider>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });
});
