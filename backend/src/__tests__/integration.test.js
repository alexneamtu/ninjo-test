
const request = require('supertest');
const express = require('express');
const featureRoutes = require('../routes/featureRoutes');
const voteRoutes = require('../routes/voteRoutes');
const healthRoutes = require('../routes/healthRoutes');
const { createTestFeature, cleanupTestData } = require('./helpers');

const app = express();
app.use(express.json());
app.use('/api/features', featureRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/health', healthRoutes);

describe('Integration Tests', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.service).toBe('Feature Voting API');
    });
  });

  describe('Full Feature Workflow', () => {
    it('should create feature, vote, and retrieve with correct counts', async () => {
      // Create feature
      const featureData = {
        title: 'Integration Test Feature',
        description: 'Test feature for integration testing'
      };

      const createResponse = await request(app)
        .post('/api/features')
        .send(featureData)
        .expect(201);

      const featureId = createResponse.body.id;

      // Vote on feature
      await request(app)
        .post(`/api/features/${featureId}/toggle-vote`)
        .expect(200);

      // Get feature with vote count
      const getResponse = await request(app)
        .get(`/api/features/${featureId}`)
        .expect(200);

      expect(getResponse.body.title).toBe(featureData.title);
      expect(getResponse.body._count.votes).toBe(1);
      expect(getResponse.body.votes).toHaveLength(1);

      // Get all votes
      const votesResponse = await request(app)
        .get('/api/votes')
        .expect(200);

      expect(votesResponse.body).toHaveLength(1);
      expect(votesResponse.body[0].featureId).toBe(featureId);
      expect(votesResponse.body[0].feature.title).toBe(featureData.title);

      // Toggle vote off
      await request(app)
        .post(`/api/features/${featureId}/toggle-vote`)
        .expect(200);

      // Verify vote was removed
      const finalResponse = await request(app)
        .get(`/api/features/${featureId}`)
        .expect(200);

      expect(finalResponse.body._count.votes).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Try to create feature with invalid data
      const response = await request(app)
        .post('/api/features')
        .send({ title: null })
        .expect(500);

      expect(response.body.error).toBeDefined();
    });

    it('should handle non-existent resource requests', async () => {
      await request(app)
        .get('/api/features/non-existent-id')
        .expect(404);

      await request(app)
        .get('/api/votes/non-existent-id')
        .expect(404);
    });
  });
});