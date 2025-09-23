#!/usr/bin/env tsx

/**
 * Comprehensive RBAC Audit Script
 * Tests role-based access controls across the application
 * Usage: npx tsx scripts/rbac-audit.ts
 */

import { PrismaClient, Role } from '@prisma/client';
import {
    canAccessAdmin,
    canAccessContractorFeatures,
    canAccessExecutive,
    canAccessPartnerFeatures,
    canAssignWorkOrders,
    canCreateCitizenReports,
    canCreateWorkOrders,
    canManageUsers,
    canPerformFieldWork,
    canShareDataWithPartners,
    canUpdateContractorWorkOrders,
    canViewCitizenReports,
    canViewContractorWorkOrders,
    canViewPartnerData,
    canViewReports,
    getAccessibleRoutes
} from '../lib/rbac';

const prisma = new PrismaClient();

interface RBACTestResult {
  role: Role;
  permission: string;
  expected: boolean;
  actual: boolean;
  passed: boolean;
}

interface RouteTestResult {
  role: Role;
  route: string;
  accessible: boolean;
}

/**
 * Test all RBAC permission functions
 */
function testRBACPermissions(): RBACTestResult[] {
  const results: RBACTestResult[] = [];
  const roles = Object.values(Role);

  // Define expected permissions for each role based on role hierarchy
  const expectedPermissions: Record<Role, Record<string, boolean>> = {
    [Role.ADMIN]: {
      canAccessAdmin: true,
      canAccessExecutive: true,
      canManageUsers: true,
      canViewReports: true,
      canCreateWorkOrders: true,
      canAssignWorkOrders: true,
      canPerformFieldWork: true,
      canViewCitizenReports: true,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,
      canAccessPartnerFeatures: true,
      canViewContractorWorkOrders: true,
      canUpdateContractorWorkOrders: true,
      canViewPartnerData: true,
      canShareDataWithPartners: true,
    },
    [Role.MANAGER]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: true,
      canViewReports: true,
      canCreateWorkOrders: true,
      canAssignWorkOrders: true,
      canPerformFieldWork: true,
      canViewCitizenReports: true,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,
      canAccessPartnerFeatures: true,
      canViewContractorWorkOrders: true,
      canUpdateContractorWorkOrders: true,
      canViewPartnerData: true,
      canShareDataWithPartners: true,
    },
    [Role.EXEC]: {
      canAccessAdmin: false,
      canAccessExecutive: true,
      canManageUsers: true,  // EXEC (7) >= MANAGER (6)
      canViewReports: true,
      canCreateWorkOrders: true,  // EXEC (7) >= SUPERVISOR (5)
      canAssignWorkOrders: true,  // EXEC (7) >= SUPERVISOR (5)
      canPerformFieldWork: true,  // EXEC (7) >= CREW (4)
      canViewCitizenReports: true,  // EXEC (7) >= SUPERVISOR (5)
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,  // EXEC (7) >= SUPERVISOR (5)
      canAccessPartnerFeatures: true,  // EXEC (7) >= MANAGER (6)
      canViewContractorWorkOrders: true,  // EXEC (7) >= SUPERVISOR (5)
      canUpdateContractorWorkOrders: true,  // EXEC (7) >= SUPERVISOR (5)
      canViewPartnerData: true,  // EXEC (7) >= MANAGER (6)
      canShareDataWithPartners: true,  // EXEC (7) >= MANAGER (6)
    },
    [Role.SUPERVISOR]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: false,
      canViewReports: false,
      canCreateWorkOrders: true,
      canAssignWorkOrders: true,
      canPerformFieldWork: true,
      canViewCitizenReports: true,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,
      canAccessPartnerFeatures: true,  // SUPERVISOR (5) >= PARTNER (2)
      canViewContractorWorkOrders: true,
      canUpdateContractorWorkOrders: true,
      canViewPartnerData: true,  // SUPERVISOR (5) >= PARTNER (2)
      canShareDataWithPartners: false,
    },
    [Role.CREW]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: false,
      canViewReports: false,
      canCreateWorkOrders: false,
      canAssignWorkOrders: false,
      canPerformFieldWork: true,
      canViewCitizenReports: false,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,  // CREW (4) >= CONTRACTOR (3)
      canAccessPartnerFeatures: true,  // CREW (4) >= PARTNER (2)
      canViewContractorWorkOrders: true,  // CREW (4) >= CONTRACTOR (3)
      canUpdateContractorWorkOrders: true,  // CREW (4) >= CONTRACTOR (3)
      canViewPartnerData: true,  // CREW (4) >= PARTNER (2)
      canShareDataWithPartners: false,
    },
    [Role.CONTRACTOR]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: false,
      canViewReports: false,
      canCreateWorkOrders: false,
      canAssignWorkOrders: false,
      canPerformFieldWork: true,
      canViewCitizenReports: false,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,
      canAccessPartnerFeatures: true,  // CONTRACTOR (3) >= PARTNER (2)
      canViewContractorWorkOrders: true,
      canUpdateContractorWorkOrders: true,
      canViewPartnerData: true,  // CONTRACTOR (3) >= PARTNER (2)
      canShareDataWithPartners: false,
    },
    [Role.PARTNER]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: false,
      canViewReports: false,
      canCreateWorkOrders: false,
      canAssignWorkOrders: false,
      canPerformFieldWork: false,
      canViewCitizenReports: false,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: false,
      canAccessPartnerFeatures: true,
      canViewContractorWorkOrders: false,
      canUpdateContractorWorkOrders: false,
      canViewPartnerData: true,
      canShareDataWithPartners: false,
    },
    [Role.CITIZEN]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: false,
      canViewReports: false,
      canCreateWorkOrders: false,
      canAssignWorkOrders: false,
      canPerformFieldWork: false,
      canViewCitizenReports: false,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: false,
      canAccessPartnerFeatures: false,
      canViewContractorWorkOrders: false,
      canUpdateContractorWorkOrders: false,
      canViewPartnerData: false,
      canShareDataWithPartners: false,
    },
    [Role.MAINTENANCE_PLANNER]: {
      canAccessAdmin: false,
      canAccessExecutive: false,
      canManageUsers: false,
      canViewReports: false,
      canCreateWorkOrders: false,
      canAssignWorkOrders: false,
      canPerformFieldWork: true,  // MAINTENANCE_PLANNER explicitly included in canPerformFieldWork
      canViewCitizenReports: false,
      canCreateCitizenReports: true,
      canAccessContractorFeatures: true,  // MAINTENANCE_PLANNER (3) >= CONTRACTOR (3)
      canAccessPartnerFeatures: true,  // MAINTENANCE_PLANNER (3) >= PARTNER (2)
      canViewContractorWorkOrders: true,  // MAINTENANCE_PLANNER (3) >= CONTRACTOR (3)
      canUpdateContractorWorkOrders: true,  // MAINTENANCE_PLANNER (3) >= CONTRACTOR (3)
      canViewPartnerData: true,  // MAINTENANCE_PLANNER (3) >= PARTNER (2)
      canShareDataWithPartners: false,
    },
  };

  // Test each role and permission
  for (const role of roles) {
    const expected = expectedPermissions[role];

    // Test each permission function
    const permissionTests = [
      { name: 'canAccessAdmin', fn: canAccessAdmin },
      { name: 'canAccessExecutive', fn: canAccessExecutive },
      { name: 'canManageUsers', fn: canManageUsers },
      { name: 'canViewReports', fn: canViewReports },
      { name: 'canCreateWorkOrders', fn: canCreateWorkOrders },
      { name: 'canAssignWorkOrders', fn: canAssignWorkOrders },
      { name: 'canPerformFieldWork', fn: canPerformFieldWork },
      { name: 'canViewCitizenReports', fn: canViewCitizenReports },
      { name: 'canCreateCitizenReports', fn: canCreateCitizenReports },
      { name: 'canAccessContractorFeatures', fn: canAccessContractorFeatures },
      { name: 'canAccessPartnerFeatures', fn: canAccessPartnerFeatures },
      { name: 'canViewContractorWorkOrders', fn: canViewContractorWorkOrders },
      { name: 'canUpdateContractorWorkOrders', fn: canUpdateContractorWorkOrders },
      { name: 'canViewPartnerData', fn: canViewPartnerData },
      { name: 'canShareDataWithPartners', fn: canShareDataWithPartners },
    ];

    for (const test of permissionTests) {
      const actual = test.fn(role);
      const expectedValue = expected[test.name];
      const passed = actual === expectedValue;

      results.push({
        role,
        permission: test.name,
        expected: expectedValue,
        actual,
        passed,
      });
    }
  }

  return results;
}

