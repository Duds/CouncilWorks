#!/usr/bin/env tsx

/**
 * Test OAuth Login Flow
 * Simulate what happens when hello@dalerogers.com.au logs in via Google OAuth
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testOAuthLogin() {
  try {
    console.log('🔍 Testing OAuth Login Flow');
    console.log('=' .repeat(40));

    const email = 'hello@dalerogers.com.au';

    // Simulate what happens in the authorize function for OAuth
    console.log('\n📋 Step 1: Finding user in database...');
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organisation: true }
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Active: ${user.isActive}`);
    console.log(`  Organisation: ${user.organisation?.name || 'None'}`);

    // Simulate what should be returned to NextAuth
    console.log('\n📋 Step 2: User object that should be returned to NextAuth...');
    const userObject = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organisationId: user.organisationId,
      organisation: user.organisation,
      image: user.image,
    };

    console.log('User object:', JSON.stringify(userObject, null, 2));

    // Check if the user has the correct role
    if (user.role === 'MANAGER') {
      console.log('\n✅ User has MANAGER role - this should work correctly');
    } else {
      console.log(`\n❌ User has ${user.role} role - this might be the issue`);
    }

    // Check if user is active
    if (user.isActive) {
      console.log('✅ User is active - login should proceed');
    } else {
      console.log('❌ User is inactive - login should be blocked');
    }

    // Simulate what happens in the JWT callback
    console.log('\n📋 Step 3: JWT Token that should be created...');
    const jwtToken = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organisationId: user.organisationId,
      organisation: user.organisation,
      image: user.image,
    };

    console.log('JWT Token:', JSON.stringify(jwtToken, null, 2));

    // Simulate what happens in the session callback
    console.log('\n📋 Step 4: Session object that should be created...');
    const sessionObject = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organisationId: user.organisationId,
        organisation: user.organisation,
        image: user.image,
      }
    };

    console.log('Session Object:', JSON.stringify(sessionObject, null, 2));

    // Test the sidebar logic
    console.log('\n📋 Step 5: Testing sidebar logic...');
    const userRole = sessionObject.user.role;
    console.log(`User role from session: ${userRole}`);

    // Test the helper functions
    const canAccessAdmin = (role?: string) => role === 'ADMIN';
    const canAccessManager = (role?: string) => role === 'ADMIN' || role === 'MANAGER' || role === 'EXEC';
    const canAccessSupervisor = (role?: string) => role === 'ADMIN' || role === 'MANAGER' || role === 'SUPERVISOR';

    console.log(`canAccessAdmin(${userRole}): ${canAccessAdmin(userRole)}`);
    console.log(`canAccessManager(${userRole}): ${canAccessManager(userRole)}`);
    console.log(`canAccessSupervisor(${userRole}): ${canAccessSupervisor(userRole)}`);

    // Test what sections should be visible
    console.log('\n📋 Step 6: Sidebar sections that should be visible...');
    console.log(`Strategic Overview: ${canAccessManager(userRole) ? 'YES' : 'NO'}`);
    console.log(`Asset Planning: ${canAccessSupervisor(userRole) ? 'YES' : 'NO'}`);
    console.log(`Operations Management: ${canAccessSupervisor(userRole) ? 'YES' : 'NO'}`);
    console.log(`Contractor/Partner Portal: ${canAccessManager(userRole) ? 'YES' : 'NO'}`);
    console.log(`Community Engagement: ${canAccessSupervisor(userRole) ? 'YES' : 'NO'}`);
    console.log(`System Administration: ${canAccessAdmin(userRole) ? 'YES' : 'NO'}`);

  } catch (error) {
    console.error('Error testing OAuth login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOAuthLogin();
