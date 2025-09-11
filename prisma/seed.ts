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

  await prisma.user.upsert({
    where: { email: 'admin@sample.council' },
    update: {},
    create: {
      email: 'admin@sample.council',
      name: 'Admin',
      passwordHash,
      role: Role.ADMIN,
      organisationId: organisation.id
    }
  });
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