/**
 * Test accessible routes for each role
 */
function testAccessibleRoutes(): RouteTestResult[] {
  const results: RouteTestResult[] = [];
  const roles = Object.values(Role);

  // Define expected accessible routes for each role
  const expectedRoutes: Record<Role, string[]> = {
    [Role.ADMIN]: [
      '/dashboard', '/admin', '/reports', '/work-orders', '/field-work',
      '/citizen-reports', '/contractor-portal', '/partner-portal'
    ],
    [Role.MANAGER]: [
      '/dashboard', '/reports', '/work-orders', '/field-work',
      '/citizen-reports', '/contractor-portal', '/partner-portal'
    ],
    [Role.EXEC]: [
      '/dashboard', '/reports', '/citizen-reports'
    ],
    [Role.SUPERVISOR]: [
      '/dashboard', '/work-orders', '/field-work', '/citizen-reports', '/contractor-portal'
    ],
    [Role.CREW]: [
      '/dashboard', '/field-work', '/citizen-reports'
    ],
    [Role.CONTRACTOR]: [
      '/dashboard', '/field-work', '/citizen-reports', '/contractor-portal'
    ],
    [Role.PARTNER]: [
      '/dashboard', '/citizen-reports', '/partner-portal'
    ],
    [Role.CITIZEN]: [
      '/dashboard', '/citizen-reports'
    ],
    [Role.MAINTENANCE_PLANNER]: [
      '/dashboard', '/citizen-reports'
    ],
  };

  for (const role of roles) {
    const accessibleRoutes = getAccessibleRoutes(role);
    const expectedRouteList = expectedRoutes[role];

    // Test each expected route
    for (const route of expectedRouteList) {
      results.push({
        role,
        route,
        accessible: accessibleRoutes.includes(route),
      });
    }
  }

  return results;
}

