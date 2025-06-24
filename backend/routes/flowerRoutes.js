const express = require('express');
const router = express.Router();
const flowerController = require('../controllers/flowerController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Public routes
router.get('/seasons', flowerController.getAllSeasonalFlowers); // For homepage seasonal display
router.get('/season/:season', flowerController.getFlowersBySeason); // For seasonal category pages

// Admin routes
router.post('/', authenticateToken, isAdmin, flowerController.createFlower);
router.put('/:id', authenticateToken, isAdmin, flowerController.updateFlower);
router.delete('/:id', authenticateToken, isAdmin, flowerController.deleteFlower);

module.exports = router;