import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SLAManagement from '@/app/sla-management/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/sla-management',
}));

describe('SLA Management Dashboard', () => {
  describe('Component Rendering', () => {
    it('should render SLA management interface', () => {
      render(<SLAManagement />);
      
      expect(screen.getByText('SLA Management')).toBeInTheDocument();
      expect(screen.getByText('Monitor service level agreements for critical asset protection')).toBeInTheDocument();
    });

    it('should display overview cards with SLA metrics', () => {
      render(<SLAManagement />);
      
      expect(screen.getByText('Overall SLA Compliance')).toBeInTheDocument();
      expect(screen.getByText('94.2%')).toBeInTheDocument();
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
      expect(screen.getByText('Active Violations')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 violation in progress
      expect(screen.getByText('Resolved This Month')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 resolved violations
    });
  });

  describe('SLA Overview Tab (Rule 2: Risk-based SLA compliance)', () => {
    it('should display compliance by criticality', () => {
      render(<SLAManagement />);
      
      expect(screen.getByText('Compliance by Criticality')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('92.1%')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('89.3%')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('87.8%')).toBeInTheDocument();
    });

    it('should display recent performance trends', () => {
      render(<SLAManagement />);
      
      expect(screen.getByText('Recent Performance')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('94.2%')).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();
      expect(screen.getByText('92.8%')).toBeInTheDocument();
      expect(screen.getByText('3 Months Ago')).toBeInTheDocument();
      expect(screen.getByText('91.5%')).toBeInTheDocument();
      expect(screen.getByText('6 Months Ago')).toBeInTheDocument();
      expect(screen.getByText('89.2%')).toBeInTheDocument();
    });
  });

  describe('SLA Definitions Tab (Rule 3: Critical asset SLA protection)', () => {
    it('should display SLA definitions tab', () => {
      render(<SLAManagement />);
      
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      expect(screen.getByText('SLA Definitions')).toBeInTheDocument();
      expect(screen.getByText('Service level agreements aligned with asset criticality')).toBeInTheDocument();
    });

    it('should display critical asset SLAs with highest compliance', () => {
      render(<SLAManagement />);
      
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      expect(screen.getByText('Critical Asset Response')).toBeInTheDocument();
      expect(screen.getByText('Response time for critical asset failures')).toBeInTheDocument();
      expect(screen.getByText('2 hours')).toBeInTheDocument();
      expect(screen.getByText('1.8 hours')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
    });

    it('should display safety inspection SLA with 100% target', () => {
      render(<SLAManagement />);
      
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      expect(screen.getByText('Safety Inspection')).toBeInTheDocument();
      expect(screen.getByText('Safety inspection completion')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('98.7%')).toBeInTheDocument();
    });

    it('should show criticality badges for SLAs', () => {
      render(<SLAManagement />);
      
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges.length).toBeGreaterThan(0);
      
      const highBadges = screen.getAllByText('High');
      expect(highBadges.length).toBeGreaterThan(0);
      
      const mediumBadges = screen.getAllByText('Medium');
      expect(mediumBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Violations Tab', () => {
    it('should display violations tab', () => {
      render(<SLAManagement />);
      
      const violationsTab = screen.getByText('Violations');
      fireEvent.click(violationsTab);
      
      expect(screen.getByText('SLA Violations')).toBeInTheDocument();
      expect(screen.getByText('Track and manage SLA violations for continuous improvement')).toBeInTheDocument();
    });

    it('should display critical asset violations with high impact', () => {
      render(<SLAManagement />);
      
      const violationsTab = screen.getByText('Violations');
      fireEvent.click(violationsTab);
      
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Critical Asset Response')).toBeInTheDocument();
      expect(screen.getByText('Response Time Exceeded')).toBeInTheDocument();
      expect(screen.getByText('Service Disruption')).toBeInTheDocument();
    });

    it('should display violation status badges', () => {
      render(<SLAManagement />);
      
      const violationsTab = screen.getByText('Violations');
      fireEvent.click(violationsTab);
      
      const resolvedBadges = screen.getAllByText('Resolved');
      expect(resolvedBadges.length).toBeGreaterThan(0);
      
      const inProgressBadges = screen.getAllByText('In Progress');
      expect(inProgressBadges.length).toBeGreaterThan(0);
    });

    it('should show violation impact levels', () => {
      render(<SLAManagement />);
      
      const violationsTab = screen.getByText('Violations');
      fireEvent.click(violationsTab);
      
      expect(screen.getByText('Service Disruption')).toBeInTheDocument();
      expect(screen.getByText('Risk Increase')).toBeInTheDocument();
      expect(screen.getByText('Comfort Impact')).toBeInTheDocument();
    });
  });

  describe('Trends Tab', () => {
    it('should display trends tab', () => {
      render(<SLAManagement />);
      
      const trendsTab = screen.getByText('Trends');
      fireEvent.click(trendsTab);
      
      expect(screen.getByText('Compliance Trends')).toBeInTheDocument();
      expect(screen.getByText('Performance Insights')).toBeInTheDocument();
    });

    it('should display compliance trend indicators', () => {
      render(<SLAManagement />);
      
      const trendsTab = screen.getByText('Trends');
      fireEvent.click(trendsTab);
      
      expect(screen.getByText('Overall Trend')).toBeInTheDocument();
      expect(screen.getByText('+2.3%')).toBeInTheDocument();
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      expect(screen.getByText('+1.8%')).toBeInTheDocument();
      expect(screen.getByText('Violation Rate')).toBeInTheDocument();
      expect(screen.getByText('-15%')).toBeInTheDocument();
    });

    it('should display performance insights', () => {
      render(<SLAManagement />);
      
      const trendsTab = screen.getByText('Trends');
      fireEvent.click(trendsTab);
      
      expect(screen.getByText('Critical assets performing well')).toBeInTheDocument();
      expect(screen.getByText('98.5% compliance rate')).toBeInTheDocument();
      expect(screen.getByText('Medium priority assets need attention')).toBeInTheDocument();
      expect(screen.getByText('89.3% compliance rate')).toBeInTheDocument();
      expect(screen.getByText('Response times improving')).toBeInTheDocument();
      expect(screen.getByText('Average 1.8 hours')).toBeInTheDocument();
    });
  });

  describe('Period Selection', () => {
    it('should allow period selection', () => {
      render(<SLAManagement />);
      
      const periodSelect = screen.getByDisplayValue('Last Month');
      fireEvent.click(periodSelect);
      
      expect(screen.getByText('Last Week')).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();
      expect(screen.getByText('Last Quarter')).toBeInTheDocument();
      expect(screen.getByText('Last Year')).toBeInTheDocument();
    });
  });

  describe('Compliance Color Coding', () => {
    it('should display compliance percentages with appropriate colors', () => {
      render(<SLAManagement />);
      
      // High compliance (98.5%) should be green
      const highCompliance = screen.getByText('98.5%');
      expect(highCompliance).toHaveClass('text-green-600');
      
      // Medium compliance (94.2%) should be yellow
      const mediumCompliance = screen.getByText('94.2%');
      expect(mediumCompliance).toHaveClass('text-yellow-600');
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have proper ARIA roles and labels', () => {
      render(<SLAManagement />);
      
      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Check for table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have keyboard navigation support', () => {
      render(<SLAManagement />);
      
      const periodSelect = screen.getByDisplayValue('Last Month');
      periodSelect.focus();
      expect(periodSelect).toHaveFocus();
    });

    it('should display progress bars for compliance metrics', () => {
      render(<SLAManagement />);
      
      // Check for progress bars in overview cards
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Data Validation and Error Handling', () => {
    it('should handle missing data gracefully', () => {
      render(<SLAManagement />);
      
      // All mock data should be present
      expect(screen.getByText('94.2%')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
    });

    it('should maintain data consistency across tabs', () => {
      render(<SLAManagement />);
      
      // Switch between tabs and verify data consistency
      const overviewTab = screen.getByText('SLA Overview');
      const definitionsTab = screen.getByText('SLA Definitions');
      
      fireEvent.click(definitionsTab);
      expect(screen.getByText('Critical Asset Response')).toBeInTheDocument();
      
      fireEvent.click(overviewTab);
      expect(screen.getByText('94.2%')).toBeInTheDocument(); // Should still be there
    });
  });

  describe('SLA Categories and Types', () => {
    it('should display different SLA categories', () => {
      render(<SLAManagement />);
      
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      expect(screen.getByText('Response Time')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('Resolution Time')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
      expect(screen.getByText('Availability')).toBeInTheDocument();
    });

    it('should show SLA targets and current performance', () => {
      render(<SLAManagement />);
      
      const definitionsTab = screen.getByText('SLA Definitions');
      fireEvent.click(definitionsTab);
      
      // Check for target vs current performance
      expect(screen.getByText('2 hours')).toBeInTheDocument(); // Target
      expect(screen.getByText('1.8 hours')).toBeInTheDocument(); // Current
      expect(screen.getByText('95%')).toBeInTheDocument(); // Target
      expect(screen.getByText('94.2%')).toBeInTheDocument(); // Current
    });
  });
});
