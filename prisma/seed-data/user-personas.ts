/**
 * User Personas - Complete Role-Based User Generation
 *
 * Creates realistic user personas for all roles in the Aegrid system,
 * demonstrating purpose-driven access control and role-based workflows.
 */

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function generateUserPersonas(
  prisma: PrismaClient,
  organisationId: string
) {
  console.log('  👥 Creating user personas...');

  const users = [];

  // Executive Leadership
  const sarahChen = await prisma.user.create({
    data: {
      email: 'sarah.chen@greenfieldshire.gov.au',
      name: 'Sarah Chen',
      role: Role.EXEC,
      organisationId,
      passwordHash: await bcrypt.hash('Demo123!', 12),
      emailVerified: new Date(),
      phoneNumber: '+61 400 123 456',
      bio: 'Chief Executive Officer with 20+ years in public sector leadership and strategic asset management.',
      timezone: 'Australia/Melbourne',
      language: 'en-AU',
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        emergency_alerts: true,
        strategic_reports: true,
        margin_alerts: true,
      },
    },
  });
  users.push(sarahChen);

  // Management Team
  const michaelRodriguez = await prisma.user.create({
    data: {
      email: 'michael.rodriguez@greenfieldshire.gov.au',
      name: 'Michael Rodriguez',
      role: Role.MANAGER,
      organisationId,
      passwordHash: await bcrypt.hash('Demo123!', 12),
      emailVerified: new Date(),
      phoneNumber: '+61 400 123 457',
      bio: 'Asset Management Manager specializing in renewable energy infrastructure and risk-based maintenance.',
      timezone: 'Australia/Melbourne',
      language: 'en-AU',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        emergency_alerts: true,
        operational_reports: true,
        risk_alerts: true,
      },
    },
  });
  users.push(michaelRodriguez);

  // Supervisory Team
  const emmaThompson = await prisma.user.create({
    data: {
      email: 'emma.thompson@greenfieldshire.gov.au',
      name: 'Emma Thompson',
      role: Role.SUPERVISOR,
      organisationId,
      passwordHash: await bcrypt.hash('Demo123!', 12),
      emailVerified: new Date(),
      phoneNumber: '+61 400 123 458',
      bio: 'Operations Supervisor with expertise in work coordination and emergency response.',
      timezone: 'Australia/Melbourne',
      language: 'en-AU',
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
        emergency_alerts: true,
        work_order_updates: true,
        team_notifications: true,
      },
    },
  });
  users.push(emmaThompson);

  // Field Crew
  const jamesWilson = await prisma.user.create({
    data: {
      email: 'james.wilson@greenfieldshire.gov.au',
      name: 'James Wilson',
      role: Role.CREW,
      organisationId,
      passwordHash: await bcrypt.hash('Demo123!', 12),
      emailVerified: new Date(),
      phoneNumber: '+61 400 123 459',
      bio: 'Senior Field Technician with 15+ years experience in electrical infrastructure and renewable energy systems.',
      timezone: 'Australia/Melbourne',
      language: 'en-AU',
      notificationPreferences: {
        email: false,
        sms: true,
        push: true,
        emergency_alerts: true,
        work_assignments: true,
        safety_alerts: true,
      },
    },
  });
  users.push(jamesWilson);

  // System Administration
  const davidPark = await prisma.user.create({
    data: {
      email: 'david.park@greenfieldshire.gov.au',
      name: 'David Park',
      role: Role.ADMIN,
      organisationId,
      passwordHash: await bcrypt.hash('Demo123!', 12),
      emailVerified: new Date(),
      phoneNumber: '+61 400 123 460',
      bio: 'System Administrator with expertise in platform configuration and user management.',
      timezone: 'Australia/Melbourne',
      language: 'en-AU',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        system_alerts: true,
        security_alerts: true,
        maintenance_windows: true,
      },
    },
  });
  users.push(davidPark);

  // Contractor Representatives
  const contractors = [
    {
      name: 'Lisa Chen',
      email: 'lisa.chen@greenfieldelectrical.com.au',
      role: Role.CONTRACTOR,
      bio: 'Senior Electrician at Greenfield Electrical, specializing in renewable energy installations.',
      phoneNumber: '+61 400 123 461',
    },
    {
      name: 'Robert Kumar',
      email: 'robert.kumar@windpower.com.au',
      role: Role.CONTRACTOR,
      bio: 'Wind Turbine Specialist with 10+ years in wind farm maintenance and operations.',
      phoneNumber: '+61 400 123 462',
    },
    {
      name: 'Amanda Foster',
      email: 'amanda.foster@solarpro.com.au',
      role: Role.CONTRACTOR,
      bio: 'Solar Installation Manager with expertise in large-scale solar farm operations.',
      phoneNumber: '+61 400 123 463',
    },
  ];

  for (const contractor of contractors) {
    const user = await prisma.user.create({
      data: {
        email: contractor.email,
        name: contractor.name,
        role: contractor.role,
        organisationId,
        passwordHash: await bcrypt.hash('Demo123!', 12),
        emailVerified: new Date(),
        phoneNumber: contractor.phoneNumber,
        bio: contractor.bio,
        timezone: 'Australia/Melbourne',
        language: 'en-AU',
        notificationPreferences: {
          email: true,
          sms: true,
          push: true,
          work_orders: true,
          sla_alerts: true,
          contract_updates: true,
        },
      },
    });
    users.push(user);
  }

  // Partner Representatives
  const partners = [
    {
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@techpartners.com.au',
      role: Role.PARTNER,
      bio: 'Technology Partner specializing in IoT sensors and smart infrastructure solutions.',
      phoneNumber: '+61 400 123 464',
    },
    {
      name: 'Mark Stevens',
      email: 'mark.stevens@batterystorage.com.au',
      role: Role.PARTNER,
      bio: 'Battery Storage Solutions Partner with expertise in grid-scale energy storage.',
      phoneNumber: '+61 400 123 465',
    },
  ];

  for (const partner of partners) {
    const user = await prisma.user.create({
      data: {
        email: partner.email,
        name: partner.name,
        role: partner.role,
        organisationId,
        passwordHash: await bcrypt.hash('Demo123!', 12),
        emailVerified: new Date(),
        phoneNumber: partner.phoneNumber,
        bio: partner.bio,
        timezone: 'Australia/Melbourne',
        language: 'en-AU',
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
          project_updates: true,
          technical_alerts: true,
          partnership_opportunities: true,
        },
      },
    });
    users.push(user);
  }

  // Citizen Representatives (for testing citizen portal)
  const citizens = [
    {
      name: 'Community Member',
      email: 'citizen@greenfieldshire.gov.au',
      role: Role.CITIZEN,
      bio: 'Active community member using the citizen portal for service requests and feedback.',
      phoneNumber: '+61 400 123 466',
    },
  ];

  for (const citizen of citizens) {
    const user = await prisma.user.create({
      data: {
        email: citizen.email,
        name: citizen.name,
        role: citizen.role,
        organisationId,
        passwordHash: await bcrypt.hash('Demo123!', 12),
        emailVerified: new Date(),
        phoneNumber: citizen.phoneNumber,
        bio: citizen.bio,
        timezone: 'Australia/Melbourne',
        language: 'en-AU',
        notificationPreferences: {
          email: true,
          sms: false,
          push: false,
          service_updates: true,
          community_alerts: true,
          feedback_requests: true,
        },
      },
    });
    users.push(user);
  }

  // Add Dale Rogers (the developer) as a manager user
  const daleRogers = await prisma.user.upsert({
    where: { email: 'hello@dalerogers.com.au' },
    update: {
      name: 'Dale Rogers',
      role: Role.MANAGER,
      organisationId,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      email: 'hello@dalerogers.com.au',
      name: 'Dale Rogers',
      role: Role.MANAGER,
      organisationId,
      passwordHash: await bcrypt.hash('Demo123!', 12),
      emailVerified: new Date(),
      phoneNumber: '+61 400 000 000',
      bio: 'Aegrid Developer and System Administrator',
      timezone: 'Australia/Sydney',
      language: 'en-AU',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        emergency_alerts: true,
        strategic_reports: true,
        margin_alerts: true,
        operational_reports: true,
        risk_alerts: true,
      },
    },
  });
  users.push(daleRogers);

  console.log(`  ✅ Created ${users.length} user personas across all roles (including Dale Rogers)`);
  return users;
}
