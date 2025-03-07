const Payment = require('../models/Payment');
const Ride = require('../models/Ride');
const catchAsync = require('../utils/catchAsync');

// Create Payment (Only Users)
exports.createPayment = catchAsync(async (req, res) => {
    if (req.user.role !== "User") {
        return res.status(403).json({ 
            success: false, 
            message: "Only users can make a payment" 
        });
    }

    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);

    if (!ride || ride.user.toString() !== req.user._id.toString()) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid ride or unauthorized" 
        });
    }

    const payment = await Payment.create({
        user: req.user._id,
        ride: rideId,
        amount: ride.cost,
        status: "pending",
    });

    res.status(201).json({ 
        success: true, 
        data: payment 
    });
});

// Get all payments (Admins & SuperAdmins)
exports.getAllPayments = catchAsync(async (req, res) => {
    if (req.user.role === "User") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized access" 
        });
    }

    const payments = await Payment.find().populate("user", "name email").populate("ride");
    res.status(200).json({ 
        success: true, 
        data: payments 
    });
});

// Update payment status (Only Admins & SuperAdmins)
exports.updatePaymentStatus = catchAsync(async (req, res) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const { status } = req.body;
    if (!["pending", "completed", "failed"].includes(status)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid payment status" 
        });
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!payment) {
        return res.status(404).json({ 
            success: false, 
            message: "Payment not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        data: payment 
    });
});

// Get a payment by ID
exports.getPaymentById = catchAsync(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate('user', 'name email').populate('ride');
    if (!payment) {
        return res.status(404).json({ 
            success: false, 
            message: "Payment not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        data: payment 
    });
});

// Get user's payment history
exports.getUserPayments = catchAsync(async (req, res) => {
    const payments = await Payment.find({ user: req.user._id }).populate('ride');

    res.status(200).json({ 
        success: true, 
        data: payments 
    });
});
