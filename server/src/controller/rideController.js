const Ride = require('../models/Ride');
const Bike = require('../models/Bike');
const catchAsync = require('../utils/catchAsync'); 
const AppError = require('../utils/AppError');
const { calculateDistance, calculateRideCost } = require('../utils/rideUtils');


//Start ride
exports.startRide = catchAsync(async (req, res, next) => {
    const { bikeId } = req.params;
    const userId = req.user.id;

    const bike = await Bike.findById(bikeId);
    if (!bike || !bike.isAvailable) {
        return next(new AppError('Bike not available', 400));
    }

    const startLocation = bike.currentLocation;

    const ride = await Ride.create({
        user: userId,
        bike: bikeId,
        startLocation: startLocation,
        status: 'active'
    });

    bike.isAvailable = false;
    await bike.save();

    res.status(201).json({ success: true, data: ride });
});


//End ride
exports.endRide = catchAsync(async (req, res, next) => {
    const { rideId } = req.params;

    // Find the ride
    const ride = await Ride.findById(rideId).populate('bike');
    if (!ride || ride.status !== 'active') {
        return next(new AppError('Ride not found or already ended', 400));
    }

    const endLocation = ride.bike.currentLocation;

    const distance = calculateDistance(
        ride.startLocation.coordinates, 
        endLocation.coordinates
    );

    const cost = calculateRideCost(distance);

    ride.endTime = Date.now();
    ride.endLocation = endLocation;
    ride.distance = distance;
    ride.cost = cost;
    ride.status = 'completed';
    await ride.save();

    ride.bike.isAvailable = true;
    await ride.bike.save();

    res.status(200).json({ success: true, data: ride });
});


exports.getUserRides = catchAsync(async (req, res, next) => {
    const rides = await Ride.find({ user: req.user.id }).populate('bike');
    res.status(200).json({ success: true, data: rides });
});



exports.getAllRides = catchAsync(async (req, res, next) => {
    const rides = await Ride.find().populate('user bike');
    res.status(200).json({ success: true, data: rides });
});
