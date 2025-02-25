const express = require('express');
const {
    getAllBikes,
    getBikeById,
    addBike,
    deleteBike,
    updateBikeLocation,
} = require('../controllers/bikeController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllBikes);
router.get('/:id', getBikeById);
router.post('/', protect, authorize('admin'), addBike);
router.delete('/:id', protect, authorize('admin'), deleteBike);
router.post('/location/update', protect, updateBikeLocation);

module.exports = router;
