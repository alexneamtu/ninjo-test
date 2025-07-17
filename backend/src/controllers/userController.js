const prisma = require('../config/database');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { 
              features: true,
              votes: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          features: {
            include: {
              _count: {
                select: { votes: true }
              }
            }
          },
          votes: {
            include: {
              feature: true
            }
          },
          _count: {
            select: { 
              features: true,
              votes: true
            }
          }
        }
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  // Update user
  async updateUser(req, res) {
    try {
      const { email, name } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          email,
          name
        },
        include: {
          _count: {
            select: { 
              features: true,
              votes: true
            }
          }
        }
      });
      res.json(user);
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'User not found' });
      } else if (error.code === 'P2002') {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      await prisma.user.delete({
        where: { id: req.params.id }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = userController;