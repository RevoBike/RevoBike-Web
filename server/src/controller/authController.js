const User = require('../models/User');
const {signToken} = require('../utils/JWTUtils');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.registerUser = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Ensure the user is created with a hashed password

    const newUser = await User.create({
        name,
        email,
        password,  
        role,
    });

    const token = signToken(newUser._id, newUser.role);
    // Send the token in the response
    res.status(201).json({ success: true, token });
});

// Login user
exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Invalid credentials', 401));
    }

    const token = signToken(user._id, user.role);
    // Send the token in the response
    res.status(200).json({ success: true, token });
});
