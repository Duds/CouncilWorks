#!/usr/bin/env tsx

/**
 * Script to verify user role in the database
 * Usage: npx tsx scripts/verify-user-role.ts <email>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyUserRole(email: string) {
  try {
    console.log(`Verifying user role for ${email}...`);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        organisation: {
          select: {
            name: true
          }
        },
        updatedAt: true
      }
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      return null;
    }

    console.log(`✅ User found:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Organisation: ${user.organisation?.name || 'None'}`);
    console.log(`   Last Updated: ${user.updatedAt.toISOString()}`);

    return user;
  } catch (error) {
    console.error('Error verifying user role:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error('Usage: npx tsx scripts/verify-user-role.ts <email>');
    process.exit(1);
  }

  const email = args[0];

  try {
    await verifyUserRole(email);
  } catch (error) {
    console.error('❌ Failed to verify user role:', error);
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

export { verifyUserRole };
