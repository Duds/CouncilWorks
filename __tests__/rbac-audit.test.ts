import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { Role, AuditAction } from '@prisma/client';
import { 
  hasRole, 
  canManageUser, 
  getRoleDisplayName, 
  getRoleDescription,
  logAuditEvent,
  getAuditLogs
} from '@/lib/audit';
import { 
  isAdmin, 
  canAccessAdmin, 
  canManageUsers, 
  canViewReports,
  canCreateWorkOrders,
  canAssignWorkOrders,
  canPerformFieldWork,
  canViewCitizenReports,
  canCreateCitizenReports,
  canAccessContractorFeatures,
  canAccessPartnerFeatures,
  canViewContractorWorkOrders,
  canUpdateContractorWorkOrders,
  canViewPartnerData,
  canShareDataWithPartners,
  getAccessibleRoutes,
  validatePermissions
} from '@/lib/rbac';

describe('RBAC Functions', () => {
  describe('hasRole', () => {
    it('should return true for exact role match', () => {
      expect(hasRole(Role.ADMIN, [Role.ADMIN])).toBe(true);
      expect(hasRole(Role.MANAGER, [Role.MANAGER])).toBe(true);
      expect(hasRole(Role.CONTRACTOR, [Role.CONTRACTOR])).toBe(true);
      expect(hasRole(Role.PARTNER, [Role.PARTNER])).toBe(true);
    });

    it('should return true for higher role', () => {
      expect(hasRole(Role.ADMIN, [Role.MANAGER])).toBe(true);
      expect(hasRole(Role.MANAGER, [Role.SUPERVISOR])).toBe(true);
      expect(hasRole(Role.SUPERVISOR, [Role.CONTRACTOR])).toBe(true);
      expect(hasRole(Role.CONTRACTOR, [Role.PARTNER])).toBe(true);
    });

    it('should return false for lower role', () => {
      expect(hasRole(Role.MANAGER, [Role.ADMIN])).toBe(false);
      expect(hasRole(Role.SUPERVISOR, [Role.MANAGER])).toBe(false);
      expect(hasRole(Role.CONTRACTOR, [Role.SUPERVISOR])).toBe(false);
      expect(hasRole(Role.PARTNER, [Role.CONTRACTOR])).toBe(false);
    });

    it('should work with multiple roles', () => {
      expect(hasRole(Role.ADMIN, [Role.MANAGER, Role.SUPERVISOR])).toBe(true);
      expect(hasRole(Role.CONTRACTOR, [Role.MANAGER, Role.ADMIN])).toBe(false);
      expect(hasRole(Role.CONTRACTOR, [Role.PARTNER, Role.CITIZEN])).toBe(true);
    });
  });

  describe('canManageUser', () => {
    it('should allow admin to manage all users', () => {
      expect(canManageUser(Role.ADMIN, Role.ADMIN)).toBe(true);
      expect(canManageUser(Role.ADMIN, Role.MANAGER)).toBe(true);
      expect(canManageUser(Role.ADMIN, Role.CITIZEN)).toBe(true);
    });

    it('should allow manager to manage lower roles', () => {
      expect(canManageUser(Role.MANAGER, Role.SUPERVISOR)).toBe(true);
      expect(canManageUser(Role.MANAGER, Role.CREW)).toBe(true);
      expect(canManageUser(Role.MANAGER, Role.CITIZEN)).toBe(true);
    });

    it('should not allow lower roles to manage higher roles', () => {
      expect(canManageUser(Role.MANAGER, Role.ADMIN)).toBe(false);
      expect(canManageUser(Role.SUPERVISOR, Role.MANAGER)).toBe(false);
    });
  });

  describe('Role Display Functions', () => {
    it('should return correct display names', () => {
      expect(getRoleDisplayName(Role.ADMIN)).toBe('Administrator');
      expect(getRoleDisplayName(Role.MANAGER)).toBe('Manager');
      expect(getRoleDisplayName(Role.CITIZEN)).toBe('Citizen');
    });

    it('should return correct descriptions', () => {
      expect(getRoleDescription(Role.ADMIN)).toContain('Full system access');
      expect(getRoleDescription(Role.MANAGER)).toContain('Asset management');
      expect(getRoleDescription(Role.CITIZEN)).toContain('Read-only access');
    });
  });

  describe('Permission Functions', () => {
    it('should correctly identify admin privileges', () => {
      expect(isAdmin(Role.ADMIN)).toBe(true);
      expect(isAdmin(Role.MANAGER)).toBe(false);
    });

    it('should correctly identify admin access', () => {
      expect(canAccessAdmin(Role.ADMIN)).toBe(true);
      expect(canAccessAdmin(Role.MANAGER)).toBe(false);
    });

    it('should correctly identify user management permissions', () => {
      expect(canManageUsers(Role.ADMIN)).toBe(true);
      expect(canManageUsers(Role.MANAGER)).toBe(true);
      expect(canManageUsers(Role.SUPERVISOR)).toBe(false);
    });

    it('should correctly identify report viewing permissions', () => {
      expect(canViewReports(Role.EXEC)).toBe(true);
      expect(canViewReports(Role.MANAGER)).toBe(true);
      expect(canViewReports(Role.ADMIN)).toBe(true);
      expect(canViewReports(Role.SUPERVISOR)).toBe(false);
    });

    it('should correctly identify work order permissions', () => {
      expect(canCreateWorkOrders(Role.SUPERVISOR)).toBe(true);
      expect(canCreateWorkOrders(Role.MANAGER)).toBe(true);
      expect(canCreateWorkOrders(Role.CREW)).toBe(false);

      expect(canAssignWorkOrders(Role.SUPERVISOR)).toBe(true);
      expect(canAssignWorkOrders(Role.CREW)).toBe(false);
    });

    it('should correctly identify field work permissions', () => {
      expect(canPerformFieldWork(Role.CREW)).toBe(true);
      expect(canPerformFieldWork(Role.SUPERVISOR)).toBe(true);
      expect(canPerformFieldWork(Role.CITIZEN)).toBe(false);
    });

    it('should correctly identify citizen report permissions', () => {
      expect(canViewCitizenReports(Role.SUPERVISOR)).toBe(true);
      expect(canViewCitizenReports(Role.CITIZEN)).toBe(false);

      expect(canCreateCitizenReports(Role.CITIZEN)).toBe(true);
      expect(canCreateCitizenReports(Role.CREW)).toBe(true);
    });

    it('should correctly identify contractor permissions', () => {
      expect(canAccessContractorFeatures(Role.CONTRACTOR)).toBe(true);
      expect(canAccessContractorFeatures(Role.SUPERVISOR)).toBe(true);
      expect(canAccessContractorFeatures(Role.CITIZEN)).toBe(false);

      expect(canViewContractorWorkOrders(Role.CONTRACTOR)).toBe(true);
      expect(canViewContractorWorkOrders(Role.CREW)).toBe(true); // CREW has higher level than CONTRACTOR

      expect(canUpdateContractorWorkOrders(Role.CONTRACTOR)).toBe(true);
      expect(canUpdateContractorWorkOrders(Role.CREW)).toBe(true); // CREW has higher level than CONTRACTOR
    });

    it('should correctly identify partner permissions', () => {
      expect(canAccessPartnerFeatures(Role.PARTNER)).toBe(true);
      expect(canAccessPartnerFeatures(Role.MANAGER)).toBe(true);
      expect(canAccessPartnerFeatures(Role.CONTRACTOR)).toBe(true); // CONTRACTOR has higher level than PARTNER

      expect(canViewPartnerData(Role.PARTNER)).toBe(true);
      expect(canViewPartnerData(Role.CONTRACTOR)).toBe(true); // CONTRACTOR has higher level than PARTNER

      expect(canShareDataWithPartners(Role.MANAGER)).toBe(true);
      expect(canShareDataWithPartners(Role.PARTNER)).toBe(false);
    });
  });

  describe('getAccessibleRoutes', () => {
    it('should return correct routes for admin', () => {
      const routes = getAccessibleRoutes(Role.ADMIN);
      expect(routes).toContain('/admin');
      expect(routes).toContain('/reports');
      expect(routes).toContain('/work-orders');
      expect(routes).toContain('/field-work');
      expect(routes).toContain('/citizen-reports');
    });

    it('should return correct routes for manager', () => {
      const routes = getAccessibleRoutes(Role.MANAGER);
      expect(routes).not.toContain('/admin');
      expect(routes).toContain('/reports');
      expect(routes).toContain('/work-orders');
      expect(routes).toContain('/field-work');
      expect(routes).toContain('/citizen-reports');
    });

    it('should return correct routes for contractor', () => {
      const routes = getAccessibleRoutes(Role.CONTRACTOR);
      expect(routes).not.toContain('/admin');
      expect(routes).not.toContain('/reports');
      expect(routes).not.toContain('/work-orders');
      expect(routes).toContain('/field-work');
      expect(routes).toContain('/citizen-reports');
      expect(routes).toContain('/contractor-portal');
    });

    it('should return correct routes for partner', () => {
      const routes = getAccessibleRoutes(Role.PARTNER);
      expect(routes).not.toContain('/admin');
      expect(routes).not.toContain('/reports');
      expect(routes).not.toContain('/work-orders');
      expect(routes).not.toContain('/field-work');
      expect(routes).toContain('/citizen-reports');
      expect(routes).toContain('/partner-portal');
    });

    it('should return correct routes for citizen', () => {
      const routes = getAccessibleRoutes(Role.CITIZEN);
      expect(routes).not.toContain('/admin');
      expect(routes).not.toContain('/reports');
      expect(routes).not.toContain('/work-orders');
      expect(routes).not.toContain('/field-work');
      expect(routes).toContain('/citizen-reports');
    });
  });

  describe('validatePermissions', () => {
    it('should validate multiple permissions correctly', () => {
      expect(validatePermissions(Role.ADMIN, [canAccessAdmin, canManageUsers])).toBe(true);
      expect(validatePermissions(Role.MANAGER, [canAccessAdmin, canManageUsers])).toBe(false);
      expect(validatePermissions(Role.MANAGER, [canManageUsers, canViewReports])).toBe(true);
    });
  });
});

