const express = require('express');
const { 
    startRide, 
    endRide, 
    getUserRides, 
    getAllRides 
} = require('../controllers/rideController');

const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/start/:bikeId', protect, startRide); 
router.post('/end/:rideId', protect, endRide); 
router.get('/history', protect, getUserRides);
router.get('/', protect, admin, getAllRides); 

module.exports = router;
