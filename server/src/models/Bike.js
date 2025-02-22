const mongoose = require("mongoose");

const BikeSchema = new mongoose.Schema({
    bikeId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    status: { 
        type: String, 
        enum: ["available", "in-use"], 
        default: "available" 
    },
    location: { 
        type: { lat: Number, lon: Number }, 
        required: true 
    },
}, { timestamps: true });

const Bike = mongoose.model("Bike", BikeSchema);

module.exports = Bike;