describe('Audit Logging', () => {
  let testOrganisationId: string;
  let testUserId: string;

  beforeEach(async () => {
    // Create test organisation
    const organisation = await prisma.organisation.create({
      data: { name: 'Test Organisation' }
    });
    testOrganisationId = organisation.id;

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: Role.ADMIN,
        organisationId: testOrganisationId,
        isActive: true,
      }
    });
    testUserId = user.id;
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.auditLog.deleteMany({
      where: { organisationId: testOrganisationId }
    });
    await prisma.user.deleteMany({
      where: { organisationId: testOrganisationId }
    });
    await prisma.organisation.deleteMany({
      where: { id: testOrganisationId }
    });
  });

  describe('logAuditEvent', () => {
    it('should create audit log entry', async () => {
      await logAuditEvent(
        AuditAction.USER_LOGIN,
        testUserId,
        testOrganisationId,
        { test: 'data' },
        '192.168.1.1',
        'Test User Agent'
      );

      const log = await prisma.auditLog.findFirst({
        where: { userId: testUserId }
      });

      expect(log).toBeTruthy();
      expect(log?.action).toBe(AuditAction.USER_LOGIN);
      expect(log?.organisationId).toBe(testOrganisationId);
      expect(log?.details).toEqual({ test: 'data' });
      expect(log?.ipAddress).toBe('192.168.1.1');
      expect(log?.userAgent).toBe('Test User Agent');
    });

    it('should handle missing optional parameters', async () => {
      await logAuditEvent(AuditAction.USER_LOGOUT);

      const log = await prisma.auditLog.findFirst({
        where: { action: AuditAction.USER_LOGOUT }
      });

      expect(log).toBeTruthy();
      expect(log?.userId).toBeNull();
      expect(log?.organisationId).toBeNull();
    });
  });

  describe('getAuditLogs', () => {
    beforeEach(async () => {
      // Create multiple audit logs
      await Promise.all([
        logAuditEvent(AuditAction.USER_LOGIN, testUserId, testOrganisationId),
        logAuditEvent(AuditAction.USER_LOGOUT, testUserId, testOrganisationId),
        logAuditEvent(AuditAction.USER_ROLE_CHANGE, testUserId, testOrganisationId),
      ]);
    });

    it('should return audit logs with pagination', async () => {
      const result = await getAuditLogs(testOrganisationId, undefined, undefined, 2, 0);

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(true);
    });

    it('should filter by organisation', async () => {
      const result = await getAuditLogs(testOrganisationId);

      expect(result.logs).toHaveLength(3);
      expect(result.logs.every(log => log.organisationId === testOrganisationId)).toBe(true);
    });

    it('should filter by user', async () => {
      const result = await getAuditLogs(testOrganisationId, testUserId);

      expect(result.logs).toHaveLength(3);
      expect(result.logs.every(log => log.userId === testUserId)).toBe(true);
    });

    it('should filter by action', async () => {
      const result = await getAuditLogs(testOrganisationId, undefined, AuditAction.USER_LOGIN);

      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].action).toBe(AuditAction.USER_LOGIN);
    });

    it('should include user and organisation data', async () => {
      const result = await getAuditLogs(testOrganisationId);

      expect(result.logs[0].user).toBeTruthy();
      expect(result.logs[0].organisation).toBeTruthy();
      expect(result.logs[0].user?.email).toBe('test@example.com');
      expect(result.logs[0].organisation?.name).toBe('Test Organisation');
    });
  });
});
