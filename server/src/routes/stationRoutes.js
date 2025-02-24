const express = require('express');
const router = express.Router();
const {
    getAllStations,
    getStationById,
    addStation,
    updateStation,
    deleteStation
} = require('../controllers/stationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllStations);
router.get('/:id', getStationById);
router.post('/', protect, authorize('admin'), addStation);
router.put('/:id', protect, authorize('admin'), updateStation);
router.delete('/:id', protect, authorize('admin'), deleteStation);

module.exports = router;
