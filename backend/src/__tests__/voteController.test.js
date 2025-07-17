const request = require('supertest');
const express = require('express');
const voteRoutes = require('../routes/voteRoutes');
const { createTestUser, createTestFeature, createTestVote, cleanupTestData } = require('./helpers');

const app = express();
app.use(express.json());
app.use('/api/votes', voteRoutes);

describe('Vote Controller', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/votes', () => {
    it('should return empty array when no votes exist', async () => {
      const response = await request(app)
        .get('/api/votes')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all votes with feature details', async () => {
      const feature1 = await createTestFeature({ title: 'Feature 1' });
      const feature2 = await createTestFeature({ title: 'Feature 2' });
      await createTestVote(feature1.id);
      await createTestVote(feature2.id);
      const response = await request(app)
        .get('/api/votes')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].feature.title).toBe('Feature 2'); // Newest first
      expect(response.body[1].feature.title).toBe('Feature 1');
      expect(response.body[0].featureId).toBe(feature2.id);
      expect(response.body[1].featureId).toBe(feature1.id);
    });
  });

  describe('GET /api/votes/:id', () => {
    it('should return vote by id', async () => {
      const feature = await createTestFeature();
      const vote = await createTestVote(feature.id);

      const response = await request(app)
        .get(`/api/votes/${vote.id}`)
        .expect(200);

      expect(response.body.id).toBe(vote.id);
      expect(response.body.featureId).toBe(feature.id);
      expect(response.body.feature.title).toBe(feature.title);
    });

    it('should return 404 for non-existent vote', async () => {
      const response = await request(app)
        .get('/api/votes/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Vote not found');
    });
  });

  describe('POST /api/votes', () => {
    it('should create new vote', async () => {
      const user = await createTestUser();
      const feature = await createTestFeature({ createdBy: user.id });

      const response = await request(app)
        .post('/api/votes')
        .send({ featureId: feature.id, createdBy: user.id })
        .expect(201);

      expect(response.body.featureId).toBe(feature.id);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.feature.title).toBe(feature.title);
    });

    it('should return 409 for duplicate vote', async () => {
      const user = await createTestUser();
      const feature = await createTestFeature({ createdBy: user.id });
      await createTestVote(feature.id, user.id);

      const response = await request(app)
        .post('/api/votes')
        .send({ featureId: feature.id, createdBy: user.id })
        .expect(409);

      expect(response.body.error).toBe('Vote already exists for this feature');
    });

    it('should handle missing featureId', async () => {
      const response = await request(app)
        .post('/api/votes')
        .send({})
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/votes/:id', () => {
    it('should delete existing vote', async () => {
      const feature = await createTestFeature();
      const vote = await createTestVote(feature.id);

      await request(app)
        .delete(`/api/votes/${vote.id}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/votes/${vote.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent vote', async () => {
      const response = await request(app)
        .delete('/api/votes/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Vote not found');
    });
  });
});