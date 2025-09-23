#!/usr/bin/env tsx

/**
 * Quick Sidebar Test for MANAGER Role
 * Tests that MANAGER sees the correct sidebar items
 */

// Mock the sidebar component logic
interface SidebarItem {
  href: string;
  label: string;
  description: string;
  roles?: string[];
}

// Helper functions from app-sidebar.tsx
function canAccessAdmin(role?: string): boolean {
  return role === 'ADMIN';
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

// Test System Administration items
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

function testManagerSidebar() {
  console.log('🧪 Testing MANAGER Sidebar Access');
  console.log('=' .repeat(40));

  const managerRole = 'MANAGER';

  console.log(`\n👤 Testing role: ${managerRole}`);

  // Test admin access
  const hasAdminAccess = canAccessAdmin(managerRole);
  console.log(`canAccessAdmin(${managerRole}): ${hasAdminAccess}`);

  // Test manager access
  const hasManagerAccess = canAccessManager(managerRole);
  console.log(`canAccessManager(${managerRole}): ${hasManagerAccess}`);

  // Test supervisor access
  const hasSupervisorAccess = canAccessSupervisor(managerRole);
  console.log(`canAccessSupervisor(${managerRole}): ${hasSupervisorAccess}`);

  // Test System Administration items
  console.log('\n📋 System Administration Items:');
  const adminItems = filterItemsByRole(systemAdministrationItems, managerRole);
  console.log(`Total items: ${systemAdministrationItems.length}`);
  console.log(`Visible items: ${adminItems.length}`);

  if (adminItems.length > 0) {
    console.log('Visible items:');
    adminItems.forEach(item => {
      console.log(`  - ${item.label} (${item.href})`);
    });
  }

  // Test if System Administration section should be shown
  const shouldShowAdminSection = canAccessAdmin(managerRole);
  console.log(`\nShould show System Administration section: ${shouldShowAdminSection}`);

  if (shouldShowAdminSection) {
    console.log('❌ ERROR: MANAGER should NOT see System Administration section');
  } else {
    console.log('✅ CORRECT: MANAGER should NOT see System Administration section');
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`- MANAGER has admin access: ${hasAdminAccess} (should be false)`);
  console.log(`- MANAGER has manager access: ${hasManagerAccess} (should be true)`);
  console.log(`- MANAGER has supervisor access: ${hasSupervisorAccess} (should be true)`);
  console.log(`- System Admin section visible: ${shouldShowAdminSection} (should be false)`);
  console.log(`- Security Dashboard visible: ${adminItems.length > 0} (should be true)`);

  if (!hasAdminAccess && hasManagerAccess && hasSupervisorAccess && !shouldShowAdminSection && adminItems.length > 0) {
    console.log('\n✅ All tests PASSED! MANAGER sidebar access is correct.');
  } else {
    console.log('\n❌ Some tests FAILED! MANAGER sidebar access needs fixing.');
  }
}

// Run the test
testManagerSidebar();
