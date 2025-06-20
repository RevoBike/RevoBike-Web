const Ride = require('../models/Ride');
const Bike = require('../models/Bike');
const Station = require('../models/Station');
const catchAsync = require('../utils/catchAsync');
const { calculateDistance, calculateRideCost } = require('../utils/rideUtils');

 
// Start Ride
exports.startRide = catchAsync(async (req, res) => {
    if (req.user.role !== "User") {
        return res.status(403).json({ success: false, message: "Only users can start a ride" });
    }

    const unpaidRide = await Ride.findOne({ user: req.user._id, paymentStatus: "pending" });

    if (unpaidRide) {
        return res.status(400).json({ 
            success: false, 
            message: "You have an unpaid ride. Please complete the payment first." });
    }


  
    const { bikeId } = req.params; // Get bikeId from path parameters
    const bike = await Bike.findOne({ bikeId });

    if (!bike || bike.status !== "available") {
        return res.status(400).json({ success: false, message: "Bike not available" });
    }

    // Ensure user is verified before starting a ride
    if (!req.user.isVerified) {
        return res.status(403).json({ success: false, message: "User not verified. Please visit a station." });
    }

    const station = await Station.findOne({ available_bikes: bike._id });
    if (station) {
        station.available_bikes = station.available_bikes.filter(id => id.toString() !== bike._id.toString());
        await station.save();
    }

    // Create ride entry
    const ride = await Ride.create({
        user: req.user._id,
        bike: bike._id,
        startLocation: bike.currentLocation,
        status: "active",
    });


    bike.status = "in-use";
    bike.currentStation = null; 
    await bike.save();

    // Emit real-time event
    const io = req.app.get("io");
    io.emit("rideStarted", { bikeId: bike._id, status: "in-use" });

    res.status(201).json({ success: true, data: ride });
});

// End Ride
exports.endRide = catchAsync(async (req, res) => {
    if (req.user.role !== "User") {
        return res.status(403).json({ success: false, message: "Only users can end a ride" });
    }

    const { rideId } = req.params;
    const ride = await Ride.findById(rideId).populate("bike");

    if (!ride || ride.status !== "active") {
        return res.status(400).json({ success: false, message: "Ride not found or already ended" });
    }

    const endLocation = ride.bike.currentLocation;
    const distance = calculateDistance(ride.startLocation.coordinates, endLocation.coordinates);
    const cost = calculateRideCost(distance);


    ride.endTime = Date.now();
    ride.endLocation = endLocation;
    ride.distance = distance;
    ride.cost = cost;
    ride.status = "completed";
    ride.paymentStatus = "pending";
    await ride.save();

    // Mark bike as available
    ride.bike.status = "available";

    // Assign the bike to the nearest station
    const nearestStation = await Station.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: endLocation.coordinates },
                distanceField: "distance",
                spherical: true
            }
        }
    ]).limit(1); 

    if (nearestStation.length > 0) {
        const station = await Station.findById(nearestStation[0]._id);
        if (station) {
            station.available_bikes.push(ride.bike._id);
            await station.save();
            ride.bike.currentStation = station._id;
            await ride.bike.save();
        }
    }

    // Emit real-time event
    const io = req.app.get("io");
    io.emit("rideEnded", { bikeId: ride.bike._id, status: "available", station: ride.bike.currentStation });

    res.status(200).json({ success: true, data: ride });
});


// Get all rides (Admins & SuperAdmins)
exports.getAllRides = catchAsync(async (req, res) => {
    if (req.user.role === "User") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized access" 
        });
    }

    const rides = await Ride.find().populate("user bike");
    res.status(200).json({ 
        success: true, 
        data: rides 
    });
});


// Get user's ride history 
exports.getUserRides = catchAsync(async (req, res) => {
    const rides = await Ride.find({ user: req.user.id }).populate('bike');
    res.status(200).json({ 
        success: true, 
        data: rides 
    });
});
