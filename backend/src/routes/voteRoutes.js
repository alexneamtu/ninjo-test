const express = require('express');
const voteController = require('../controllers/voteController');

const router = express.Router();

// Vote CRUD routes
router.get('/', voteController.getAllVotes);
router.get('/:id', voteController.getVoteById);
router.post('/', voteController.createVote);
router.delete('/:id', voteController.deleteVote);

module.exports = router;