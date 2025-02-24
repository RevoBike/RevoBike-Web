const jwtUtils = require('../utils/JWTUtils');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized, no token provided', 401));
    }

    const decoded = jwtUtils.verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('User no longer exists', 401));
    }

    req.user = user;
    next();
});



exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Not authorized to access this resource', 403));
        }
        next();
    };
};
