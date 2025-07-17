const prisma = require('../config/database');

const featureController = {
  // Get all features
  async getAllFeatures(req, res) {
    try {
      const features = await prisma.feature.findMany({
        include: {
          votes: true,
          _count: {
            select: { votes: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get feature by ID
  async getFeatureById(req, res) {
    try {
      const feature = await prisma.feature.findUnique({
        where: { id: req.params.id },
        include: {
          votes: true,
          _count: {
            select: { votes: true }
          }
        }
      });
      if (!feature) {
        return res.status(404).json({ error: 'Feature not found' });
      }
      res.json(feature);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new feature
  async createFeature(req, res) {
    try {
      const { title, description } = req.body;
      const feature = await prisma.feature.create({
        data: {
          title,
          description
        },
        include: {
          votes: true,
          _count: {
            select: { votes: true }
          }
        }
      });
      res.status(201).json(feature);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update feature
  async updateFeature(req, res) {
    try {
      const { title, description } = req.body;
      const feature = await prisma.feature.update({
        where: { id: req.params.id },
        data: {
          title,
          description
        },
        include: {
          votes: true,
          _count: {
            select: { votes: true }
          }
        }
      });
      res.json(feature);
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Feature not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete feature
  async deleteFeature(req, res) {
    try {
      await prisma.feature.delete({
        where: { id: req.params.id }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Feature not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Toggle vote for feature
  async toggleVote(req, res) {
    try {
      const featureId = req.params.id;
      
      // Check if vote exists
      const existingVote = await prisma.vote.findUnique({
        where: { featureId }
      });
      
      if (existingVote) {
        // Remove vote
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });
        res.json({ action: 'removed', message: 'Vote removed' });
      } else {
        // Add vote
        const vote = await prisma.vote.create({
          data: { featureId },
          include: { feature: true }
        });
        res.json({ action: 'added', message: 'Vote added', vote });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = featureController;