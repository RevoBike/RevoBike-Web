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

// Add a new station (Only Admins & SuperAdmins)
exports.addStation = catchAsync(async (req, res) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const { name, location, totalSlots } = req.body;
    const station = await Station.create({ 
        name, 
        location, 
        totalSlots 
    });

    res.status(201).json({ 
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
