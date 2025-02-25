const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema(
    {
        bikeId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ['available', 'in-use'],
            default: 'available',
        },
        currentLocation: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }, 
        },
    },
    { timestamps: true }
);


const Bike = mongoose.model('Bike', BikeSchema);
module.exports = Bike;
