const prisma = require('../config/database');

const voteController = {
  // Get all votes
  async getAllVotes(req, res) {
    try {
      const votes = await prisma.vote.findMany({
        include: {
          feature: true,
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get vote by ID
  async getVoteById(req, res) {
    try {
      const vote = await prisma.vote.findUnique({
        where: { id: req.params.id },
        include: {
          feature: true,
          user: true
        }
      });
      if (!vote) {
        return res.status(404).json({ error: 'Vote not found' });
      }
      res.json(vote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new vote
  async createVote(req, res) {
    try {
      const { featureId, createdBy } = req.body;
      const vote = await prisma.vote.create({
        data: {
          featureId,
          createdBy
        },
        include: {
          feature: true,
          user: true
        }
      });
      res.status(201).json(vote);
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(409).json({ error: 'Vote already exists for this feature' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete vote
  async deleteVote(req, res) {
    try {
      await prisma.vote.delete({
        where: { id: req.params.id }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Vote not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = voteController;