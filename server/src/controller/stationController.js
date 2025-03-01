const Station = require('../models/Station');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all stations (All users)
exports.getAllStations = catchAsync(async (req, res, next) => {
    const stations = await Station.find().populate("available_bikes");
    res.status(200).json({ success: true, data: stations });
});

// Add a new station (Only Admins & SuperAdmins)
exports.addStation = catchAsync(async (req, res, next) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return next(new AppError("Unauthorized", 403));
    }

    const { name, location, totalSlots } = req.body;
    const station = await Station.create({ name, location, totalSlots });

    res.status(201).json({ success: true, data: station });
});


// Delete station (SuperAdmin only)
exports.deleteStation = catchAsync(async (req, res, next) => {
    if (req.user.role !== "SuperAdmin") {
        return next(new AppError("Unauthorized", 403));
    }

    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) {
        return next(new AppError("Station not found", 404));
    }

    res.status(200).json({ success: true, message: "Station deleted" });
});
