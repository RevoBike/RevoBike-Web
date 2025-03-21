const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema(
    {
        bikeId: {
            type: String,
            required: true,
            unique: true,
        },
        qrCode: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ['available', 'in-use', 'underMaintenance','reserved'],
            default: 'available',
        },
        currentLocation: {
            type: { 
                type: String, 
                enum: ['Point'], 
                default: 'Point' 
            },
            coordinates: { 
                type: [Number], 
                required: true,
                default: [0, 0],
            }, 
        },
        currentStation: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Station",
            default: null, // If not at a station 
        },
        geofenceStatus: {
            type: String,
            enum: ["inside", "outside"],
            default: "inside",
        },
    },
    { timestamps: true }
);


const Bike = mongoose.model('Bike', BikeSchema);
module.exports = Bike;
