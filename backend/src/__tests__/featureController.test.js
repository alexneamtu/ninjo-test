const request = require('supertest');
const express = require('express');
const featureRoutes = require('../routes/featureRoutes');
const { createTestUser, createTestFeature, createTestVote, cleanupTestData } = require('./helpers');

const app = express();
app.use(express.json());
app.use('/api/features', featureRoutes);

describe('Feature Controller', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('GET /api/features', () => {
    it('should return empty array when no features exist', async () => {
      const response = await request(app)
        .get('/api/features')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all features with vote counts', async () => {
      const feature1 = await createTestFeature({ title: 'Feature 1' });
      await createTestFeature({ title: 'Feature 2' });
      await createTestVote(feature1.id);

      const response = await request(app)
        .get('/api/features')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Feature 2'); // Newest first
      expect(response.body[1].title).toBe('Feature 1');
      expect(response.body[1]._count.votes).toBe(1);
      expect(response.body[0]._count.votes).toBe(0);
    });
  });

  describe('GET /api/features/:id', () => {
    it('should return feature by id', async () => {
      const feature = await createTestFeature();

      const response = await request(app)
        .get(`/api/features/${feature.id}`)
        .expect(200);

      expect(response.body.id).toBe(feature.id);
      expect(response.body.title).toBe(feature.title);
      expect(response.body.description).toBe(feature.description);
    });

    it('should return 404 for non-existent feature', async () => {
      const response = await request(app)
        .get('/api/features/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Feature not found');
    });
  });

  describe('POST /api/features', () => {
    it('should create new feature', async () => {
      const user = await createTestUser();
      const featureData = {
        title: 'New Feature',
        description: 'New Description',
        createdBy: user.id
      };

      const response = await request(app)
        .post('/api/features')
        .send(featureData)
        .expect(201);

      expect(response.body.title).toBe(featureData.title);
      expect(response.body.description).toBe(featureData.description);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body._count.votes).toBe(0);
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/features')
        .send({})
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/features/:id', () => {
    it('should update existing feature', async () => {
      const feature = await createTestFeature();
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/features/${feature.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.id).toBe(feature.id);
    });

    it('should return 404 for non-existent feature', async () => {
      const response = await request(app)
        .put('/api/features/non-existent-id')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Feature not found');
    });
  });

  describe('DELETE /api/features/:id', () => {
    it('should delete existing feature', async () => {
      const feature = await createTestFeature();

      await request(app)
        .delete(`/api/features/${feature.id}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/features/${feature.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent feature', async () => {
      const response = await request(app)
        .delete('/api/features/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Feature not found');
    });
  });

  describe('POST /api/features/:id/toggle-vote', () => {
    it('should add vote when none exists', async () => {
      const user = await createTestUser();
      const feature = await createTestFeature({ createdBy: user.id });

      const response = await request(app)
        .post(`/api/features/${feature.id}/toggle-vote`)
        .send({ createdBy: user.id })
        .expect(200);

      expect(response.body.action).toBe('added');
      expect(response.body.message).toBe('Vote added');
      expect(response.body.vote).toBeDefined();
    });

    it('should remove vote when it exists', async () => {
      const user = await createTestUser();
      const feature = await createTestFeature({ createdBy: user.id });
      await createTestVote(feature.id, user.id);

      const response = await request(app)
        .post(`/api/features/${feature.id}/toggle-vote`)
        .send({ createdBy: user.id })
        .expect(200);

      expect(response.body.action).toBe('removed');
      expect(response.body.message).toBe('Vote removed');
    });
  });
});