import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { GET as getUsers, POST as createUser } from '@/app/api/admin/users/route';
import { GET as getUser, PUT as updateUser, DELETE as deleteUser } from '@/app/api/admin/users/[id]/route';
import { GET as getAuditLogs } from '@/app/api/admin/audit-logs/route';

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

const mockGetServerSession = require('next-auth').getServerSession;

describe('Admin API Routes', () => {
  let testOrganisationId: string;
  let adminUserId: string;
  let managerUserId: string;
  let regularUserId: string;

  beforeEach(async () => {
    // Create test organisation
    const organisation = await prisma.organisation.create({
      data: { name: 'Test Organisation' }
    });
    testOrganisationId = organisation.id;

    // Create test users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        role: Role.ADMIN,
        organisationId: testOrganisationId,
        isActive: true,
      }
    });
    adminUserId = adminUser.id;

    const managerUser = await prisma.user.create({
      data: {
        email: 'manager@test.com',
        name: 'Manager User',
        role: Role.MANAGER,
        organisationId: testOrganisationId,
        isActive: true,
      }
    });
    managerUserId = managerUser.id;

    const regularUser = await prisma.user.create({
      data: {
        email: 'user@test.com',
        name: 'Regular User',
        role: Role.CITIZEN,
        organisationId: testOrganisationId,
        isActive: true,
      }
    });
    regularUserId = regularUser.id;
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

  describe('GET /api/admin/users', () => {
    it('should return users for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users');
      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(3);
      expect(data.pagination.total).toBe(3);
    });

    it('should return users for manager', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: managerUserId,
          role: Role.MANAGER,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users');
      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(3);
    });

    it('should reject non-admin/manager users', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: regularUserId,
          role: Role.CITIZEN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users');
      const response = await getUsers(request);

      expect(response.status).toBe(403);
    });

    it('should reject unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/users');
      const response = await getUsers(request);

      expect(response.status).toBe(401);
    });

    it('should filter users by search term', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users?search=admin');
      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(1);
      expect(data.users[0].email).toBe('admin@test.com');
    });

    it('should filter users by role', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users?role=MANAGER');
      const response = await getUsers(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(1);
      expect(data.users[0].role).toBe(Role.MANAGER);
    });
  });

  describe('POST /api/admin/users', () => {
    it('should create user for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New User',
          email: 'new@test.com',
          role: Role.CITIZEN,
          password: 'password123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await createUser(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.email).toBe('new@test.com');
      expect(data.role).toBe(Role.CITIZEN);
    });

    it('should reject duplicate email', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Duplicate User',
          email: 'admin@test.com', // Already exists
          role: Role.CITIZEN,
          password: 'password123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await createUser(request);

      expect(response.status).toBe(409);
    });

    it('should validate input data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: '', // Invalid: empty name
          email: 'invalid-email', // Invalid: not an email
          role: 'INVALID_ROLE', // Invalid: not a valid role
          password: '123', // Invalid: too short
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await createUser(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/admin/users/[id]', () => {
    it('should return user details for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/' + managerUserId);
      const response = await getUser(request, { params: { id: managerUserId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(managerUserId);
      expect(data.email).toBe('manager@test.com');
    });

    it('should return 404 for non-existent user', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/non-existent');
      const response = await getUser(request, { params: { id: 'non-existent' } });

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/admin/users/[id]', () => {
    it('should update user for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/' + managerUserId, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Manager',
          role: Role.SUPERVISOR,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await updateUser(request, { params: { id: managerUserId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('Updated Manager');
      expect(data.role).toBe(Role.SUPERVISOR);
    });

    it('should prevent self-deletion', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/' + adminUserId, {
        method: 'DELETE',
      });

      const response = await deleteUser(request, { params: { id: adminUserId } });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/admin/audit-logs', () => {
    beforeEach(async () => {
      // Create some audit logs
      await prisma.auditLog.createMany({
        data: [
          {
            action: 'USER_LOGIN',
            userId: adminUserId,
            organisationId: testOrganisationId,
            details: { test: 'data' },
          },
          {
            action: 'USER_LOGOUT',
            userId: managerUserId,
            organisationId: testOrganisationId,
            details: { test: 'data2' },
          },
        ],
      });
    });

    it('should return audit logs for admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/audit-logs');
      const response = await getAuditLogs(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.logs).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
    });

    it('should reject non-admin users', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: managerUserId,
          role: Role.MANAGER,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/audit-logs');
      const response = await getAuditLogs(request);

      expect(response.status).toBe(403);
    });

    it('should filter by action', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: adminUserId,
          role: Role.ADMIN,
          organisationId: testOrganisationId,
        }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/audit-logs?action=USER_LOGIN');
      const response = await getAuditLogs(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.logs).toHaveLength(1);
      expect(data.logs[0].action).toBe('USER_LOGIN');
    });
  });
});
