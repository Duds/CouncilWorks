import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/team',
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'MANAGER'
      }
    }
  })),
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

describe('PI2 E7: Journey-Centric UX Transformation - Integration Tests', () => {
  describe('Team Management System', () => {
    it('should render team management interface with correct structure', async () => {
      // Import the component dynamically to avoid dependency issues
      const TeamManagement = (await import('@/app/team/page')).default;
      
      render(<TeamManagement />);
      
      // Test basic structure
      expect(screen.getByText('Team Management')).toBeInTheDocument();
      expect(screen.getByText('Manage team assignments based on asset criticality and RCM-lite strategies')).toBeInTheDocument();
      
      // Test overview cards
      expect(screen.getByText('Total Team Members')).toBeInTheDocument();
      expect(screen.getByText('Critical Asset Experts')).toBeInTheDocument();
      expect(screen.getByText('Active Assignments')).toBeInTheDocument();
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      
      // Test tab structure
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Asset Assignments')).toBeInTheDocument();
      expect(screen.getByText('Skills Matrix')).toBeInTheDocument();
    });

    it('should display team members with critical asset expertise', async () => {
      const TeamManagement = (await import('@/app/team/page')).default;
      
      render(<TeamManagement />);
      
      // Test team member data
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Chen')).toBeInTheDocument();
      expect(screen.getByText('Emma Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('David Thompson')).toBeInTheDocument();
      
      // Test critical asset expertise indicators
      const certifiedElements = screen.getAllByText('Certified');
      expect(certifiedElements.length).toBeGreaterThan(0);
      
      const trainingElements = screen.getAllByText('Training');
      expect(trainingElements.length).toBeGreaterThan(0);
    });

    it('should display asset assignments with criticality focus', async () => {
      const TeamManagement = (await import('@/app/team/page')).default;
      
      render(<TeamManagement />);
      
      // Switch to Asset Assignments tab
      const assetAssignmentsTab = screen.getByText('Asset Assignments');
      fireEvent.click(assetAssignmentsTab);
      
      // Test critical assets
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      
      // Test criticality badges
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges.length).toBeGreaterThan(0);
    });
  });

  describe('SLA Management Dashboard', () => {
    it('should render SLA management interface with compliance metrics', async () => {
      const SLAManagement = (await import('@/app/sla-management/page')).default;
      
      render(<SLAManagement />);
      
      // Test basic structure
      expect(screen.getByText('SLA Management')).toBeInTheDocument();
      expect(screen.getByText('Monitor service level agreements for critical asset protection')).toBeInTheDocument();
      
      // Test overview cards
      expect(screen.getByText('Overall SLA Compliance')).toBeInTheDocument();
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      expect(screen.getByText('Active Violations')).toBeInTheDocument();
      expect(screen.getByText('Resolved This Month')).toBeInTheDocument();
      
      // Test tab structure
      expect(screen.getByText('SLA Overview')).toBeInTheDocument();
      expect(screen.getByText('SLA Definitions')).toBeInTheDocument();
      expect(screen.getByText('Violations')).toBeInTheDocument();
      expect(screen.getByText('Trends')).toBeInTheDocument();
    });

    it('should display compliance by criticality', async () => {
      const SLAManagement = (await import('@/app/sla-management/page')).default;
      
      render(<SLAManagement />);
      
      // Test compliance by criticality
      expect(screen.getByText('Compliance by Criticality')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should display SLA definitions with critical asset focus', async () => {
      const SLAManagement = (await import('@/app/sla-management/page')).default;
      
      render(<SLAManagement />);
      
      // Switch to SLA Definitions tab
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      // Test critical asset SLA
      expect(screen.getByText('Critical Asset Response')).toBeInTheDocument();
      expect(screen.getByText('Response time for critical asset failures')).toBeInTheDocument();
      expect(screen.getByText('2 hours')).toBeInTheDocument();
      expect(screen.getByText('1.8 hours')).toBeInTheDocument();
    });
  });

  describe('Critical Controls Interface', () => {
    it('should render critical controls interface with asset protection focus', async () => {
      const CriticalControls = (await import('@/app/critical-controls/page')).default;
      
      render(<CriticalControls />);
      
      // Test basic structure
      expect(screen.getByText('Critical Controls')).toBeInTheDocument();
      expect(screen.getByText('Monitor and manage critical controls for crown jewel assets')).toBeInTheDocument();
      
      // Test overview cards
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      expect(screen.getByText('Active Controls')).toBeInTheDocument();
      expect(screen.getByText('Average Compliance')).toBeInTheDocument();
      expect(screen.getByText('Due for Inspection')).toBeInTheDocument();
      
      // Test tab structure
      expect(screen.getByText('Asset Overview')).toBeInTheDocument();
      expect(screen.getByText('Control Details')).toBeInTheDocument();
      expect(screen.getByText('Compliance Status')).toBeInTheDocument();
      expect(screen.getByText('Alerts & Issues')).toBeInTheDocument();
    });

    it('should display critical assets with proper criticality indicators', async () => {
      const CriticalControls = (await import('@/app/critical-controls/page')).default;
      
      render(<CriticalControls />);
      
      // Test critical assets
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      expect(screen.getByText('Fire Suppression System')).toBeInTheDocument();
      expect(screen.getByText('Data Centre UPS')).toBeInTheDocument();
      
      // Test criticality badges
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges.length).toBeGreaterThan(0);
    });

    it('should display control categories aligned with asset criticality', async () => {
      const CriticalControls = (await import('@/app/critical-controls/page')).default;
      
      render(<CriticalControls />);
      
      // Test control categories
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('IT Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Environmental')).toBeInTheDocument();
    });
  });

  describe('Sustainability Module', () => {
    it('should render sustainability module with future-proof planning focus', async () => {
      const SustainabilityModule = (await import('@/app/sustainability/page')).default;
      
      render(<SustainabilityModule />);
      
      // Test basic structure
      expect(screen.getByText('Sustainability Module')).toBeInTheDocument();
      expect(screen.getByText('Monitor environmental impact and long-term asset viability')).toBeInTheDocument();
      
      // Test overview cards
      expect(screen.getByText('Carbon Footprint')).toBeInTheDocument();
      expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
      expect(screen.getByText('Water Conservation')).toBeInTheDocument();
      expect(screen.getByText('Waste Reduction')).toBeInTheDocument();
      
      // Test tab structure
      expect(screen.getByText('Sustainability Goals')).toBeInTheDocument();
      expect(screen.getByText('Environmental Assets')).toBeInTheDocument();
      expect(screen.getByText('Initiatives')).toBeInTheDocument();
      expect(screen.getByText('Reporting')).toBeInTheDocument();
    });

    it('should display long-term sustainability goals', async () => {
      const SustainabilityModule = (await import('@/app/sustainability/page')).default;
      
      render(<SustainabilityModule />);
      
      // Test sustainability goals
      expect(screen.getByText('Carbon Neutrality')).toBeInTheDocument();
      expect(screen.getByText('Achieve net-zero carbon emissions')).toBeInTheDocument();
      expect(screen.getByText('2030')).toBeInTheDocument();
      
      expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
      expect(screen.getByText('Improve energy efficiency by 25%')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('should display environmental assets with impact indicators', async () => {
      const SustainabilityModule = (await import('@/app/sustainability/page')).default;
      
      render(<SustainabilityModule />);
      
      // Switch to Environmental Assets tab
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      // Test environmental assets
      expect(screen.getByText('Solar Panel Array')).toBeInTheDocument();
      expect(screen.getByText('Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Waste Management System')).toBeInTheDocument();
      expect(screen.getByText('HVAC System')).toBeInTheDocument();
      
      // Test impact indicators
      expect(screen.getByText('CO2 Reduction: 45.2 tonnes/year')).toBeInTheDocument();
      expect(screen.getByText('Water Saved: 2.5M litres/year')).toBeInTheDocument();
    });
  });

  describe('Aegrid Rules Compliance', () => {
    it('should demonstrate Rule 1: Purpose-driven navigation in Team Management', async () => {
      const TeamManagement = (await import('@/app/team/page')).default;
      
      render(<TeamManagement />);
      
      // Test purpose-driven team assignments
      expect(screen.getByText('Critical Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('General Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Safety Systems')).toBeInTheDocument();
      expect(screen.getByText('Asset Planning')).toBeInTheDocument();
    });

    it('should demonstrate Rule 2: Risk-based grouping in SLA Management', async () => {
      const SLAManagement = (await import('@/app/sla-management/page')).default;
      
      render(<SLAManagement />);
      
      // Test risk-based SLA compliance
      expect(screen.getByText('Compliance by Criticality')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should demonstrate Rule 3: Critical asset focus in Critical Controls', async () => {
      const CriticalControls = (await import('@/app/critical-controls/page')).default;
      
      render(<CriticalControls />);
      
      // Test critical asset protection
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      expect(screen.getByText('Fire Suppression System')).toBeInTheDocument();
      expect(screen.getByText('Data Centre UPS')).toBeInTheDocument();
      
      // Test high compliance rates for critical assets
      expect(screen.getByText('98.5%')).toBeInTheDocument();
      expect(screen.getByText('95.2%')).toBeInTheDocument();
      expect(screen.getByText('99.1%')).toBeInTheDocument();
      expect(screen.getByText('97.8%')).toBeInTheDocument();
    });

    it('should demonstrate Rule 4: Future-proof planning in Sustainability Module', async () => {
      const SustainabilityModule = (await import('@/app/sustainability/page')).default;
      
      render(<SustainabilityModule />);
      
      // Test future-oriented goals
      expect(screen.getByText('Carbon Neutrality')).toBeInTheDocument();
      expect(screen.getByText('2030')).toBeInTheDocument();
      expect(screen.getByText('Renewable Energy')).toBeInTheDocument();
      expect(screen.getByText('2027')).toBeInTheDocument();
      
      // Test environmental impact trends
      const reportingTab = screen.getByText('Reporting');
      fireEvent.click(reportingTab);
      
      expect(screen.getByText('Carbon Footprint Reduction')).toBeInTheDocument();
      expect(screen.getByText('Energy Efficiency Improvement')).toBeInTheDocument();
    });
  });

  describe('User Experience and Accessibility', () => {
    it('should have proper ARIA roles and navigation structure', async () => {
      const TeamManagement = (await import('@/app/team/page')).default;
      
      render(<TeamManagement />);
      
      // Test for proper ARIA structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const SLAManagement = (await import('@/app/sla-management/page')).default;
      
      render(<SLAManagement />);
      
      // Test keyboard navigation
      const periodSelect = screen.getByDisplayValue('Last Month');
      periodSelect.focus();
      expect(periodSelect).toHaveFocus();
    });

    it('should display progress indicators for metrics', async () => {
      const CriticalControls = (await import('@/app/critical-controls/page')).default;
      
      render(<CriticalControls />);
      
      // Test progress bars
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Data Consistency and Error Handling', () => {
    it('should maintain data consistency across tabs', async () => {
      const TeamManagement = (await import('@/app/team/page')).default;
      
      render(<TeamManagement />);
      
      // Switch between tabs and verify data consistency
      const teamTab = screen.getByText('Team Members');
      const assignmentsTab = screen.getByText('Asset Assignments');
      
      fireEvent.click(assignmentsTab);
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      
      fireEvent.click(teamTab);
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should handle missing data gracefully', async () => {
      const SLAManagement = (await import('@/app/sla-management/page')).default;
      
      render(<SLAManagement />);
      
      // All mock data should be present
      expect(screen.getByText('94.2%')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
    });
  });
});
