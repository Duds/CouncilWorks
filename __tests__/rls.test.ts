import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { 
  setRLSContext, 
  clearRLSContext, 
  withRLSContext, 
  checkRLSStatus,
  testRLSPolicies
} from '@/lib/rls';

describe('Row-Level Security (RLS)', () => {
  let testOrganisation1Id: string;
  let testOrganisation2Id: string;
  let testUser1Id: string;
  let testUser2Id: string;

  beforeEach(async () => {
    // Create test organisations
    const organisation1 = await prisma.organisation.create({
      data: { name: 'Test Organisation 1' }
    });
    testOrganisation1Id = organisation1.id;

    const organisation2 = await prisma.organisation.create({
      data: { name: 'Test Organisation 2' }
    });
    testOrganisation2Id = organisation2.id;

    // Create test users
    const user1 = await prisma.user.create({
      data: {
        email: 'user1@org1.com',
        name: 'User 1',
        role: Role.ADMIN,
        organisationId: testOrganisation1Id,
        isActive: true,
      }
    });
    testUser1Id = user1.id;

    const user2 = await prisma.user.create({
      data: {
        email: 'user2@org2.com',
        name: 'User 2',
        role: Role.ADMIN,
        organisationId: testOrganisation2Id,
        isActive: true,
      }
    });
    testUser2Id = user2.id;
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.auditLog.deleteMany({
      where: { 
        OR: [
          { organisationId: testOrganisation1Id },
          { organisationId: testOrganisation2Id }
        ]
      }
    });
    await prisma.user.deleteMany({
      where: { 
        OR: [
          { organisationId: testOrganisation1Id },
          { organisationId: testOrganisation2Id }
        ]
      }
    });
    await prisma.organisation.deleteMany({
      where: { 
        OR: [
          { id: testOrganisation1Id },
          { id: testOrganisation2Id }
        ]
      }
    });
  });

  describe('RLS Context Management', () => {
    it('should set and clear RLS context correctly', async () => {
      await setRLSContext(testOrganisation1Id, Role.ADMIN);
      
      const status = await checkRLSStatus();
      expect(status.organisationId).toBe(testOrganisation1Id);
      expect(status.userRole).toBe(Role.ADMIN);

      await clearRLSContext();
      
      const clearedStatus = await checkRLSStatus();
      expect(clearedStatus.organisationId).toBe('');
      expect(clearedStatus.userRole).toBe('');
    });

    it('should use withRLSContext helper correctly', async () => {
      const result = await withRLSContext(
        testOrganisation1Id,
        Role.ADMIN,
        async () => {
          const status = await checkRLSStatus();
          return status;
        }
      );

      expect(result.organisationId).toBe(testOrganisation1Id);
      expect(result.userRole).toBe(Role.ADMIN);

      // Context should be cleared after the operation
      const finalStatus = await checkRLSStatus();
      expect(finalStatus.organisationId).toBe('');
      expect(finalStatus.userRole).toBe('');
    });
  });

  describe('RLS Data Isolation', () => {
    it('should only allow access to users in the same organisation', async () => {
      const result = await withRLSContext(
        testOrganisation1Id,
        Role.ADMIN,
        async () => {
          const users = await prisma.user.findMany();
          return users;
        }
      );

      // Should only see users from organisation 1
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('user1@org1.com');
      expect(result[0].organisationId).toBe(testOrganisation1Id);
    });

    it('should prevent cross-organisation data access', async () => {
      // Set context for organisation 1
      await setRLSContext(testOrganisation1Id, Role.ADMIN);
      
      // Try to access user from organisation 2 by ID
      const user2 = await prisma.user.findUnique({
        where: { id: testUser2Id }
      });

      // Should not be able to access user from different organisation
      expect(user2).toBeNull();

      await clearRLSContext();
    });

    it('should allow access to own organisation data', async () => {
      const result = await withRLSContext(
        testOrganisation2Id,
        Role.ADMIN,
        async () => {
          const user = await prisma.user.findUnique({
            where: { id: testUser2Id }
          });
          return user;
        }
      );

      expect(result).toBeTruthy();
      expect(result?.email).toBe('user2@org2.com');
      expect(result?.organisationId).toBe(testOrganisation2Id);
    });
  });

  describe('RLS Policy Testing', () => {
    it('should test RLS policies correctly', async () => {
      const result = await testRLSPolicies(testOrganisation1Id, Role.ADMIN);

      expect(result.canAccessOwnOrg).toBe(true);
      expect(result.canAccessOtherOrg).toBe(false);
      expect(result.userCount).toBe(1);
    });

    it('should prevent unauthorised user creation', async () => {
      // Try to create a user in a different organisation
      await expect(
        withRLSContext(testOrganisation1Id, Role.CITIZEN, async () => {
          return await prisma.user.create({
            data: {
              email: 'unauthorized@org2.com',
              name: 'Unauthorized User',
              role: Role.CITIZEN,
              organisationId: testOrganisation2Id, // Different org
              isActive: true,
            }
          });
        })
      ).rejects.toThrow();
    });

    it('should allow authorised user creation', async () => {
      const result = await withRLSContext(
        testOrganisation1Id,
        Role.ADMIN,
        async () => {
          return await prisma.user.create({
            data: {
              email: 'newuser@org1.com',
              name: 'New User',
              role: Role.CITIZEN,
              organisationId: testOrganisation1Id,
              isActive: true,
            }
          });
        }
      );

      expect(result.email).toBe('newuser@org1.com');
      expect(result.organisationId).toBe(testOrganisation1Id);
    });
  });

  describe('RLS with Different Roles', () => {
    it('should enforce role-based permissions', async () => {
      // Create a manager user
      const manager = await prisma.user.create({
        data: {
          email: 'manager@org1.com',
          name: 'Manager User',
          role: Role.MANAGER,
          organisationId: testOrganisation1Id,
          isActive: true,
        }
      });

      // Manager should be able to create users
      const result = await withRLSContext(
        testOrganisation1Id,
        Role.MANAGER,
        async () => {
          return await prisma.user.create({
            data: {
              email: 'crew@org1.com',
              name: 'Crew User',
              role: Role.CREW,
              organisationId: testOrganisation1Id,
              isActive: true,
            }
          });
        }
      );

      expect(result.email).toBe('crew@org1.com');
      expect(result.role).toBe(Role.CREW);

      // Clean up
      await prisma.user.deleteMany({
        where: { 
          OR: [
            { id: manager.id },
            { id: result.id }
          ]
        }
      });
    });

    it('should prevent lower roles from creating users', async () => {
      await expect(
        withRLSContext(testOrganisation1Id, Role.CITIZEN, async () => {
          return await prisma.user.create({
            data: {
              email: 'unauthorized@org1.com',
              name: 'Unauthorized User',
              role: Role.CITIZEN,
              organisationId: testOrganisation1Id,
              isActive: true,
            }
          });
        })
      ).rejects.toThrow();
    });
  });

  describe('RLS Audit Logging', () => {
    it('should only show audit logs for own organisation', async () => {
      // Create audit logs for both organisations
      await prisma.auditLog.createMany({
        data: [
          {
            action: 'USER_LOGIN',
            userId: testUser1Id,
            organisationId: testOrganisation1Id,
            details: { test: 'data1' },
          },
          {
            action: 'USER_LOGIN',
            userId: testUser2Id,
            organisationId: testOrganisation2Id,
            details: { test: 'data2' },
          },
        ],
      });

      const result = await withRLSContext(
        testOrganisation1Id,
        Role.ADMIN,
        async () => {
          return await prisma.auditLog.findMany();
        }
      );

      // Should only see audit logs from organisation 1
      expect(result).toHaveLength(1);
      expect(result[0].organisationId).toBe(testOrganisation1Id);
      expect(result[0].userId).toBe(testUser1Id);
    });
  });
});
