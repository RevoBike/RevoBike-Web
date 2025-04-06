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
    phoneNumber: { 
        type: String, 
        required: true 
    },
    transactionId: { 
        type: String, 
        unique: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "successful", "failed"], 
        default: "pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});


const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;