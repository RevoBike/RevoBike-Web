const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    ride: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Ride", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: {
        type: String,
        default: "ETB"
    },
    tx_ref: { // YOUR reference to match against Chapa's verification
        type: String,
        required: true,
        unique: true
    },
    checkout_url: { // For tracking/record/debugging
        type: String
    },
    status: { 
        type: String, 
        enum: ["pending", "successful", "failed"], 
        default: "pending" 
    },
    verifiedAt: {
        type: Date
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
