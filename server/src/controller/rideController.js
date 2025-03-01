const Ride = require('../models/Ride');
const Bike = require('../models/Bike');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { calculateDistance, calculateRideCost } = require('../utils/rideUtils');

// Start Ride (Only Users)
exports.startRide = catchAsync(async (req, res, next) => {
    if (req.user.role !== "User") {
        return next(new AppError("Only users can start a ride", 403));
    }

    const { bikeId } = req.params;
    const bike = await Bike.findById(bikeId);

    if (!bike || !bike.isAvailable) {
        return next(new AppError("Bike not available", 400));
    }

    const ride = await Ride.create({
        user: req.user._id,
        bike: bikeId,
        startLocation: bike.currentLocation,
        status: "active",
    });

    bike.isAvailable = false;
    await bike.save();

    res.status(201).json({ success: true, data: ride });
});

// End Ride (Only Users)
exports.endRide = catchAsync(async (req, res, next) => {
    if (req.user.role !== "User") {
        return next(new AppError("Only users can end a ride", 403));
    }

    const { rideId } = req.params;
    const ride = await Ride.findById(rideId).populate("bike");

    if (!ride || ride.status !== "active") {
        return next(new AppError("Ride not found or already ended", 400));
    }

    const endLocation = ride.bike.currentLocation;
    const distance = calculateDistance(ride.startLocation.coordinates, endLocation.coordinates);
    const cost = calculateRideCost(distance);

    ride.endTime = Date.now();
    ride.endLocation = endLocation;
    ride.distance = distance;
    ride.cost = cost;
    ride.status = "completed";
    await ride.save();

    ride.bike.isAvailable = true;
    await ride.bike.save();

    res.status(200).json({ success: true, data: ride });
});

// Get all rides (Admins & SuperAdmins)
exports.getAllRides = catchAsync(async (req, res, next) => {
    if (req.user.role === "User") {
        return next(new AppError("Unauthorized access", 403));
    }

    const rides = await Ride.find().populate("user bike");
    res.status(200).json({ success: true, data: rides });
});

//Get user's ride history 
exports.getUserRides = catchAsync(async (req, res, next) => {
    const rides = await Ride.find({ user: req.user.id }).populate('bike');
    res.status(200).json({ success: true, data: rides });
});
