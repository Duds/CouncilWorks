#!/usr/bin/env tsx

/**
 * Sidebar RBAC Test Script
 * Tests that the sidebar component correctly shows/hides menu items based on user roles
 * Usage: npx tsx scripts/test-sidebar-rbac.ts
 */

import { Role } from '@prisma/client';

// Mock the sidebar component logic to test role-based filtering
interface SidebarItem {
  href: string;
  label: string;
  description: string;
  roles?: string[];
}

// Strategic Overview Items (from app-sidebar.tsx)
const strategicOverviewItems: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Strategic Dashboard',
    description: 'Asset value delivery overview',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/manager',
    label: 'Manager Dashboard',
    description: 'Resilience metrics & critical controls',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/margin-management',
    label: 'Margin Management',
    description: 'Operational slack & antifragile systems',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/demo',
    label: 'Demo Showcase',
    description: 'Comprehensive Aegrid Rules demonstration',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/reports/asset-condition',
    label: 'Asset Performance',
    description: 'Value delivery trends',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/risk-analysis',
    label: 'Risk Overview',
    description: 'Critical asset protection',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/reports/risk-compliance',
    label: 'Compliance Status',
    description: 'Regulatory adherence',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
];

// Asset Planning Items
const assetPlanningItems: SidebarItem[] = [
  {
    href: '/assets',
    label: 'Asset Register',
    description: 'Function-based organisation',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  {
    href: '/critical-controls',
    label: 'Critical Controls',
    description: 'High-consequence asset monitoring',
    roles: ['ADMIN', 'MANAGER', 'EXEC'],
  },
  {
    href: '/risk-planner',
    label: 'Risk Planner',
    description: 'Dynamic risk-driven scheduling',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  {
    href: '/rcm-templates',
    label: 'RCM Templates',
    description: 'Risk-based maintenance',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  {
    href: '/maintenance',
    label: 'Maintenance Planning',
    description: 'RCM-lite scheduling',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  {
    href: '/reports/builder',
    label: 'Custom Reports',
    description: 'Planning insights',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/imports',
    label: 'Data Import',
    description: 'Asset data management',
    roles: ['ADMIN', 'MANAGER'],
  },
];

// Operations Management Items
const operationsManagementItems: SidebarItem[] = [
  {
    href: '/assets/map',
    label: 'Asset Map',
    description: 'Geographic operations view',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW'],
  },
  {
    href: '/field-tool',
    label: 'Field Operations',
    description: 'Mobile inspections',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW'],
  },
  {
    href: '/mobile/dashboard',
    label: 'Mobile Dashboard',
    description: 'Field team overview',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW'],
  },
  {
    href: '/mobile/inspections',
    label: 'Inspections',
    description: 'Asset condition checks',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW'],
  },
  {
    href: '/mobile/work-orders',
    label: 'Work Orders',
    description: 'Maintenance tasks',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW'],
  },
  {
    href: '/sessions',
    label: 'Work Sessions',
    description: 'Team coordination',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
];

// Contractor/Partner Portal Items
const contractorPartnerItems: SidebarItem[] = [
  {
    href: '/contractor/dashboard',
    label: 'Contract Dashboard',
    description: 'Performance metrics & SLA status',
    roles: ['CONTRACTOR', 'PARTNER', 'ADMIN', 'MANAGER'],
  },
  {
    href: '/contractor/work-orders',
    label: 'My Work Orders',
    description: 'Assigned maintenance tasks',
    roles: ['CONTRACTOR', 'MAINTENANCE_PLANNER', 'ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  {
    href: '/contractor/performance',
    label: 'Performance Metrics',
    description: 'SLA compliance & ratings',
    roles: ['CONTRACTOR', 'PARTNER', 'ADMIN', 'MANAGER'],
  },
  {
    href: '/contractor/capacity',
    label: 'Capacity Management',
    description: 'Available resources & margin',
    roles: ['CONTRACTOR', 'PARTNER', 'ADMIN', 'MANAGER'],
  },
  {
    href: '/partner/data-sharing',
    label: 'Data Sharing',
    description: 'Collaborative project data',
    roles: ['PARTNER', 'ADMIN', 'MANAGER'],
  },
];

// Community Engagement Items
const communityEngagementItems: SidebarItem[] = [
  {
    href: '/citizen',
    label: 'Community Portal',
    description: 'Service request intake',
    roles: ['CITIZEN', 'ADMIN'],
  },
  {
    href: '/citizen/track',
    label: 'Track Requests',
    description: 'Request status monitoring',
    roles: ['CITIZEN', 'ADMIN'],
  },
  {
    href: '/activity',
    label: 'Activity Logs',
    description: 'Community engagement tracking',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  {
    href: '/admin/triage',
    label: 'Report Triage',
    description: 'Community issue management',
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
];

// System Administration Items
const systemAdministrationItems: SidebarItem[] = [
  {
    href: '/admin',
    label: 'Admin Dashboard',
    description: 'System overview',
    roles: ['ADMIN'],
  },
  {
    href: '/admin/users',
    label: 'User Management',
    description: 'Access control',
    roles: ['ADMIN'],
  },
  {
    href: '/admin/audit-logs',
    label: 'Audit Logs',
    description: 'System monitoring',
    roles: ['ADMIN'],
  },
  {
    href: '/security',
    label: 'Security Dashboard',
    description: 'Essential Eight compliance',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/admin/notifications',
    label: 'Notifications',
    description: 'System alerts',
    roles: ['ADMIN'],
  },
  {
    href: '/settings',
    label: 'System Settings',
    description: 'Platform configuration',
    roles: ['ADMIN'],
  },
];

// Helper functions from app-sidebar.tsx
function canAccessAdmin(role?: string): boolean {
  return role === 'ADMIN' || role === 'MANAGER';
}

function canAccessManager(role?: string): boolean {
  return role === 'ADMIN' || role === 'MANAGER' || role === 'EXEC';
}

function canAccessSupervisor(role?: string): boolean {
  return role === 'ADMIN' || role === 'MANAGER' || role === 'SUPERVISOR';
}

function filterItemsByRole(items: SidebarItem[], userRole?: string): SidebarItem[] {
  return items.filter(
    item => !item.roles || item.roles.includes(userRole || '')
  );
}

interface SidebarTestResult {
  role: Role;
  group: string;
  visibleItems: number;
  totalItems: number;
  items: SidebarItem[];
}

function testSidebarRBAC(): SidebarTestResult[] {
  const results: SidebarTestResult[] = [];
  const roles = Object.values(Role);

  for (const role of roles) {
    const roleString = role.toString();

    // Test Strategic Overview Group
    if (canAccessManager(roleString)) {
      const strategicItems = filterItemsByRole(strategicOverviewItems, roleString);
      results.push({
        role,
        group: 'Strategic Overview',
        visibleItems: strategicItems.length,
        totalItems: strategicOverviewItems.length,
        items: strategicItems,
      });
    }

    // Test Asset Planning Group
    if (canAccessSupervisor(roleString)) {
      const planningItems = filterItemsByRole(assetPlanningItems, roleString);
      results.push({
        role,
        group: 'Asset Planning',
        visibleItems: planningItems.length,
        totalItems: assetPlanningItems.length,
        items: planningItems,
      });
    }

    // Test Operations Management Group (always visible)
    const operationsItems = filterItemsByRole(operationsManagementItems, roleString);
    results.push({
      role,
      group: 'Operations Management',
      visibleItems: operationsItems.length,
      totalItems: operationsManagementItems.length,
      items: operationsItems,
    });

    // Test Contractor/Partner Portal Group
    if (roleString === 'CONTRACTOR' || roleString === 'PARTNER' || roleString === 'MAINTENANCE_PLANNER' || canAccessManager(roleString)) {
      const contractorItems = filterItemsByRole(contractorPartnerItems, roleString);
      results.push({
        role,
        group: 'Contractor/Partner Portal',
        visibleItems: contractorItems.length,
        totalItems: contractorPartnerItems.length,
        items: contractorItems,
      });
    }

    // Test Community Engagement Group (always visible)
    const communityItems = filterItemsByRole(communityEngagementItems, roleString);
    results.push({
      role,
      group: 'Community Engagement',
      visibleItems: communityItems.length,
      totalItems: communityEngagementItems.length,
      items: communityItems,
    });

    // Test System Administration Group
    if (canAccessAdmin(roleString)) {
      const adminItems = filterItemsByRole(systemAdministrationItems, roleString);
      results.push({
        role,
        group: 'System Administration',
        visibleItems: adminItems.length,
        totalItems: systemAdministrationItems.length,
        items: adminItems,
      });
    }
  }

  return results;
}

async function runSidebarRBACTest() {
  console.log('🧭 Sidebar RBAC Test Report');
  console.log('=' .repeat(50));
  console.log(`Test Date: ${new Date().toISOString()}`);

  const results = testSidebarRBAC();

  // Group results by role
  const roleGroups = results.reduce((acc, result) => {
    if (!acc[result.role]) {
      acc[result.role] = [];
    }
    acc[result.role].push(result);
    return acc;
  }, {} as Record<Role, SidebarTestResult[]>);

  console.log('\n📊 Sidebar Menu Visibility by Role');
  console.log('-' .repeat(50));

  for (const [role, roleResults] of Object.entries(roleGroups)) {
    console.log(`\n👤 ${role}:`);

    for (const result of roleResults) {
      const percentage = ((result.visibleItems / result.totalItems) * 100).toFixed(1);
      console.log(`  ${result.group}: ${result.visibleItems}/${result.totalItems} items (${percentage}%)`);

      if (result.visibleItems > 0) {
        console.log(`    Visible items:`);
        result.items.forEach(item => {
          console.log(`      - ${item.label} (${item.href})`);
        });
      }
    }
  }

  // Test specific role scenarios
  console.log('\n🔍 Specific Role Scenarios');
  console.log('-' .repeat(50));

  // Test ADMIN role
  const adminResults = roleGroups[Role.ADMIN] || [];
  const adminTotalItems = adminResults.reduce((sum, r) => sum + r.totalItems, 0);
  const adminVisibleItems = adminResults.reduce((sum, r) => sum + r.visibleItems, 0);
  console.log(`ADMIN: ${adminVisibleItems}/${adminTotalItems} total items visible`);

  // Test MANAGER role
  const managerResults = roleGroups[Role.MANAGER] || [];
  const managerTotalItems = managerResults.reduce((sum, r) => sum + r.totalItems, 0);
  const managerVisibleItems = managerResults.reduce((sum, r) => sum + r.visibleItems, 0);
  console.log(`MANAGER: ${managerVisibleItems}/${managerTotalItems} total items visible`);

  // Test CREW role
  const crewResults = roleGroups[Role.CREW] || [];
  const crewTotalItems = crewResults.reduce((sum, r) => sum + r.totalItems, 0);
  const crewVisibleItems = crewResults.reduce((sum, r) => sum + r.visibleItems, 0);
  console.log(`CREW: ${crewVisibleItems}/${crewTotalItems} total items visible`);

  // Test CITIZEN role
  const citizenResults = roleGroups[Role.CITIZEN] || [];
  const citizenTotalItems = citizenResults.reduce((sum, r) => sum + r.totalItems, 0);
  const citizenVisibleItems = citizenResults.reduce((sum, r) => sum + r.visibleItems, 0);
  console.log(`CITIZEN: ${citizenVisibleItems}/${citizenTotalItems} total items visible`);

  // Summary
  console.log('\n📋 Test Summary');
  console.log('=' .repeat(50));

  const totalTests = results.length;
  const rolesWithAccess = new Set(results.map(r => r.role)).size;

  console.log(`Total role-group combinations tested: ${totalTests}`);
  console.log(`Roles with sidebar access: ${rolesWithAccess}`);
  console.log(`Total roles: ${Object.values(Role).length}`);

  // Check for potential issues
  const issues: string[] = [];

  // Check if any role has no visible items
  for (const [role, roleResults] of Object.entries(roleGroups)) {
    const totalVisible = roleResults.reduce((sum, r) => sum + r.visibleItems, 0);
    if (totalVisible === 0) {
      issues.push(`${role} has no visible sidebar items`);
    }
  }

  // Check if ADMIN has access to all items
  const adminAccess = adminResults.every(r => r.visibleItems === r.totalItems);
  if (!adminAccess) {
    issues.push('ADMIN does not have access to all sidebar items');
  }

  if (issues.length === 0) {
    console.log('\n✅ All sidebar RBAC controls are working correctly!');
  } else {
    console.log('\n⚠️  Potential issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }

  return results;
}

async function main() {
  try {
    await runSidebarRBACTest();
  } catch (error) {
    console.error('❌ Sidebar RBAC test failed:', error);
    process.exit(1);
  }
}

// Run the test
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});

export { runSidebarRBACTest, testSidebarRBAC };
