/**
 * Role-Based Dashboard Templates
 * Predefined card layouts for different user roles
 */

import { DashboardLayout, Role } from '@/types/dashboard';

export const EXECUTIVE_TEMPLATE: DashboardLayout = {
  id: 'executive-template',
  name: 'Executive Dashboard',
  description: 'High-level KPIs and strategic metrics for executive leadership',
  role: 'EXEC',
  isDefault: true,
  cards: [
    // Financial Overview Row
    {
      id: 'total-assets',
      type: 'kpi',
      title: 'Total Assets',
      description: 'Assets under management',
      size: 'medium',
      position: { x: 0, y: 0 },
      config: {
        value: 1247,
        change: 5.2,
        changeType: 'increase',
        format: 'number',
        icon: 'Building2'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'financial'
    },
    {
      id: 'asset-value',
      type: 'kpi',
      title: 'Asset Value',
      description: 'Total asset portfolio value',
      size: 'medium',
      position: { x: 1, y: 0 },
      config: {
        value: 12500000,
        change: 2.8,
        changeType: 'increase',
        format: 'currency',
        icon: 'DollarSign'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'financial'
    },
    {
      id: 'maintenance-cost',
      type: 'kpi',
      title: 'Maintenance Cost',
      description: 'Monthly maintenance expenditure',
      size: 'medium',
      position: { x: 2, y: 0 },
      config: {
        value: 450000,
        change: -3.1,
        changeType: 'decrease',
        format: 'currency',
        icon: 'Wrench'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'financial'
    },
    {
      id: 'compliance-rate',
      type: 'kpi',
      title: 'Compliance Rate',
      description: 'Regulatory compliance percentage',
      size: 'medium',
      position: { x: 3, y: 0 },
      config: {
        value: 94.2,
        change: 1.2,
        changeType: 'increase',
        format: 'percentage',
        icon: 'CheckCircle'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'compliance'
    },

    // Strategic KPIs Row
    {
      id: 'risk-score',
      type: 'kpi',
      title: 'Risk Score',
      description: 'Overall portfolio risk (1-10 scale)',
      size: 'medium',
      position: { x: 0, y: 1 },
      config: {
        value: 7.8,
        change: -0.5,
        changeType: 'decrease',
        format: 'number',
        icon: 'AlertTriangle'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'risk'
    },
    {
      id: 'team-utilization',
      type: 'kpi',
      title: 'Team Utilization',
      description: 'Staff productivity rate',
      size: 'medium',
      position: { x: 1, y: 1 },
      config: {
        value: 87.5,
        change: 2.3,
        changeType: 'increase',
        format: 'percentage',
        icon: 'Users'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'team'
    },
    {
      id: 'budget-utilization',
      type: 'kpi',
      title: 'Budget Utilization',
      description: 'Annual budget usage',
      size: 'medium',
      position: { x: 2, y: 1 },
      config: {
        value: 78.3,
        change: -1.8,
        changeType: 'decrease',
        format: 'percentage',
        icon: 'BarChart3'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'financial'
    },
    {
      id: 'work-orders-completed',
      type: 'kpi',
      title: 'Work Orders Completed',
      description: 'Completed this month',
      size: 'medium',
      position: { x: 3, y: 1 },
      config: {
        value: 156,
        change: 12.5,
        changeType: 'increase',
        format: 'number',
        icon: 'CheckCircle'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'operational'
    },

    // Work Orders Summary
    {
      id: 'work-orders-summary',
      type: 'data',
      title: 'Work Orders Summary',
      description: 'Current work order status',
      size: 'large',
      position: { x: 0, y: 2 },
      config: {
        columns: ['Status', 'Count', 'Icon'],
        rows: [
          { Status: 'Completed', Count: 156, Icon: 'CheckCircle' },
          { Status: 'Pending', Count: 23, Icon: 'Clock' },
          { Status: 'Overdue', Count: 8, Icon: 'AlertTriangle' }
        ]
      },
      permissions: ['EXEC', 'ADMIN', 'MANAGER'],
      category: 'operational'
    },

    // Inspections Summary
    {
      id: 'inspections-summary',
      type: 'data',
      title: 'Inspections Summary',
      description: 'Current inspection status',
      size: 'large',
      position: { x: 1, y: 2 },
      config: {
        columns: ['Status', 'Count', 'Icon'],
        rows: [
          { Status: 'Completed', Count: 89, Icon: 'CheckCircle' },
          { Status: 'Pending', Count: 12, Icon: 'Clock' },
          { Status: 'Completion Rate', Count: '88.1%', Icon: 'BarChart3' }
        ]
      },
      permissions: ['EXEC', 'ADMIN', 'MANAGER'],
      category: 'operational'
    },

    // Quick Actions
    {
      id: 'executive-actions',
      type: 'action',
      title: 'Quick Actions',
      description: 'Common executive tasks and reports',
      size: 'full-width',
      position: { x: 0, y: 3 },
      config: {
        actionText: 'View Actions',
        actionUrl: '/reports'
      },
      permissions: ['EXEC', 'ADMIN'],
      category: 'operational'
    }
  ]
};

export const MANAGER_TEMPLATE: DashboardLayout = {
  id: 'manager-template',
  name: 'Manager Dashboard',
  description: 'Operational metrics and team management for managers',
  role: 'MANAGER',
  isDefault: true,
  cards: [
    // Operational Metrics Row
    {
      id: 'work-orders-pending',
      type: 'kpi',
      title: 'Pending Work Orders',
      description: 'Work orders awaiting assignment',
      size: 'medium',
      position: { x: 0, y: 0 },
      config: {
        value: 23,
        change: -5,
        changeType: 'decrease',
        format: 'number',
        icon: 'Clock'
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'operational'
    },
    {
      id: 'inspections-due',
      type: 'kpi',
      title: 'Inspections Due',
      description: 'Inspections scheduled this week',
      size: 'medium',
      position: { x: 1, y: 0 },
      config: {
        value: 12,
        change: 3,
        changeType: 'increase',
        format: 'number',
        icon: 'Calendar'
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'operational'
    },
    {
      id: 'maintenance-backlog',
      type: 'kpi',
      title: 'Maintenance Backlog',
      description: 'Overdue maintenance tasks',
      size: 'medium',
      position: { x: 2, y: 0 },
      config: {
        value: 8,
        change: -2,
        changeType: 'decrease',
        format: 'number',
        icon: 'AlertTriangle'
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'maintenance'
    },
    {
      id: 'team-productivity',
      type: 'kpi',
      title: 'Team Productivity',
      description: 'Average completion rate',
      size: 'medium',
      position: { x: 3, y: 0 },
      config: {
        value: 87.5,
        change: 2.3,
        changeType: 'increase',
        format: 'percentage',
        icon: 'Users'
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'team'
    },

    // Team Performance Chart
    {
      id: 'team-performance-chart',
      type: 'chart',
      title: 'Team Performance',
      description: 'Team productivity over time',
      size: 'large',
      position: { x: 0, y: 1 },
      config: {
        chartType: 'line',
        data: [
          { name: 'Week 1', value: 85 },
          { name: 'Week 2', value: 87 },
          { name: 'Week 3', value: 89 },
          { name: 'Week 4', value: 87.5 }
        ]
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'team'
    },

    // Resource Allocation
    {
      id: 'resource-allocation',
      type: 'chart',
      title: 'Resource Allocation',
      description: 'Current resource distribution',
      size: 'large',
      position: { x: 1, y: 1 },
      config: {
        chartType: 'pie',
        data: [
          { name: 'Maintenance', value: 45 },
          { name: 'Inspections', value: 30 },
          { name: 'Emergency', value: 15 },
          { name: 'Administrative', value: 10 }
        ]
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'operational'
    },

    // Team Status Table
    {
      id: 'team-status',
      type: 'data',
      title: 'Team Status',
      description: 'Current team member status',
      size: 'full-width',
      position: { x: 0, y: 2 },
      config: {
        columns: ['Name', 'Status', 'Current Task', 'Progress'],
        rows: [
          { Name: 'Alexandra Deff', Status: 'Completed', 'Current Task': 'Bridge Inspection', Progress: '100%' },
          { Name: 'Edwin Adenike', Status: 'In Progress', 'Current Task': 'Road Maintenance', Progress: '75%' },
          { Name: 'Isaac Oluwatemilorun', Status: 'Pending', 'Current Task': 'Equipment Check', Progress: '0%' }
        ]
      },
      permissions: ['MANAGER', 'ADMIN'],
      category: 'team'
    }
  ]
};

export const SUPERVISOR_TEMPLATE: DashboardLayout = {
  id: 'supervisor-template',
  name: 'Supervisor Dashboard',
  description: 'Daily operations and field management for supervisors',
  role: 'SUPERVISOR',
  isDefault: true,
  cards: [
    // Daily Operations Row
    {
      id: 'todays-tasks',
      type: 'kpi',
      title: 'Today\'s Tasks',
      description: 'Tasks scheduled for today',
      size: 'medium',
      position: { x: 0, y: 0 },
      config: {
        value: 15,
        change: 2,
        changeType: 'increase',
        format: 'number',
        icon: 'Calendar'
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'operational'
    },
    {
      id: 'completed-today',
      type: 'kpi',
      title: 'Completed Today',
      description: 'Tasks completed today',
      size: 'medium',
      position: { x: 1, y: 0 },
      config: {
        value: 8,
        change: 1,
        changeType: 'increase',
        format: 'number',
        icon: 'CheckCircle'
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'operational'
    },
    {
      id: 'overdue-tasks',
      type: 'kpi',
      title: 'Overdue Tasks',
      description: 'Tasks past due date',
      size: 'medium',
      position: { x: 2, y: 0 },
      config: {
        value: 3,
        change: -1,
        changeType: 'decrease',
        format: 'number',
        icon: 'AlertTriangle'
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'operational'
    },
    {
      id: 'team-availability',
      type: 'kpi',
      title: 'Team Availability',
      description: 'Available team members',
      size: 'medium',
      position: { x: 3, y: 0 },
      config: {
        value: 12,
        change: 0,
        changeType: 'neutral',
        format: 'number',
        icon: 'Users'
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'team'
    },

    // Work Orders Table
    {
      id: 'work-orders-table',
      type: 'data',
      title: 'Active Work Orders',
      description: 'Current work orders in progress',
      size: 'large',
      position: { x: 0, y: 1 },
      config: {
        columns: ['ID', 'Asset', 'Priority', 'Assigned To', 'Status'],
        rows: [
          { ID: 'WO-001', Asset: 'Water Pump A', Priority: 'High', 'Assigned To': 'Alexandra Deff', Status: 'In Progress' },
          { ID: 'WO-002', Asset: 'Bridge Main St', Priority: 'Medium', 'Assigned To': 'Edwin Adenike', Status: 'Pending' },
          { ID: 'WO-003', Asset: 'Traffic Light', Priority: 'Low', 'Assigned To': 'Isaac Oluwatemilorun', Status: 'Completed' }
        ]
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'operational'
    },

    // Field Team Status
    {
      id: 'field-team-status',
      type: 'data',
      title: 'Field Team Status',
      description: 'Current location and status of field teams',
      size: 'large',
      position: { x: 1, y: 1 },
      config: {
        columns: ['Team Member', 'Location', 'Status', 'Last Update'],
        rows: [
          { 'Team Member': 'Alexandra Deff', Location: 'Site A', Status: 'Active', 'Last Update': '2 min ago' },
          { 'Team Member': 'Edwin Adenike', Location: 'Site B', Status: 'Active', 'Last Update': '5 min ago' },
          { 'Team Member': 'Isaac Oluwatemilorun', Location: 'Office', Status: 'Break', 'Last Update': '10 min ago' }
        ]
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'team'
    },

    // Quick Actions
    {
      id: 'supervisor-actions',
      type: 'action',
      title: 'Quick Actions',
      description: 'Common supervisor tasks',
      size: 'full-width',
      position: { x: 0, y: 2 },
      config: {
        actionText: 'View Actions',
        actionUrl: '/mobile/dashboard'
      },
      permissions: ['SUPERVISOR', 'ADMIN', 'MANAGER'],
      category: 'operational'
    }
  ]
};

export const DASHBOARD_TEMPLATES: Record<Role, DashboardLayout> = {
  EXEC: EXECUTIVE_TEMPLATE,
  ADMIN: EXECUTIVE_TEMPLATE, // Admins get executive view by default
  MANAGER: MANAGER_TEMPLATE,
  SUPERVISOR: SUPERVISOR_TEMPLATE,
  CREW: SUPERVISOR_TEMPLATE, // Crew gets supervisor view
  CITIZEN: SUPERVISOR_TEMPLATE // Citizens get basic view
};
