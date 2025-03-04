const Station = require('../models/Station');
const catchAsync = require('../utils/catchAsync');

// Get all stations (All users)
exports.getAllStations = catchAsync(async (req, res) => {
    const stations = await Station.find().populate("available_bikes");
    res.status(200).json({ 
        success: true, 
        data: stations 
    });
});

// Get a station by ID (All users)
exports.getStationById = catchAsync(async (req, res) => {
    const station = await Station.findById(req.params.id).populate("available_bikes");
    
    if (!station) {
        return res.status(404).json({ 
            success: false, 
            message: "Station not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        data: station 
    });
});

// Add a new station (Only SuperAdmins)
exports.addStation = catchAsync(async (req, res) => {
    if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const { name, location, totalSlots } = req.body;

    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid location. Must provide coordinates [longitude, latitude]."
        });
    }

    const station = await Station.create({ 
        name, 
        location: { type: "Point", coordinates: location.coordinates }, 
        totalSlots 
    });

    res.status(201).json({ 
        success: true, 
        data: station 
    });
});

// Update Station Location (Only SuperAdmins)
exports.updateStationLocation = catchAsync(async (req, res) => {
    if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const { coordinates } = req.body;
    const { id } = req.params;

    if (!coordinates || coordinates.length !== 2) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid location. Must provide coordinates [longitude, latitude]."
        });
    }

    const station = await Station.findByIdAndUpdate(
        id,
        { location: { type: "Point", coordinates } },
        { new: true, runValidators: true }
    );

    if (!station) {
        return res.status(404).json({ 
            success: false, 
            message: "Station not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        data: station 
    });
});

// Delete station (SuperAdmin only)
exports.deleteStation = catchAsync(async (req, res) => {
    if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const station = await Station.findByIdAndDelete(req.params.id);
    
    if (!station) {
        return res.status(404).json({ 
            success: false, 
            message: "Station not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        message: "Station deleted" 
    });
});