/**
 * Check database users and their roles
 */
async function checkDatabaseUsers() {
  console.log('\n📊 Database User Analysis');
  console.log('=' .repeat(50));

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        organisation: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    });

    console.log(`Total users: ${users.length}`);
    console.log(`Active users: ${users.filter(u => u.isActive).length}`);
    console.log(`Inactive users: ${users.filter(u => !u.isActive).length}`);

    // Group by role
    const roleGroups = users.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = [];
      }
      acc[user.role].push(user);
      return acc;
    }, {} as Record<Role, typeof users>);

    console.log('\n👥 Users by Role:');
    for (const [role, roleUsers] of Object.entries(roleGroups)) {
      console.log(`\n${role}: ${roleUsers.length} users`);
      roleUsers.forEach(user => {
        const status = user.isActive ? '✅' : '❌';
        console.log(`  ${status} ${user.name || 'No name'} (${user.email}) - ${user.organisation?.name || 'No org'}`);
      });
    }

    return users;
  } catch (error) {
    console.error('Error checking database users:', error);
    return [];
  }
}

/**
 * Main audit function
 */
async function runRBACAudit() {
  console.log('🔐 RBAC Audit Report');
  console.log('=' .repeat(50));
  console.log(`Audit Date: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Test RBAC permissions
  console.log('\n🔍 Testing RBAC Permission Functions');
  console.log('-' .repeat(50));

  const permissionResults = testRBACPermissions();
  const failedPermissions = permissionResults.filter(r => !r.passed);

  console.log(`Total permission tests: ${permissionResults.length}`);
  console.log(`Passed: ${permissionResults.filter(r => r.passed).length}`);
  console.log(`Failed: ${failedPermissions.length}`);

  if (failedPermissions.length > 0) {
    console.log('\n❌ Failed Permission Tests:');
    failedPermissions.forEach(result => {
      console.log(`  ${result.role}.${result.permission}: expected ${result.expected}, got ${result.actual}`);
    });
  }

  // Test accessible routes
  console.log('\n🛣️  Testing Accessible Routes');
  console.log('-' .repeat(50));

  const routeResults = testAccessibleRoutes();
  const inaccessibleRoutes = routeResults.filter(r => !r.accessible);

  console.log(`Total route tests: ${routeResults.length}`);
  console.log(`Accessible routes: ${routeResults.filter(r => r.accessible).length}`);
  console.log(`Inaccessible routes: ${inaccessibleRoutes.length}`);

  if (inaccessibleRoutes.length > 0) {
    console.log('\n❌ Inaccessible Routes:');
    inaccessibleRoutes.forEach(result => {
      console.log(`  ${result.role}: ${result.route}`);
    });
  }

  // Check database users
  await checkDatabaseUsers();

  // Summary
  console.log('\n📋 Audit Summary');
  console.log('=' .repeat(50));

  const totalTests = permissionResults.length + routeResults.length;
  const passedTests = permissionResults.filter(r => r.passed).length + routeResults.filter(r => r.accessible).length;
  const failedTests = totalTests - passedTests;

  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n✅ All RBAC controls are working correctly!');
  } else {
    console.log('\n⚠️  Some RBAC controls need attention.');
  }

  return {
    permissionResults,
    routeResults,
    totalTests,
    passedTests,
    failedTests,
  };
}

async function main() {
  try {
    await runRBACAudit();
  } catch (error) {
    console.error('❌ RBAC audit failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the audit
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});

export { runRBACAudit, testAccessibleRoutes, testRBACPermissions };
