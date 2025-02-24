const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    ride: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Ride" 
    },
    amount: { 
        type: Number,  
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "failed"], 
        default: "pending" 
    },
}, { timestamps: true });

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;