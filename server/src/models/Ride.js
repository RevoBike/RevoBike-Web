const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    bike: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bike', 
        required: true 
    },
    startTime: { 
        type: Date, 
        default: Date.now 
    },
    endTime: { 
        type: Date 
    },
    startLocation: { 
        type: { type: String, default: 'Point' }, 
        coordinates: { type: [Number], default: [0, 0] }
    }, 
    endLocation: { 
        type: { type: String, default: 'Point' }, 
        coordinates: { type: [Number], default: [0, 0] }
    },
    distance: { 
        type: Number, 
        default: 0 
    }, 
    cost: { 
        type: Number, 
        default: 0 
    }, 
    status: { 
        type: String, 
        enum: ['active', 'completed'], 
        default: 'active' 
    },
    paymentStatus: { 
        type: String, 
        enum: ["pending", "paid", "failed"], 
        default: "pending" 
    }, 
}, { timestamps: true });


const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;