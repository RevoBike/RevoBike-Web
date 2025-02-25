const Payment = require('../models/Payment');
const Ride = require('../models/Ride');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');


exports.createPayment = catchAsync(async (req, res, next) => {
    const { rideId } = req.body;

    if (!rideId) {
        return next(new AppError('Ride ID is required', 400));
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        return next(new AppError('Ride not found', 404));
    }

    if (!ride.cost) {
        return next(new AppError('Ride cost is missing', 400));
    }

    const payment = await Payment.create({
        user: req.user._id,
        ride: rideId,
        amount: ride.cost,
        status: 'pending',
    });

    res.status(201).json({
        success: true,
        data: payment,
    });
});


exports.getAllPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find().populate('user', 'name email').populate('ride');
    res.status(200).json({ success: true, data: payments });
});


exports.getPaymentById = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate('user', 'name email').populate('ride');
    if (!payment) {
        return next(new AppError('Payment not found', 404));
    }
    res.status(200).json({ success: true, data: payment });
});


exports.updatePaymentStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    if (!['pending', 'completed', 'failed'].includes(status)) {
        return next(new AppError('Invalid payment status', 400));
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

    if (!payment) {
        return next(new AppError('Payment not found', 404));
    }

    res.status(200).json({
        success: true,
        data: payment,
    });
});


exports.getUserPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user._id }).populate('ride');
    res.status(200).json({ success: true, data: payments });
});
