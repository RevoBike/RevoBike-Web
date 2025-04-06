const Payment = require("../models/Payment");
const Ride = require("../models/Ride");
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const { getMpesaToken } = require("../utils/mpesaService");
require("dotenv").config();

// Request STK Push for M-Pesa Payment
exports.requestPayment = catchAsync(async (req, res) => {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).populate("user");
    if (!ride || ride.paymentStatus !== "pending") {
        return res.status(400).json({ success: false, message: "Invalid ride or payment not required" });
    }

    const payment = await Payment.create({
        user: ride.user._id,
        ride: ride._id,
        amount: ride.cost,
        phoneNumber: ride.user.phoneNumber,
        status: "pending",
    });

    // Get M-Pesa Token
    const accessToken = await getMpesaToken();

    // STK Push Request
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkRequest = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: ride.cost,
        PartyA: ride.user.phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: ride.user.phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `Ride-${ride._id}`,
        TransactionDesc: "Bike Ride Payment",
    };

    const { data: stkResponse } = await axios.post(
        `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        stkRequest,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (stkResponse.ResponseCode === "0") {
        payment.transactionId = stkResponse.CheckoutRequestID;
        await payment.save();
        return res.status(200).json({ success: true, message: "Payment request sent", data: payment });
    } else {
        return res.status(500).json({ success: false, message: "Payment request failed" });
    }
});

// Handle M-Pesa Payment Callback
exports.paymentCallback = catchAsync(async (req, res) => {
    const { Body } = req.body;
    const { CheckoutRequestID, ResultCode } = Body.stkCallback;

    const payment = await Payment.findOne({ transactionId: CheckoutRequestID });
    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (ResultCode === 0) {
        payment.status = "successful";
        await payment.save();

        // Mark ride as paid
        const ride = await Ride.findById(payment.ride);
        if (ride) {
            ride.paymentStatus = "paid";
            await ride.save();
        }
    } else {
        payment.status = "failed";
        await payment.save();
    }

    res.status(200).json({ success: true, message: "Payment status updated" });
});


exports.getPaymentById = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate("user ride");
    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({ success: true, data: payment });
});

exports.getAllPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find().populate("user ride").sort({ createdAt: -1 });

    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin" && payment.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    res.status(200).json({ success: true, data: payments });
});
