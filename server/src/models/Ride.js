const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    bike: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Bike", 
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
        type: { lat: Number, lon: Number }, 
        required: true 
    },
    endLocation: { 
        type: { lat: Number, lon: Number },
        required: true 
    },
    distance: { 
        type: Number, 
        default: 0 
    }, 
    ride_cost: { 
        type: Number, 
        default: 0 
    },  
}, { timestamps: true });

const Ride = mongoose.model("Ride", RideSchema);

module.exports = Ride;