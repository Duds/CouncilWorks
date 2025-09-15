import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function addDemoUser() {
  try {
    // Get or create the sample organisation
    const organisation = await prisma.organisation.upsert({
      where: { name: 'Sample Council' },
      update: {},
      create: { name: 'Sample Council' }
    });

    // Create demo user with admin privileges
    const passwordHash = await bcrypt.hash('demo12345', 12);

    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@aegrid.com' },
      update: {
        name: 'Demo User',
        passwordHash,
        role: Role.ADMIN,
        organisationId: organisation.id,
        isActive: true,
      },
      create: {
        email: 'demo@aegrid.com',
        name: 'Demo User',
        passwordHash,
        role: Role.ADMIN,
        organisationId: organisation.id,
        isActive: true,
      }
    });

    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@aegrid.com');
    console.log('🔑 Password: demo12345');
    console.log('👤 Role: ADMIN');
    console.log('🏢 Organisation:', organisation.name);
    console.log('🆔 User ID:', demoUser.id);

    // Also create a few other demo users with different roles
    const users = [
      {
        email: 'manager@aegrid.com',
        name: 'Demo Manager',
        role: Role.MANAGER,
        password: 'demo12345'
      },
      {
        email: 'contractor@aegrid.com',
        name: 'Demo Contractor',
        role: Role.CONTRACTOR,
        password: 'demo12345'
      },
      {
        email: 'citizen@aegrid.com',
        name: 'Demo Citizen',
        role: Role.CITIZEN,
        password: 'demo12345'
      }
    ];

    for (const userData of users) {
      const userPasswordHash = await bcrypt.hash(userData.password, 12);
      
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          passwordHash: userPasswordHash,
          role: userData.role,
          organisationId: organisation.id,
          isActive: true,
        },
        create: {
          email: userData.email,
          name: userData.name,
          passwordHash: userPasswordHash,
          role: userData.role,
          organisationId: organisation.id,
          isActive: true,
        }
      });

      console.log(`✅ ${userData.role} user created: ${userData.email}`);
    }

    console.log('\n🎉 All demo users created! You can now test with:');
    console.log('👑 Admin: demo@aegrid.com / demo12345');
    console.log('👨‍💼 Manager: manager@aegrid.com / demo12345');
    console.log('🔧 Contractor: contractor@aegrid.com / demo12345');
    console.log('👤 Citizen: citizen@aegrid.com / demo12345');

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDemoUser();
