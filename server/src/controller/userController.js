const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all users (Admin Only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }
    const users = await User.find({ role: 'user' });
    res.status(200).json({ success: true, data: users });
});

// Get user by ID
exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, data: user });
});

// Update user profile (Only user themselves)
exports.updateUser = catchAsync(async (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    });

    if (!updatedUser) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, data: updatedUser });
});

// Delete user (Admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('Not authorized', 403));
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ success: true, message: 'User deleted' });
});
