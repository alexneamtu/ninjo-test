const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'test' ? [] : ['query', 'info', 'warn', 'error']
});

// Handle graceful shutdown only in non-test environments
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', async () => {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    process.exit(0);
  });
}

module.exports = prisma;