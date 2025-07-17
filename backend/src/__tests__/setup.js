const { execSync } = require('child_process');

// Mock console.log to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

let prisma;

// Setup test database
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Reset database before running tests
  try {
    execSync('npx prisma db push --force-reset --accept-data-loss', { stdio: 'pipe' });
  } catch (error) {
    console.error('Failed to reset database:', error);
  }

  // Initialize prisma connection
  prisma = require('../config/database');
});

afterAll(async () => {
  // Clean up any remaining connections
  if (prisma) {
    await prisma.$disconnect();
  }
});

// Clean up connections after each test file
afterEach(async () => {
  // Force close any lingering connections
  if (prisma) {
    await prisma.$disconnect();
  }
});