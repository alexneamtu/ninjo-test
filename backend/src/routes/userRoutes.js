const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// User routes (no POST - use /api/auth/register for user creation)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;