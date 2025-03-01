const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Existing functions...

// Add new admin user (SuperAdmin only)
exports.addAdmin = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError('Missing required fields', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already in use', 400));
    }

    if (!name || !email || !password || role !== 'admin') {
        return next(new AppError('Missing required fields or invalid role', 400));
    }

    const newAdmin = await User.create({
        name,
        email,
        password,
        role: 'admin', // Role is set to 'admin' by default
    });

    res.status(201).json({ success: true, data: newAdmin });
});
