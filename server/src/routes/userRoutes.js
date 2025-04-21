const express = require('express');
const { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser,
    createAdmin, 
    verifyUser
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/middleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

// to verify user (Only Admins & SuperAdmins can do this)
router.put("/verify/:userId", protect, authorizeRoles("Admin", "SuperAdmin"), verifyUser);

//for adding admin
router.post("/admin", protect, authorizeRoles("SuperAdmin"), createAdmin);

module.exports = router;
