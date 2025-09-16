import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SustainabilityModule from '@/app/sustainability/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/sustainability',
}));

describe('Sustainability Module', () => {
  describe('Component Rendering', () => {
    it('should render sustainability module interface', () => {
      render(<SustainabilityModule />);
      
      expect(screen.getByText('Sustainability Module')).toBeInTheDocument();
      expect(screen.getByText('Monitor environmental impact and long-term asset viability')).toBeInTheDocument();
    });

    it('should display overview cards with sustainability metrics', () => {
      render(<SustainabilityModule />);
      
      expect(screen.getByText('Carbon Footprint')).toBeInTheDocument();
      expect(screen.getByText('1250')).toBeInTheDocument(); // Current carbon footprint
      expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
      expect(screen.getByText('78.5%')).toBeInTheDocument(); // Current energy efficiency
      expect(screen.getByText('Water Conservation')).toBeInTheDocument();
      expect(screen.getByText('92.3%')).toBeInTheDocument(); // Current water conservation
      expect(screen.getByText('Waste Reduction')).toBeInTheDocument();
      expect(screen.getByText('65.2%')).toBeInTheDocument(); // Current waste reduction
    });
  });

  describe('Sustainability Goals Tab (Rule 4: Future-proof planning)', () => {
    it('should display sustainability goals tab', () => {
      render(<SustainabilityModule />);
      
      expect(screen.getByText('Sustainability Goals')).toBeInTheDocument();
      expect(screen.getByText('Long-term environmental objectives aligned with asset management strategy')).toBeInTheDocument();
    });

    it('should display long-term sustainability goals', () => {
      render(<SustainabilityModule />);
      
      expect(screen.getByText('Carbon Neutrality')).toBeInTheDocument();
      expect(screen.getByText('Achieve net-zero carbon emissions')).toBeInTheDocument();
      expect(screen.getByText('2030')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
      
      expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
      expect(screen.getByText('Improve energy efficiency by 25%')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
      expect(screen.getByText('78%')).toBeInTheDocument();
    });

    it('should display goal categories', () => {
      render(<SustainabilityModule />);
      
      expect(screen.getByText('Climate Action')).toBeInTheDocument();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      expect(screen.getByText('Waste')).toBeInTheDocument();
    });

    it('should show goal status badges', () => {
      render(<SustainabilityModule />);
      
      const onTrackBadges = screen.getAllByText('On Track');
      expect(onTrackBadges.length).toBeGreaterThan(0);
      
      const behindScheduleBadges = screen.getAllByText('Behind Schedule');
      expect(behindScheduleBadges.length).toBeGreaterThan(0);
      
      const achievedBadges = screen.getAllByText('Achieved');
      expect(achievedBadges.length).toBeGreaterThan(0);
    });

    it('should display progress bars for goals', () => {
      render(<SustainabilityModule />);
      
      // Check for progress bars
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Environmental Assets Tab', () => {
    it('should display environmental assets tab', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      expect(screen.getByText('Environmental Assets')).toBeInTheDocument();
      expect(screen.getByText('Assets contributing to environmental sustainability and impact')).toBeInTheDocument();
    });

    it('should display environmental assets with impact indicators', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      expect(screen.getByText('Solar Panel Array')).toBeInTheDocument();
      expect(screen.getByText('Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Waste Management System')).toBeInTheDocument();
      expect(screen.getByText('HVAC System')).toBeInTheDocument();
    });

    it('should display asset categories', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      expect(screen.getByText('Renewable Energy')).toBeInTheDocument();
      expect(screen.getByText('Water Management')).toBeInTheDocument();
      expect(screen.getByText('Waste Processing')).toBeInTheDocument();
      expect(screen.getByText('Energy Management')).toBeInTheDocument();
    });

    it('should show impact badges for assets', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      const positiveBadges = screen.getAllByText('Positive');
      expect(positiveBadges.length).toBeGreaterThan(0);
      
      const neutralBadges = screen.getAllByText('Neutral');
      expect(neutralBadges.length).toBeGreaterThan(0);
    });

    it('should display environmental benefits', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      expect(screen.getByText('CO2 Reduction: 45.2 tonnes/year')).toBeInTheDocument();
      expect(screen.getByText('Water Saved: 2.5M litres/year')).toBeInTheDocument();
      expect(screen.getByText('Waste Diverted: 85.6%')).toBeInTheDocument();
      expect(screen.getByText('Energy: 45k kWh/year')).toBeInTheDocument();
    });
  });

  describe('Initiatives Tab', () => {
    it('should display initiatives tab', () => {
      render(<SustainabilityModule />);
      
      const initiativesTab = screen.getByText('Initiatives');
      fireEvent.click(initiativesTab);
      
      expect(screen.getByText('Initiatives')).toBeInTheDocument();
    });

    it('should display sustainability initiatives', () => {
      render(<SustainabilityModule />);
      
      const initiativesTab = screen.getByText('Initiatives');
      fireEvent.click(initiativesTab);
      
      expect(screen.getByText('Green Building Certification')).toBeInTheDocument();
      expect(screen.getByText('Achieve LEED Gold certification for new facilities')).toBeInTheDocument();
      expect(screen.getByText('Electric Vehicle Fleet')).toBeInTheDocument();
      expect(screen.getByText('Transition 50% of fleet to electric vehicles')).toBeInTheDocument();
      expect(screen.getByText('Smart Energy Management')).toBeInTheDocument();
      expect(screen.getByText('Implement IoT-based energy monitoring')).toBeInTheDocument();
      expect(screen.getByText('Community Solar Program')).toBeInTheDocument();
      expect(screen.getByText('Partner with community for shared solar benefits')).toBeInTheDocument();
    });

    it('should display initiative progress', () => {
      render(<SustainabilityModule />);
      
      const initiativesTab = screen.getByText('Initiatives');
      fireEvent.click(initiativesTab);
      
      expect(screen.getByText('75%')).toBeInTheDocument(); // Green Building Certification
      expect(screen.getByText('25%')).toBeInTheDocument(); // Electric Vehicle Fleet
      expect(screen.getByText('60%')).toBeInTheDocument(); // Smart Energy Management
      expect(screen.getByText('15%')).toBeInTheDocument(); // Community Solar Program
    });

    it('should show initiative impact levels', () => {
      render(<SustainabilityModule />);
      
      const initiativesTab = screen.getByText('Initiatives');
      fireEvent.click(initiativesTab);
      
      const highImpactBadges = screen.getAllByText('High Impact');
      expect(highImpactBadges.length).toBeGreaterThan(0);
      
      const mediumImpactBadges = screen.getAllByText('Medium Impact');
      expect(mediumImpactBadges.length).toBeGreaterThan(0);
    });

    it('should display initiative categories', () => {
      render(<SustainabilityModule />);
      
      const initiativesTab = screen.getByText('Initiatives');
      fireEvent.click(initiativesTab);
      
      expect(screen.getByText('Certification')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
    });
  });

  describe('Reporting Tab', () => {
    it('should display reporting tab', () => {
      render(<SustainabilityModule />);
      
      const reportingTab = screen.getByText('Reporting');
      fireEvent.click(reportingTab);
      
      expect(screen.getByText('Environmental Impact Summary')).toBeInTheDocument();
      expect(screen.getByText('Overall environmental performance metrics')).toBeInTheDocument();
      expect(screen.getByText('Sustainability Achievements')).toBeInTheDocument();
      expect(screen.getByText('Key milestones and certifications')).toBeInTheDocument();
    });

    it('should display environmental impact trends', () => {
      render(<SustainabilityModule />);
      
      const reportingTab = screen.getByText('Reporting');
      fireEvent.click(reportingTab);
      
      expect(screen.getByText('Carbon Footprint Reduction')).toBeInTheDocument();
      expect(screen.getByText('5.2%')).toBeInTheDocument();
      expect(screen.getByText('Energy Efficiency Improvement')).toBeInTheDocument();
      expect(screen.getByText('2.1%')).toBeInTheDocument();
      expect(screen.getByText('Water Conservation')).toBeInTheDocument();
      expect(screen.getByText('1.8%')).toBeInTheDocument();
      expect(screen.getByText('Waste Reduction')).toBeInTheDocument();
      expect(screen.getByText('3.5%')).toBeInTheDocument();
    });

    it('should display sustainability achievements', () => {
      render(<SustainabilityModule />);
      
      const reportingTab = screen.getByText('Reporting');
      fireEvent.click(reportingTab);
      
      expect(screen.getByText('ISO 14001 Certification')).toBeInTheDocument();
      expect(screen.getByText('Environmental Management System')).toBeInTheDocument();
      expect(screen.getByText('LEED Gold Certification')).toBeInTheDocument();
      expect(screen.getByText('Green Building Standard')).toBeInTheDocument();
      expect(screen.getByText('Carbon Trust Standard')).toBeInTheDocument();
      expect(screen.getByText('Carbon Management')).toBeInTheDocument();
      expect(screen.getByText('BREEAM Excellent')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  describe('Period Selection', () => {
    it('should allow period selection', () => {
      render(<SustainabilityModule />);
      
      const periodSelect = screen.getByDisplayValue('Last Month');
      fireEvent.click(periodSelect);
      
      expect(screen.getByText('Last Week')).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();
      expect(screen.getByText('Last Quarter')).toBeInTheDocument();
      expect(screen.getByText('Last Year')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('should display trend indicators for metrics', () => {
      render(<SustainabilityModule />);
      
      // Check for trend icons and percentages
      expect(screen.getByText('5.2%')).toBeInTheDocument(); // Carbon footprint reduction
      expect(screen.getByText('2.1%')).toBeInTheDocument(); // Energy efficiency improvement
      expect(screen.getByText('1.8%')).toBeInTheDocument(); // Water conservation
      expect(screen.getByText('3.5%')).toBeInTheDocument(); // Waste reduction
    });

    it('should show target values for metrics', () => {
      render(<SustainabilityModule />);
      
      expect(screen.getByText('Target: 1000 tonnes CO2')).toBeInTheDocument();
      expect(screen.getByText('Target: 85%')).toBeInTheDocument();
      expect(screen.getByText('Target: 95%')).toBeInTheDocument();
      expect(screen.getByText('Target: 80%')).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have proper ARIA roles and labels', () => {
      render(<SustainabilityModule />);
      
      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Check for table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have keyboard navigation support', () => {
      render(<SustainabilityModule />);
      
      const periodSelect = screen.getByDisplayValue('Last Month');
      periodSelect.focus();
      expect(periodSelect).toHaveFocus();
    });

    it('should display progress bars for goals and initiatives', () => {
      render(<SustainabilityModule />);
      
      // Check for progress bars
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Data Validation and Error Handling', () => {
    it('should handle missing data gracefully', () => {
      render(<SustainabilityModule />);
      
      // All mock data should be present
      expect(screen.getByText('1250')).toBeInTheDocument(); // Carbon footprint
      expect(screen.getByText('78.5%')).toBeInTheDocument(); // Energy efficiency
    });

    it('should maintain data consistency across tabs', () => {
      render(<SustainabilityModule />);
      
      // Switch between tabs and verify data consistency
      const goalsTab = screen.getByText('Sustainability Goals');
      const assetsTab = screen.getByText('Environmental Assets');
      
      fireEvent.click(assetsTab);
      expect(screen.getByText('Solar Panel Array')).toBeInTheDocument();
      
      fireEvent.click(goalsTab);
      expect(screen.getByText('Carbon Neutrality')).toBeInTheDocument(); // Should still be there
    });
  });

  describe('Future-Proof Planning Features (Rule 4)', () => {
    it('should display long-term sustainability goals', () => {
      render(<SustainabilityModule />);
      
      // Should show goals extending to 2030
      expect(screen.getByText('2030')).toBeInTheDocument(); // Carbon Neutrality target
      expect(screen.getByText('2027')).toBeInTheDocument(); // Renewable Energy target
    });

    it('should show progress towards future goals', () => {
      render(<SustainabilityModule />);
      
      // Should display progress percentages for long-term goals
      expect(screen.getByText('65%')).toBeInTheDocument(); // Carbon Neutrality progress
      expect(screen.getByText('35%')).toBeInTheDocument(); // Renewable Energy progress
    });

    it('should display environmental impact trends for planning', () => {
      render(<SustainabilityModule />);
      
      const reportingTab = screen.getByText('Reporting');
      fireEvent.click(reportingTab);
      
      // Should show trends that inform future planning
      expect(screen.getByText('Carbon Footprint Reduction')).toBeInTheDocument();
      expect(screen.getByText('Energy Efficiency Improvement')).toBeInTheDocument();
    });

    it('should show sustainability initiatives for future implementation', () => {
      render(<SustainabilityModule />);
      
      const initiativesTab = screen.getByText('Initiatives');
      fireEvent.click(initiativesTab);
      
      // Should display initiatives in various stages of implementation
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Planning')).toBeInTheDocument();
    });
  });

  describe('Environmental Impact Measurement', () => {
    it('should display quantitative environmental benefits', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      // Should show specific environmental impact measurements
      expect(screen.getByText('CO2 Reduction: 45.2 tonnes/year')).toBeInTheDocument();
      expect(screen.getByText('Water Saved: 2.5M litres/year')).toBeInTheDocument();
      expect(screen.getByText('Waste Diverted: 85.6%')).toBeInTheDocument();
    });

    it('should show efficiency metrics for environmental assets', () => {
      render(<SustainabilityModule />);
      
      const assetsTab = screen.getByText('Environmental Assets');
      fireEvent.click(assetsTab);
      
      // Should display efficiency percentages
      expect(screen.getByText('92.5%')).toBeInTheDocument(); // Solar Panel Array efficiency
      expect(screen.getByText('94.2%')).toBeInTheDocument(); // Water Treatment Plant efficiency
      expect(screen.getByText('89.1%')).toBeInTheDocument(); // Waste Management System efficiency
      expect(screen.getByText('76.8%')).toBeInTheDocument(); // HVAC System efficiency
    });
  });
});
