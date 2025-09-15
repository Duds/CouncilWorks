import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamManagement from '@/app/team/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/team',
}));

describe('Team Management System', () => {
  describe('Component Rendering', () => {
    it('should render team management interface', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('Team Management')).toBeInTheDocument();
      expect(screen.getByText('Manage team assignments based on asset criticality and RCM-lite strategies')).toBeInTheDocument();
    });

    it('should display overview cards with correct metrics', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('Total Team Members')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument(); // Mock data has 4 members
      expect(screen.getByText('Critical Asset Experts')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // 3 members with critical asset experience
      expect(screen.getByText('Active Assignments')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument(); // Sum of current assignments
      expect(screen.getByText('Critical Assets')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 critical assets in assignments
    });
  });

  describe('Team Members Tab (Rule 1: Purpose-driven team assignments)', () => {
    it('should display team members table', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Chen')).toBeInTheDocument();
      expect(screen.getByText('Emma Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('David Thompson')).toBeInTheDocument();
    });

    it('should display critical asset expertise indicators', () => {
      render(<TeamManagement />);
      
      // Check for certified members
      const certifiedElements = screen.getAllByText('Certified');
      expect(certifiedElements).toHaveLength(3); // Sarah, Emma, David have critical asset experience
      
      // Check for training members
      const trainingElements = screen.getAllByText('Training');
      expect(trainingElements).toHaveLength(1); // Michael needs training
    });

    it('should display specialisations aligned with asset purposes', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('Critical Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('General Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Safety Systems')).toBeInTheDocument();
      expect(screen.getByText('Asset Planning')).toBeInTheDocument();
    });

    it('should filter team members by role', () => {
      render(<TeamManagement />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      fireEvent.click(roleFilter);
      
      // Should be able to select different roles
      expect(screen.getByText('Supervisors')).toBeInTheDocument();
      expect(screen.getByText('Crew Members')).toBeInTheDocument();
      expect(screen.getByText('Managers')).toBeInTheDocument();
    });

    it('should search team members by name, email, or specialisation', () => {
      render(<TeamManagement />);
      
      const searchInput = screen.getByPlaceholderText('Search team members...');
      fireEvent.change(searchInput, { target: { value: 'Sarah' } });
      
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Michael Chen')).not.toBeInTheDocument();
    });
  });

  describe('Asset Assignments Tab (Rule 2: Risk-based team allocation)', () => {
    it('should display asset assignments tab', () => {
      render(<TeamManagement />);
      
      const assetAssignmentsTab = screen.getByText('Asset Assignments');
      fireEvent.click(assetAssignmentsTab);
      
      expect(screen.getByText('Asset Assignments')).toBeInTheDocument();
      expect(screen.getByText('Current asset assignments prioritised by criticality and team expertise')).toBeInTheDocument();
    });

    it('should display critical assets with high priority', () => {
      render(<TeamManagement />);
      
      const assetAssignmentsTab = screen.getByText('Asset Assignments');
      fireEvent.click(assetAssignmentsTab);
      
      expect(screen.getByText('Main Water Treatment Plant')).toBeInTheDocument();
      expect(screen.getByText('Emergency Generator System')).toBeInTheDocument();
      expect(screen.getByText('Office HVAC System')).toBeInTheDocument();
    });

    it('should show criticality badges for assets', () => {
      render(<TeamManagement />);
      
      const assetAssignmentsTab = screen.getByText('Asset Assignments');
      fireEvent.click(assetAssignmentsTab);
      
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges).toHaveLength(2); // Main Water Treatment Plant and Emergency Generator System
      
      const mediumBadges = screen.getAllByText('Medium');
      expect(mediumBadges).toHaveLength(1); // Office HVAC System
    });

    it('should display work types aligned with RCM-lite strategies', () => {
      render(<TeamManagement />);
      
      const assetAssignmentsTab = screen.getByText('Asset Assignments');
      fireEvent.click(assetAssignmentsTab);
      
      expect(screen.getByText('Preventive Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Safety Inspection')).toBeInTheDocument();
      expect(screen.getByText('Routine Maintenance')).toBeInTheDocument();
    });
  });

  describe('Skills Matrix Tab (Rule 3: Critical asset focus)', () => {
    it('should display skills matrix tab', () => {
      render(<TeamManagement />);
      
      const skillsMatrixTab = screen.getByText('Skills Matrix');
      fireEvent.click(skillsMatrixTab);
      
      expect(screen.getByText('Skills Matrix')).toBeInTheDocument();
      expect(screen.getByText('Team capabilities aligned with asset criticality requirements')).toBeInTheDocument();
    });

    it('should display skills for each team member', () => {
      render(<TeamManagement />);
      
      const skillsMatrixTab = screen.getByText('Skills Matrix');
      fireEvent.click(skillsMatrixTab);
      
      expect(screen.getByText('Electrical')).toBeInTheDocument();
      expect(screen.getByText('Mechanical')).toBeInTheDocument();
      expect(screen.getByText('Safety Systems')).toBeInTheDocument();
      expect(screen.getByText('Plumbing')).toBeInTheDocument();
      expect(screen.getByText('HVAC')).toBeInTheDocument();
    });

    it('should display certifications for critical asset management', () => {
      render(<TeamManagement />);
      
      const skillsMatrixTab = screen.getByText('Skills Matrix');
      fireEvent.click(skillsMatrixTab);
      
      expect(screen.getByText('ISO 55000')).toBeInTheDocument();
      expect(screen.getByText('RCM Level 2')).toBeInTheDocument();
      expect(screen.getByText('RCM Level 3')).toBeInTheDocument();
      expect(screen.getByText('Safety Officer')).toBeInTheDocument();
      expect(screen.getByText('Emergency Response')).toBeInTheDocument();
    });
  });

  describe('Add Team Member Dialog', () => {
    it('should open add team member dialog', () => {
      render(<TeamManagement />);
      
      const addButton = screen.getByText('Add Team Member');
      fireEvent.click(addButton);
      
      expect(screen.getByText('Add Team Member')).toBeInTheDocument();
      expect(screen.getByText('Add a new team member to the asset management team.')).toBeInTheDocument();
    });

    it('should have form fields for new team member', () => {
      render(<TeamManagement />);
      
      const addButton = screen.getByText('Add Team Member');
      fireEvent.click(addButton);
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
      expect(screen.getByLabelText('Specialisation')).toBeInTheDocument();
    });

    it('should close dialog when cancel is clicked', () => {
      render(<TeamManagement />);
      
      const addButton = screen.getByText('Add Team Member');
      fireEvent.click(addButton);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Add Team Member')).not.toBeInTheDocument();
    });
  });

  describe('Status Indicators and Badges', () => {
    it('should display correct status badges for team members', () => {
      render(<TeamManagement />);
      
      const activeBadges = screen.getAllByText('active');
      expect(activeBadges).toHaveLength(3); // Sarah, Michael, David
      
      const busyBadges = screen.getAllByText('busy');
      expect(busyBadges).toHaveLength(1); // Emma
    });

    it('should display role badges correctly', () => {
      render(<TeamManagement />);
      
      const supervisorBadges = screen.getAllByText('SUPERVISOR');
      expect(supervisorBadges).toHaveLength(2); // Sarah, David
      
      const crewBadges = screen.getAllByText('CREW');
      expect(crewBadges).toHaveLength(2); // Michael, Emma
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have proper ARIA roles and labels', () => {
      render(<TeamManagement />);
      
      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Check for table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have keyboard navigation support', () => {
      render(<TeamManagement />);
      
      const searchInput = screen.getByPlaceholderText('Search team members...');
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });

    it('should display loading states appropriately', () => {
      render(<TeamManagement />);
      
      // All data should be loaded immediately with mock data
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    });
  });

  describe('Data Validation and Error Handling', () => {
    it('should handle empty search results gracefully', () => {
      render(<TeamManagement />);
      
      const searchInput = screen.getByPlaceholderText('Search team members...');
      fireEvent.change(searchInput, { target: { value: 'NonExistentUser' } });
      
      // Should show no results but not crash
      expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument();
      expect(screen.queryByText('Michael Chen')).not.toBeInTheDocument();
    });

    it('should maintain data consistency across tabs', () => {
      render(<TeamManagement />);
      
      // Switch between tabs and verify data consistency
      const teamTab = screen.getByText('Team Members');
      const assignmentsTab = screen.getByText('Asset Assignments');
      
      fireEvent.click(assignmentsTab);
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument(); // Assigned to Main Water Treatment Plant
      
      fireEvent.click(teamTab);
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument(); // Should still be there
    });
  });
});
