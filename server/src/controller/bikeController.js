const Bike = require('../models/Bike');
const catchAsync = require('../utils/catchAsync');

// Get all bikes (Admins & SuperAdmins only)
exports.getAllBikes = catchAsync(async (req, res) => {
    if (req.user.role === "User") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized access" 
        });
    }

    const bikes = await Bike.find();
    res.status(200).json({ 
        success: true, 
        data: bikes 
    });
});

// Get bike by ID (All users can access)
exports.getBikeById = catchAsync(async (req, res) => {
    const bike = await Bike.findById(req.params.id);
    
    if (!bike) {
        return res.status(404).json({ 
            success: false, 
            message: "Bike not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        data: bike 
    });
});

// Add new bike (Admins & SuperAdmins only)
exports.addBike = catchAsync(async (req, res) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const { bikeId, latitude, longitude } = req.body;

    const newBike = await Bike.create({
        bikeId,
        status: "available",
        currentLocation: { type: "Point", coordinates: [longitude, latitude] },
    });

    res.status(201).json({ 
        success: true, 
        data: newBike 
    });
});

// Update bike (Admins & SuperAdmins only)
exports.updateBike = catchAsync(async (req, res) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const { status, latitude, longitude } = req.body;

    const updatedBike = await Bike.findByIdAndUpdate(
        req.params.id,
        { 
            ...(status && { status }),
            ...(latitude !== undefined && longitude !== undefined && { 
                currentLocation: { type: "Point", coordinates: [longitude, latitude] }
            }),
        },
        { new: true, runValidators: true }
    );

    if (!updatedBike) {
        return res.status(404).json({ 
            success: false, 
            message: "Bike not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        data: updatedBike 
    });
});

// Delete bike (SuperAdmin only)
exports.deleteBike = catchAsync(async (req, res) => {
    if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) {
        return res.status(404).json({ 
            success: false, 
            message: "Bike not found" 
        });
    }

    res.status(200).json({ 
        success: true, 
        message: "Bike deleted successfully" 
    });
});
