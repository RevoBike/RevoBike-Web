const express = require('express');
const { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser,
    addAdmin // Importing the new function
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/middleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// New route for adding admin
router.post('/admin', protect, authorize('superAdmin'), addAdmin);

module.exports = router;
