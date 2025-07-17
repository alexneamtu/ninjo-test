const express = require('express');
const featureController = require('../controllers/featureController');

const router = express.Router();

// Feature CRUD routes
router.get('/', featureController.getAllFeatures);
router.get('/:id', featureController.getFeatureById);
router.post('/', featureController.createFeature);
router.put('/:id', featureController.updateFeature);
router.delete('/:id', featureController.deleteFeature);

// Toggle vote for feature
router.post('/:id/toggle-vote', featureController.toggleVote);

module.exports = router;