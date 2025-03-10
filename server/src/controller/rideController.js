const Ride = require('../models/Ride');
const Bike = require('../models/Bike');
const Station = require('../models/Station');
const catchAsync = require('../utils/catchAsync');
const { calculateDistance, calculateRideCost } = require('../utils/rideUtils');

// Start Ride (Only Users)
exports.startRide = catchAsync(async (req, res) => {
    if (req.user.role !== "User") {
        return res.status(403).json({ 
            success: false, 
            message: "Only users can start a ride" 
        });
    }

    const { bikeId } = req.params;
    const bike = await Bike.findById(bikeId);

    if (!bike || bike.status !== "available") {
        return res.status(400).json({ 
            success: false, 
            message: "Bike not available" 
        });
    }

    const station = await Station.findOne({ available_bikes: bikeId });

    if (station) {
        // Remove the bike from the station
        station.available_bikes = station.available_bikes.filter(id => id.toString() !== bikeId);
        await station.save();
    }

    // Create the ride
    const ride = await Ride.create({
        user: req.user._id,
        bike: bikeId,
        startLocation: bike.currentLocation,
        status: "active",
    });

   
    bike.status = "in-use";
    bike.currentStation = null; 
    await bike.save();

    res.status(201).json({ 
        success: true, 
        data: ride 
    });
});

// End Ride (Only Users)
exports.endRide = catchAsync(async (req, res) => {
    if (req.user.role !== "User") {
        return res.status(403).json({ 
            success: false, 
            message: "Only users can end a ride" 
        });
    }

    const { rideId } = req.params;
    const ride = await Ride.findById(rideId).populate("bike");

    if (!ride || ride.status !== "active") {
        return res.status(400).json({ 
            success: false, 
            message: "Ride not found or already ended" 
        });
    }

    const endLocation = ride.bike.currentLocation;
    const distance = calculateDistance(ride.startLocation.coordinates, endLocation.coordinates);
    const cost = calculateRideCost(distance);

    // Update ride details
    ride.endTime = Date.now();
    ride.endLocation = endLocation;
    ride.distance = distance;
    ride.cost = cost;
    ride.status = "completed";
    await ride.save();

    // Mark bike as available
    ride.bike.status = "available";

    const nearestStation = await Station.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: endLocation.coordinates
                },
                distanceField: "distance",
                spherical: true
            }
        }
    ]).limit(1); // Get only the nearest station
    
    if (nearestStation.length > 0) {
        const station = await Station.findById(nearestStation[0]._id); // Get the actual station
    
        if (station) {
            // Add the bike back to the station
            station.available_bikes.push(ride.bike._id);
            await station.save();
    
            // Update the bike's station
            ride.bike.currentStation = station._id;
            await ride.bike.save();
        }
    }
    

   res.status(200).json({ 
        success: true, 
        data: ride 
    });
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
