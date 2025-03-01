const Bike = require('../models/Bike');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all bikes (Admins & SuperAdmins only)
exports.getAllBikes = catchAsync(async (req, res, next) => {
    if (req.user.role === "User") {
        return next(new AppError("Unauthorized access", 403));
    }

    const bikes = await Bike.find();
    res.status(200).json({ success: true, data: bikes });
});

// Get bike by ID (All users can access)
exports.getBikeById = catchAsync(async (req, res, next) => {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
        return next(new AppError("Bike not found", 404));
    }
    res.status(200).json({ success: true, data: bike });
});

// Add new bike (Admins & SuperAdmins only)
exports.addBike = catchAsync(async (req, res, next) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return next(new AppError("Unauthorized", 403));
    }

    const { bikeId, latitude, longitude } = req.body;
    const newBike = await Bike.create({
        bikeId,
        status: "available",
        currentLocation: { type: "Point", coordinates: [longitude, latitude] },
    });

    res.status(201).json({ success: true, data: newBike });
});


// Delete bike (SuperAdmin only)
exports.deleteBike = catchAsync(async (req, res, next) => {
    if (req.user.role !== "SuperAdmin") {
        return next(new AppError("Unauthorized", 403));
    }

    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) {
        return next(new AppError("Bike not found", 404));
    }

    res.status(200).json({ success: true, message: "Bike deleted" });
});
