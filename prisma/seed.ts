import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const organisation = await prisma.organisation.upsert({
    where: { name: 'Sample Council' },
    update: {},
    create: { name: 'Sample Council' }
  });

  const passwordHash = await bcrypt.hash('ChangeMe_123!', 12);

  // Create users with different roles
  const users = [
    {
      email: 'admin@sample.council',
      name: 'Admin User',
      role: Role.ADMIN,
    },
    {
      email: 'manager@sample.council',
      name: 'Manager User',
      role: Role.MANAGER,
    },
    {
      email: 'supervisor@sample.council',
      name: 'Supervisor User',
      role: Role.SUPERVISOR,
    },
    {
      email: 'crew@sample.council',
      name: 'Crew Member',
      role: Role.CREW,
    },
    {
      email: 'exec@sample.council',
      name: 'Executive User',
      role: Role.EXEC,
    },
    {
      email: 'contractor@sample.council',
      name: 'Contractor User',
      role: Role.CONTRACTOR,
    },
    {
      email: 'partner@sample.council',
      name: 'Partner User',
      role: Role.PARTNER,
    },
    {
      email: 'citizen@sample.council',
      name: 'Citizen User',
      role: Role.CITIZEN,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        passwordHash,
        organisationId: organisation.id,
        isActive: true,
      }
    });
  }

  console.log('Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
