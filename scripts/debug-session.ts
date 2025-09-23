#!/usr/bin/env tsx

/**
 * Debug Session Script
 * Check what's in the session for hello@dalerogers.com.au
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSession() {
  try {
    console.log('🔍 Debugging Session Data');
    console.log('=' .repeat(40));

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: 'hello@dalerogers.com.au' },
      include: { organisation: true }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('\n📋 Database User Data:');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Active: ${user.isActive}`);
    console.log(`Organisation: ${user.organisation?.name || 'None'}`);
    console.log(`Last Login: ${user.lastLoginAt?.toISOString() || 'Never'}`);

    // Check if there are any JWT tokens in the database
    console.log('\n🔑 JWT Tokens in Database:');
    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      include: { user: true }
    });

    console.log(`Found ${sessions.length} sessions`);
    sessions.forEach((session, index) => {
      console.log(`Session ${index + 1}:`);
      console.log(`  Token: ${session.sessionToken.substring(0, 20)}...`);
      console.log(`  Expires: ${session.expires.toISOString()}`);
      console.log(`  User Role: ${session.user.role}`);
    });

    // Check accounts
    console.log('\n🔗 OAuth Accounts:');
    const accounts = await prisma.account.findMany({
      where: { userId: user.id }
    });

    console.log(`Found ${accounts.length} accounts`);
    accounts.forEach((account, index) => {
      console.log(`Account ${index + 1}:`);
      console.log(`  Provider: ${account.provider}`);
      console.log(`  Type: ${account.type}`);
      console.log(`  Provider Account ID: ${account.providerAccountId}`);
    });

  } catch (error) {
    console.error('Error debugging session:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSession();
