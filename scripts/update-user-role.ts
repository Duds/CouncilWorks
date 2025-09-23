#!/usr/bin/env tsx

/**
 * Script to update user role in the database
 * Usage: npx tsx scripts/update-user-role.ts <email> <role>
 */

import { AuditAction, PrismaClient, Role } from '@prisma/client';
import { logAuditEvent } from '../lib/audit';

const prisma = new PrismaClient();

async function updateUserRole(email: string, newRole: Role) {
  try {
    console.log(`Updating user ${email} to role ${newRole}...`);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organisation: true }
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}`);
    console.log(`Organisation: ${user.organisation?.name || 'None'}`);

    // Update the user role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organisationId: true,
        updatedAt: true
      }
    });

    console.log(`✅ Successfully updated user role to ${updatedUser.role}`);

    // Log audit event
    await logAuditEvent(
      AuditAction.USER_ROLE_CHANGE,
      'system', // Using 'system' as the actor since this is a script
      user.organisationId || undefined,
      {
        targetUserId: updatedUser.id,
        targetUserEmail: updatedUser.email,
        previousRole: user.role,
        newRole: updatedUser.role,
        changedBy: 'system-script'
      }
    );

    console.log(`📝 Audit event logged`);

    return updatedUser;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: npx tsx scripts/update-user-role.ts <email> <role>');
    console.error('Available roles:', Object.values(Role).join(', '));
    process.exit(1);
  }

  const [email, roleString] = args;

  // Validate role
  if (!Object.values(Role).includes(roleString as Role)) {
    console.error(`Invalid role: ${roleString}`);
    console.error('Available roles:', Object.values(Role).join(', '));
    process.exit(1);
  }

  const role = roleString as Role;

  try {
    await updateUserRole(email, role);
    console.log('✅ User role update completed successfully');
  } catch (error) {
    console.error('❌ Failed to update user role:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});

export { updateUserRole };
