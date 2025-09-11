import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Database utility for managing Row-Level Security (RLS) context
 * This ensures that all database operations are scoped to the correct organisation
 */

/**
 * Set the RLS context for the current database connection
 * This must be called before any database operations to ensure proper data isolation
 * @param organisationId - The organisation ID to scope queries to
 * @param userRole - The user's role for permission checks
 */
export async function setRLSContext(organisationId: string, userRole: Role) {
  await prisma.$executeRaw`
    SELECT set_config('app.current_user_organisation_id', ${organisationId}, true);
  `;
  await prisma.$executeRaw`
    SELECT set_config('app.current_user_role', ${userRole}, true);
  `;
}

/**
 * Clear the RLS context
 * This should be called after database operations to clean up
 */
export async function clearRLSContext() {
  await prisma.$executeRaw`
    SELECT set_config('app.current_user_organisation_id', '', true);
  `;
  await prisma.$executeRaw`
    SELECT set_config('app.current_user_role', '', true);
  `;
}

/**
 * Execute a database operation with RLS context
 * This is a helper function that automatically sets and clears RLS context
 * @param organisationId - The organisation ID to scope queries to
 * @param userRole - The user's role for permission checks
 * @param operation - The database operation to execute
 */
export async function withRLSContext<T>(
  organisationId: string,
  userRole: Role,
  operation: () => Promise<T>
): Promise<T> {
  try {
    await setRLSContext(organisationId, userRole);
    return await operation();
  } finally {
    await clearRLSContext();
  }
}

/**
 * Check if RLS is properly configured
 * This can be used for debugging RLS issues
 */
export async function checkRLSStatus(): Promise<{
  organisationId: string | null;
  userRole: string | null;
}> {
  const [orgResult, roleResult] = await Promise.all([
    prisma.$queryRaw<[{ current_setting: string }]>`
      SELECT current_setting('app.current_user_organisation_id', true) as current_setting;
    `,
    prisma.$queryRaw<[{ current_setting: string }]>`
      SELECT current_setting('app.current_user_role', true) as current_setting;
    `,
  ]);

  return {
    organisationId: orgResult[0]?.current_setting || null,
    userRole: roleResult[0]?.current_setting || null,
  };
}

/**
 * Test RLS policies by attempting to access data from different organisations
 * This is useful for testing and debugging RLS configuration
 */
export async function testRLSPolicies(
  organisationId: string,
  userRole: Role
): Promise<{
  canAccessOwnOrg: boolean;
  canAccessOtherOrg: boolean;
  userCount: number;
}> {
  return withRLSContext(organisationId, userRole, async () => {
    try {
      // Try to access users from own organisation
      const ownOrgUsers = await prisma.user.findMany({
        where: { "organisationId": organisationId },
      });

      // Try to access users from a different organisation (should fail)
      let otherOrgUsers: any[] = [];
      try {
        otherOrgUsers = await prisma.user.findMany({
          where: { "organisationId": { not: organisationId } },
        });
      } catch (error) {
        // Expected to fail due to RLS
      }

      return {
        canAccessOwnOrg: ownOrgUsers.length > 0,
        canAccessOtherOrg: otherOrgUsers.length > 0,
        userCount: ownOrgUsers.length,
      };
    } catch (_error) {
      console.error("RLS test failed:", _error);
      return {
        canAccessOwnOrg: false,
        canAccessOtherOrg: false,
        userCount: 0,
      };
    }
  });
}
