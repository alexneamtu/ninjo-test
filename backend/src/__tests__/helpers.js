const prisma = require('../config/database');

// Helper function to create test feature
async function createTestFeature(data = {}) {
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
async function createTestVote(featureId) {
  return await prisma.vote.create({
    data: {
      featureId
    }
  });
}

// Helper function to clean up test data
async function cleanupTestData() {
  try {
    await prisma.vote.deleteMany({});
    await prisma.feature.deleteMany({});
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
  createTestFeature,
  createTestVote,
  cleanupTestData,
  disconnectDatabase
};