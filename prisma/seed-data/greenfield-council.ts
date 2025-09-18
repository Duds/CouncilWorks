import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedGreenfieldCouncil() {
  console.log('🏛️ Seeding Greenfield Shire Council...');

  try {
    // Create Greenfield Shire Council organization
    const greenfieldCouncil = await prisma.organisation.upsert({
      where: { name: 'Greenfield Shire Council' },
      update: {},
      create: {
        name: 'Greenfield Shire Council'
      }
    });

    console.log(`✅ Created organization: ${greenfieldCouncil.name}`);

    // Create users for Greenfield Shire Council
    const users = [
      {
        email: 'sarah.chen@greenfieldshire.nsw.gov.au',
        name: 'Sarah Chen',
        role: 'EXEC',
        phoneNumber: '+61 2 9876 5433',
        bio: 'Chief Executive Officer - Strategic oversight and resilience management'
      },
      {
        email: 'michael.rodriguez@greenfieldshire.nsw.gov.au',
        name: 'Michael Rodriguez',
        role: 'MANAGER',
        phoneNumber: '+61 2 9876 5434',
        bio: 'Infrastructure Manager - Resource allocation and risk assessment'
      },
      {
        email: 'jennifer.kim@greenfieldshire.nsw.gov.au',
        name: 'Jennifer Kim',
        role: 'MANAGER',
        phoneNumber: '+61 2 9876 5435',
        bio: 'Renewable Energy Manager - Grid management and battery operations'
      },
      {
        email: 'david.thompson@greenfieldshire.nsw.gov.au',
        name: 'David Thompson',
        role: 'SUPERVISOR',
        phoneNumber: '+61 2 9876 5436',
        bio: 'Field Operations Supervisor - Emergency response and crew management'
      },
      {
        email: 'lisa.wang@greenfieldshire.nsw.gov.au',
        name: 'Lisa Wang',
        role: 'SUPERVISOR',
        phoneNumber: '+61 2 9876 5437',
        bio: 'Smart Infrastructure Supervisor - IoT monitoring and system optimization'
      },
      {
        email: 'james.murphy@greenfieldshire.nsw.gov.au',
        name: 'James Murphy',
        role: 'CREW',
        phoneNumber: '+61 2 9876 5438',
        bio: 'Senior Maintenance Technician - Equipment operation and safety protocols'
      },
      {
        email: 'emma.davis@greenfieldshire.nsw.gov.au',
        name: 'Emma Davis',
        role: 'CREW',
        phoneNumber: '+61 2 9876 5439',
        bio: 'Renewable Energy Technician - Solar maintenance and battery monitoring'
      },
      {
        email: 'admin@greenfieldshire.nsw.gov.au',
        name: 'System Administrator',
        role: 'ADMIN',
        phoneNumber: '+61 2 9876 5440',
        bio: 'IT Systems Administrator - System configuration and security management'
      }
    ];

    // Create users with hashed passwords
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash('Greenfield2024!', 12);
      
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          name: userData.name,
          passwordHash: hashedPassword,
          role: userData.role,
          organisationId: greenfieldCouncil.id,
          phoneNumber: userData.phoneNumber,
          bio: userData.bio,
          isActive: true,
          emailVerified: new Date('2020-01-01')
        }
      });

      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }


    console.log('🎉 Greenfield Shire Council seeding completed successfully!');
    return greenfieldCouncil;

  } catch (error) {
    console.error('❌ Error seeding Greenfield Shire Council:', error);
    throw error;
  }
}

export async function cleanupGreenfieldCouncil() {
  console.log('🧹 Cleaning up Greenfield Shire Council data...');
  
  try {
    // Delete users first (due to foreign key constraints)
    await prisma.user.deleteMany({
      where: {
        organisation: {
          name: 'Greenfield Shire Council'
        }
      }
    });

    // Delete organization
    await prisma.organisation.deleteMany({
      where: {
        name: 'Greenfield Shire Council'
      }
    });

    console.log('✅ Greenfield Shire Council cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up Greenfield Shire Council:', error);
    throw error;
  }
}