const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  console.log('Available models:', Object.keys(prisma).filter(key => !key.startsWith('$')));
  await prisma.$disconnect();
}

test().catch(console.error);
