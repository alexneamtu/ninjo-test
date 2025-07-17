const prisma = require('../config/database');

// Helper function to create test user
async function createTestUser(data = {}) {
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  
  const defaultData = {
    email: `test${Date.now()}@example.com`,
    name: 'Test User',
    password: hashedPassword,
    ...data
  };
  
  return await prisma.user.create({
    data: defaultData
  });
}

// Helper function to create test feature
async function createTestFeature(data = {}) {
  // Create user if not provided
  if (!data.createdBy) {
    const user = await createTestUser();
    data.createdBy = user.id;
  }
  
  const defaultData = {
    title: 'Test Feature',
    description: 'Test Description',
    ...data
  };
  
  return await prisma.feature.create({
    data: defaultData
  });
}

// Helper function to create test vote
async function createTestVote(featureId, createdBy) {
  // Create user if not provided
  if (!createdBy) {
    const user = await createTestUser();
    createdBy = user.id;
  }
  
  return await prisma.vote.create({
    data: {
      featureId,
      createdBy
    }
  });
}

// Helper function to clean up test data
async function cleanupTestData() {
  try {
    await prisma.vote.deleteMany({});
    await prisma.feature.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    // Ignore cleanup errors during tests
    console.error('Cleanup error:', error.message);
  }
}

// Helper function to safely disconnect from database
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    // Ignore disconnect errors
    console.error('Disconnect error:', error.message);
  }
}

module.exports = {
  createTestUser,
  createTestFeature,
  createTestVote,
  cleanupTestData,
  disconnectDatabase
};