const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    getUserPayments,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createPayment);  
router.get('/', protect, authorize('admin'), getAllPayments);  
router.get('/history', protect, getUserPayments);  
router.get('/:id', protect, getPaymentById);  
router.put('/:id/status', protect, authorize('admin'), updatePaymentStatus);  

module.exports = router;
