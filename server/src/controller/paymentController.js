const Payment = require('../models/Payment');
const Ride = require('../models/Ride');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Create Payment (Only Users)
exports.createPayment = catchAsync(async (req, res, next) => {
    if (req.user.role !== "User") {
        return next(new AppError("Only users can make a payment", 403));
    }

    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);

    if (!ride || ride.user.toString() !== req.user._id.toString()) {
        return next(new AppError("Invalid ride or unauthorized", 400));
    }

    const payment = await Payment.create({
        user: req.user._id,
        ride: rideId,
        amount: ride.cost,
        status: "pending",
    });

    res.status(201).json({ success: true, data: payment });
});

// Get all payments (Admins & SuperAdmins)
exports.getAllPayments = catchAsync(async (req, res, next) => {
    if (req.user.role === "User") {
        return next(new AppError("Unauthorized access", 403));
    }

    const payments = await Payment.find().populate("user", "name email").populate("ride");
    res.status(200).json({ success: true, data: payments });
});

// Update payment status (Only Admins & SuperAdmins)
exports.updatePaymentStatus = catchAsync(async (req, res, next) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return next(new AppError("Unauthorized", 403));
    }

    const { status } = req.body;
    if (!["pending", "completed", "failed"].includes(status)) {
        return next(new AppError("Invalid payment status", 400));
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!payment) {
        return next(new AppError("Payment not found", 404));
    }

    res.status(200).json({ success: true, data: payment });
});

//Get a payment data by id
exports.getPaymentById = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate('user', 'name email').populate('ride');
    if (!payment) {
        return next(new AppError('Payment not found', 404));
    }
    res.status(200).json({ success: true, data: payment });
});


//Get user's payment history
exports.getUserPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user._id }).populate('ride');
    res.status(200).json({ success: true, data: payments });
});
