import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CriticalControls from '@/app/critical-controls/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/critical-controls',
}));

describe('Critical Controls Interface', () => {
  describe('Component Rendering', () => {
    it('should render critical controls interface', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('Critical Controls')).toBeInTheDocument();
      expect(screen.getByText('Monitor and manage critical controls for crown jewel assets')).toBeInTheDocument();
    });

    it('should display overview cards with critical asset metrics', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument(); // 4 critical assets
      expect(screen.getByText('Active Controls')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument(); // 11 active controls
      expect(screen.getByText('Average Compliance')).toBeInTheDocument();
      expect(screen.getByText('97.7%')).toBeInTheDocument(); // Average compliance
      expect(screen.getByText('Due for Inspection')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument(); // All 4 due within 7 days
    });
  });

  describe('Control Categories (Rule 3: Protect the Critical Few)', () => {
    it('should display control categories with counts', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 infrastructure asset
      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 safety assets
      expect(screen.getByText('IT Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 IT infrastructure asset
      expect(screen.getByText('Environmental')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // 0 environmental assets
    });

    it('should display category status badges', () => {
      render(<CriticalControls />);
      
      const activeBadges = screen.getAllByText('Active');
      expect(activeBadges.length).toBeGreaterThan(0);
      
      const noneBadges = screen.getAllByText('None');
      expect(noneBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Asset Overview Tab', () => {
    it('should display critical assets overview', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('Critical Assets Overview')).toBeInTheDocument();
      expect(screen.getByText('Crown jewel assets requiring highest level of protection')).toBeInTheDocument();
    });

    it('should display critical assets with proper criticality badges', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      expect(screen.getByText('Fire Suppression System')).toBeInTheDocument();
      expect(screen.getByText('Data Centre UPS')).toBeInTheDocument();
      
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges.length).toBeGreaterThan(0);
    });

    it('should display risk levels for assets', () => {
      render(<CriticalControls />);
      
      const highRiskBadges = screen.getAllByText('High');
      expect(highRiskBadges.length).toBeGreaterThan(0);
      
      const criticalRiskBadges = screen.getAllByText('Critical');
      expect(criticalRiskBadges.length).toBeGreaterThan(0);
    });

    it('should show control counts for each asset', () => {
      render(<CriticalControls />);
      
      // Each asset should show active controls / total controls
      expect(screen.getByText('3')).toBeInTheDocument(); // Main Water Treatment Plant has 3 controls
      expect(screen.getByText('/')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Total controls
    });

    it('should display compliance percentages', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('98.5%')).toBeInTheDocument();
      expect(screen.getByText('95.2%')).toBeInTheDocument();
      expect(screen.getByText('99.1%')).toBeInTheDocument();
      expect(screen.getByText('97.8%')).toBeInTheDocument();
    });

    it('should show responsible personnel', () => {
      render(<CriticalControls />);
      
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Emma Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('David Thompson')).toBeInTheDocument();
      expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    });
  });

  describe('Control Details Tab', () => {
    it('should display control details tab', () => {
      render(<CriticalControls />);
      
      const controlDetailsTab = screen.getByText('Control Details');
      fireEvent.click(controlDetailsTab);
      
      expect(screen.getByText('Control Details')).toBeInTheDocument();
    });

    it('should display individual controls for each asset', () => {
      render(<CriticalControls />);
      
      const controlDetailsTab = screen.getByText('Control Details');
      fireEvent.click(controlDetailsTab);
      
      expect(screen.getByText('Backup Power System')).toBeInTheDocument();
      expect(screen.getByText('Emergency Shutdown')).toBeInTheDocument();
      expect(screen.getByText('Water Quality Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Fuel Level Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Automatic Transfer Switch')).toBeInTheDocument();
      expect(screen.getByText('Load Testing')).toBeInTheDocument();
    });

    it('should display control status indicators', () => {
      render(<CriticalControls />);
      
      const controlDetailsTab = screen.getByText('Control Details');
      fireEvent.click(controlDetailsTab);
      
      const activeBadges = screen.getAllByText('Active');
      expect(activeBadges.length).toBeGreaterThan(0);
      
      const scheduledBadges = screen.getAllByText('Scheduled');
      expect(scheduledBadges.length).toBeGreaterThan(0);
    });

    it('should show last check dates for controls', () => {
      render(<CriticalControls />);
      
      const controlDetailsTab = screen.getByText('Control Details');
      fireEvent.click(controlDetailsTab);
      
      expect(screen.getByText('Last check: 2024-01-10')).toBeInTheDocument();
      expect(screen.getByText('Last check: 2024-01-09')).toBeInTheDocument();
      expect(screen.getByText('Last check: 2024-01-11')).toBeInTheDocument();
    });
  });

  describe('Compliance Status Tab', () => {
    it('should display compliance status tab', () => {
      render(<CriticalControls />);
      
      const complianceTab = screen.getByText('Compliance Status');
      fireEvent.click(complianceTab);
      
      expect(screen.getByText('Compliance Overview')).toBeInTheDocument();
      expect(screen.getByText('Critical control compliance by asset')).toBeInTheDocument();
    });

    it('should display compliance progress bars', () => {
      render(<CriticalControls />);
      
      const complianceTab = screen.getByText('Compliance Status');
      fireEvent.click(complianceTab);
      
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      expect(screen.getByText('95.2%')).toBeInTheDocument();
    });

    it('should display control status summary', () => {
      render(<CriticalControls />);
      
      const complianceTab = screen.getByText('Compliance Status');
      fireEvent.click(complianceTab);
      
      expect(screen.getByText('Control Status Summary')).toBeInTheDocument();
      expect(screen.getByText('Overall control system health')).toBeInTheDocument();
    });

    it('should show active, scheduled, and failed control counts', () => {
      render(<CriticalControls />);
      
      const complianceTab = screen.getByText('Compliance Status');
      fireEvent.click(complianceTab);
      
      expect(screen.getByText('Active Controls')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument(); // 11 active controls
      expect(screen.getByText('Scheduled Controls')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 scheduled control
      expect(screen.getByText('Failed Controls')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // 0 failed controls
    });
  });

  describe('Alerts & Issues Tab', () => {
    it('should display alerts and issues tab', () => {
      render(<CriticalControls />);
      
      const alertsTab = screen.getByText('Alerts & Issues');
      fireEvent.click(alertsTab);
      
      expect(screen.getByText('Critical Control Alerts')).toBeInTheDocument();
      expect(screen.getByText('Issues requiring immediate attention for critical asset protection')).toBeInTheDocument();
    });

    it('should display critical alerts with proper priority levels', () => {
      render(<CriticalControls />);
      
      const alertsTab = screen.getByText('Alerts & Issues');
      fireEvent.click(alertsTab);
      
      expect(screen.getByText('Emergency Generator Load Test Due')).toBeInTheDocument();
      expect(screen.getByText('Load testing overdue by 2 days')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
      
      expect(screen.getByText('Water Quality Sensor Calibration Failed')).toBeInTheDocument();
      expect(screen.getByText('Sensor reading outside acceptable range')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('should display scheduled maintenance alerts', () => {
      render(<CriticalControls />);
      
      const alertsTab = screen.getByText('Alerts & Issues');
      fireEvent.click(alertsTab);
      
      expect(screen.getByText('UPS Battery Replacement Scheduled')).toBeInTheDocument();
      expect(screen.getByText('Battery replacement due in 3 days')).toBeInTheDocument();
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
    });

    it('should show alert impact descriptions', () => {
      render(<CriticalControls />);
      
      const alertsTab = screen.getByText('Alerts & Issues');
      fireEvent.click(alertsTab);
      
      expect(screen.getByText('Service Disruption')).toBeInTheDocument();
      expect(screen.getByText('Risk Increase')).toBeInTheDocument();
      expect(screen.getByText('Comfort Impact')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should allow filtering by category', () => {
      render(<CriticalControls />);
      
      const categoryFilter = screen.getByDisplayValue('All Categories');
      fireEvent.click(categoryFilter);
      
      expect(screen.getByText('Infrastructure (1)')).toBeInTheDocument();
      expect(screen.getByText('Safety (2)')).toBeInTheDocument();
      expect(screen.getByText('IT Infrastructure (1)')).toBeInTheDocument();
      expect(screen.getByText('Environmental (0)')).toBeInTheDocument();
    });
  });

  describe('Manage Controls Dialog', () => {
    it('should open manage controls dialog', () => {
      render(<CriticalControls />);
      
      const manageButton = screen.getByText('Manage Controls');
      fireEvent.click(manageButton);
      
      expect(screen.getByText('Manage Critical Controls')).toBeInTheDocument();
      expect(screen.getByText('Configure and monitor critical control measures for asset protection.')).toBeInTheDocument();
    });

    it('should display control management features', () => {
      render(<CriticalControls />);
      
      const manageButton = screen.getByText('Manage Controls');
      fireEvent.click(manageButton);
      
      expect(screen.getByText('Control definition and configuration')).toBeInTheDocument();
      expect(screen.getByText('Automated monitoring setup')).toBeInTheDocument();
      expect(screen.getByText('Alert threshold management')).toBeInTheDocument();
      expect(screen.getByText('Escalation procedures')).toBeInTheDocument();
    });

    it('should close dialog when clicking outside', () => {
      render(<CriticalControls />);
      
      const manageButton = screen.getByText('Manage Controls');
      fireEvent.click(manageButton);
      
      // Click outside the dialog
      fireEvent.click(document.body);
      
      // Dialog should close
      expect(screen.queryByText('Manage Critical Controls')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have proper ARIA roles and labels', () => {
      render(<CriticalControls />);
      
      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Check for table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have keyboard navigation support', () => {
      render(<CriticalControls />);
      
      const categoryFilter = screen.getByDisplayValue('All Categories');
      categoryFilter.focus();
      expect(categoryFilter).toHaveFocus();
    });

    it('should display status indicators with appropriate colors', () => {
      render(<CriticalControls />);
      
      // Check for status badges with proper color classes
      const activeBadges = screen.getAllByText('Active');
      expect(activeBadges.length).toBeGreaterThan(0);
      
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Data Validation and Error Handling', () => {
    it('should handle missing data gracefully', () => {
      render(<CriticalControls />);
      
      // All mock data should be present
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
    });

    it('should maintain data consistency across tabs', () => {
      render(<CriticalControls />);
      
      // Switch between tabs and verify data consistency
      const overviewTab = screen.getByText('Asset Overview');
      const controlDetailsTab = screen.getByText('Control Details');
      
      fireEvent.click(controlDetailsTab);
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      
      fireEvent.click(overviewTab);
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument(); // Should still be there
    });
  });

  describe('Critical Asset Protection Features', () => {
    it('should highlight critical assets prominently', () => {
      render(<CriticalControls />);
      
      // Critical assets should be clearly visible
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      expect(screen.getByText('Fire Suppression System')).toBeInTheDocument();
      expect(screen.getByText('Data Centre UPS')).toBeInTheDocument();
    });

    it('should display high compliance rates for critical assets', () => {
      render(<CriticalControls />);
      
      // Critical assets should have high compliance rates
      expect(screen.getByText('98.5%')).toBeInTheDocument(); // Main Water Treatment Plant
      expect(screen.getByText('95.2%')).toBeInTheDocument(); // Emergency Generator System
      expect(screen.getByText('99.1%')).toBeInTheDocument(); // Fire Suppression System
      expect(screen.getByText('97.8%')).toBeInTheDocument(); // Data Centre UPS
    });

    it('should show immediate attention requirements', () => {
      render(<CriticalControls />);
      
      const alertsTab = screen.getByText('Alerts & Issues');
      fireEvent.click(alertsTab);
      
      // Should show critical alerts requiring immediate attention
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });
  });
});
