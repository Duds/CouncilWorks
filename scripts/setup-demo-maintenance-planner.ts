import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupDemoMaintenancePlanner() {
  try {
    console.log('🔧 Setting up Demo Maintenance Planner...');

    // Get or create the demo organisation
    const organisation = await prisma.organisation.upsert({
      where: { name: 'Greenfield Shire Council' },
      update: {},
      create: {
        name: 'Greenfield Shire Council',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Organisation: ${organisation.name}`);

    // Create or update the demo maintenance planner user
    const passwordHash = await bcrypt.hash('demo12345', 12);

    const maintenancePlanner = await prisma.user.upsert({
      where: { email: 'hello@dalerogers.com.au' },
      update: {
        name: 'Dale Rogers - Maintenance Planner',
        passwordHash,
        role: Role.MAINTENANCE_PLANNER,
        organisationId: organisation.id,
        isActive: true,
        phoneNumber: '+61 400 123 456',
        bio: 'Senior Maintenance Planner - Specialized in resilient asset management and risk-driven scheduling',
        timezone: 'Australia/Sydney',
        language: 'en-AU',
        notificationPreferences: {
          email: true,
          sms: true,
          push: true,
          maintenanceAlerts: true,
          riskAlerts: true,
          emergencyAlerts: true,
        },
        lastLoginAt: null,
        passwordResetAt: null,
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
        mfaVerifiedAt: null,
        updatedAt: new Date(),
      },
      create: {
        email: 'hello@dalerogers.com.au',
        name: 'Dale Rogers - Maintenance Planner',
        passwordHash,
        role: Role.MAINTENANCE_PLANNER,
        organisationId: organisation.id,
        isActive: true,
        phoneNumber: '+61 400 123 456',
        bio: 'Senior Maintenance Planner - Specialized in resilient asset management and risk-driven scheduling',
        timezone: 'Australia/Sydney',
        language: 'en-AU',
        notificationPreferences: {
          email: true,
          sms: true,
          push: true,
          maintenanceAlerts: true,
          riskAlerts: true,
          emergencyAlerts: true,
        },
        emailVerified: new Date(),
        image: null,
        lastLoginAt: null,
        passwordResetAt: null,
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
        mfaVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('✅ Demo Maintenance Planner configured successfully!');
    console.log('📧 Email: hello@dalerogers.com.au');
    console.log('🔑 Password: demo12345');
    console.log('👤 Role: MAINTENANCE_PLANNER');
    console.log('🏢 Organisation: Greenfield Shire Council');
    console.log('🆔 User ID:', maintenancePlanner.id);
    console.log('📱 Phone:', maintenancePlanner.phoneNumber);
    console.log('🌏 Timezone:', maintenancePlanner.timezone);
    console.log(
      '🔔 Notifications:',
      JSON.stringify(maintenancePlanner.notificationPreferences, null, 2)
    );

    // Also create a few additional demo users for different scenarios
    const additionalUsers = [
      {
        email: 'demo.manager@greenfieldshire.nsw.gov.au',
        name: 'Demo Manager',
        role: Role.MANAGER,
        phoneNumber: '+61 400 123 457',
        bio: 'Demo Manager - For testing manager workflows and approvals',
      },
      {
        email: 'demo.supervisor@greenfieldshire.nsw.gov.au',
        name: 'Demo Supervisor',
        role: Role.SUPERVISOR,
        phoneNumber: '+61 400 123 458',
        bio: 'Demo Supervisor - For testing supervisor oversight and crew management',
      },
      {
        email: 'demo.crew@greenfieldshire.nsw.gov.au',
        name: 'Demo Crew Member',
        role: Role.CREW,
        phoneNumber: '+61 400 123 459',
        bio: 'Demo Crew Member - For testing field operations and work order execution',
      },
    ];

    console.log('\n🔧 Creating additional demo users...');

    for (const userData of additionalUsers) {
      const userPasswordHash = await bcrypt.hash('demo12345', 12);

      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          passwordHash: userPasswordHash,
          role: userData.role as Role,
          organisationId: organisation.id,
          isActive: true,
          phoneNumber: userData.phoneNumber,
          bio: userData.bio,
          timezone: 'Australia/Sydney',
          language: 'en-AU',
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
            maintenanceAlerts: true,
            riskAlerts: true,
            emergencyAlerts: true,
          },
          updatedAt: new Date(),
        },
        create: {
          email: userData.email,
          name: userData.name,
          passwordHash: userPasswordHash,
          role: userData.role as Role,
          organisationId: organisation.id,
          isActive: true,
          phoneNumber: userData.phoneNumber,
          bio: userData.bio,
          timezone: 'Australia/Sydney',
          language: 'en-AU',
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
            maintenanceAlerts: true,
            riskAlerts: true,
            emergencyAlerts: true,
          },
          emailVerified: new Date(),
          image: null,
          lastLoginAt: null,
          passwordResetAt: null,
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: [],
          mfaVerifiedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`✅ ${userData.role} user created: ${userData.email}`);
    }

    console.log('\n🎉 Demo environment setup complete!');
    console.log('\n📋 Demo User Credentials:');
    console.log('🔧 Maintenance Planner: hello@dalerogers.com.au / demo12345');
    console.log(
      '👨‍💼 Manager: demo.manager@greenfieldshire.nsw.gov.au / demo12345'
    );
    console.log(
      '👨‍🔧 Supervisor: demo.supervisor@greenfieldshire.nsw.gov.au / demo12345'
    );
    console.log(
      '👷 Crew Member: demo.crew@greenfieldshire.nsw.gov.au / demo12345'
    );

    console.log('\n🎯 Demo Focus:');
    console.log(
      '• Primary user: hello@dalerogers.com.au (MAINTENANCE_PLANNER)'
    );
    console.log('• Organisation: Greenfield Shire Council');
    console.log('• Journey: Maintenance Planner workflow demonstration');
    console.log(
      '• Features: Risk-driven scheduling, resilience monitoring, asset management'
    );
  } catch (error) {
    console.error('❌ Error setting up demo maintenance planner:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupDemoMaintenancePlanner();
