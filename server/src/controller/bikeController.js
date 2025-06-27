const Bike = require("../models/Bike");
const Alert = require("../models/Alert");
const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");
const { isBikeInsideGeofence } = require("../utils/rideUtils");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

// Get all bikes (Admins & SuperAdmins only)
exports.getAllBikes = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const bikeFilter = req.query.bikeFilter;
  const filter = req.query.filter;
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  let matchQuery = {};
  if (search) {
    matchQuery.$or = [
      { model: { $regex: search, $options: "i" } },
      { bikeId: { $regex: search, $options: "i" } },
    ];
  }
  if (
    filter &&
    ["available", "in-use", "underMaintenance", "reserved"].includes(filter)
  ) {
    matchQuery.status = filter;
  }
  if (bikeFilter && mongoose.isValidObjectId(bikeFilter)) {
    matchQuery.currentStation = new mongoose.Types.ObjectId(bikeFilter);
  }

  const bikes = await Bike.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: Station.collection.collectionName,
        localField: "currentStation",
        foreignField: "_id",
        as: "stationDetails",
      },
    },
    {
      $unwind: {
        path: "$stationDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        bikeId: 1,
        model: 1,
        qrCode: 1,
        status: 1,
        currentLocation: 1,
        geofenceStatus: 1,
        batteryLevel: 1,
        batteryHealth: 1,
        geofenceStatus: 1,
        lastCharged: 1,
        lastMaintenance: 1,
        nextMaintenance: 1,
        maintenanceHistory: 1,
        currentStation: { $ifNull: ["$stationDetails.name", "No Station"] },
        createdAt: 1,
        totalRides: 1,
        totalDistance: 1,
        lastRide: 1,
        averageSpeed: 1,
        imageUrl: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  res.status(200).json({
    success: true,
    data: bikes,
  });
});

// Get bike by ID (All users can access)
exports.getBikeById = catchAsync(async (req, res) => {
  const bike = await Bike.findById(req.params.id);

  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  const station = await Station.findById(bike.currentStation);
  const bikeData = bike.toObject();

  res.status(200).json({
    success: true,
    data: { ...bikeData, currentStation: station?.name || "No Station" },
  });
});

// Add new bike (Admins & SuperAdmins only)
exports.addBike = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { model, station, bikeId } = req.body;

  const existingBike = await Bike.findOne({ bikeId });
  if (existingBike) {
    return res.status(400).json({
      success: false,
      message: "Bike ID already exists",
    });
  }

  const qrCode = uuidv4();

  const currentStation = await Station.findById(station);
  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  const newBike = await Bike.create({
    model,
    bikeId,
    currentStation: station,
    qrCode,
    currentLocation: {
      type: "Point",
      coordinates: currentStation.location.coordinates, // Default current station location
    },
  });

  await Station.updateOne(
    { _id: station },
    { $push: { available_bikes: newBike._id } }
  );

  res.status(201).json({
    success: true,
    data: newBike,
  });
});

exports.updateBikeLocation = catchAsync(async (req, res) => {
  // const { qrCode, longitude, latitude } = req.body;
  // const bike = await Bike.findOne({ qrCode });
  const { bikeId, longitude, latitude } = req.body;
  const bike = await Bike.findOne({ bikeId });

  if (!bike) {
    return res.status(404).json({ success: false, message: "Bike not found" });
  }
  // =======
  //   const { qrCode, longitude, latitude } = req.body;

  //   const bike = await Bike.findOne({ qrCode });
  //   if (!bike) {
  //     return res.status(404).json({ success: false, message: "Bike not found" });
  //   }

  // Validate GPS coordinates
  if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid GPS coordinates" });
  }

  // Update bike location
  bike.currentLocation.coordinates = [longitude, latitude];

  // Check geofence status
  const isInside = isBikeInsideGeofence([longitude, latitude]);

  if (!isInside && bike.geofenceStatus !== "outside") {
    bike.geofenceStatus = "outside";

    // Save geofence alert
    const alert = new Alert({
      bike: bike._id,
      user: req.user._id, // Assuming user is tracking the bike
      alertType: "Geofence Exit",
      location: bike.currentLocation,
      timestamp: Date.now(),
    });
    await alert.save();

    //console.log(`ALERT: Bike ${bike.bikeId} has left the allowed area!`);

    // Emit real-time alert to all connected admins
    const io = req.app.get("io");

    io.emit("bikeLocationUpdated", {
      bikeId,
      longitude,
      latitude,
      geofenceStatus: bike.geofenceStatus,
    });

    // io.emit("bikeLocationUpdated", {
    //     qrCode,
    //     longitude,
    //     latitude,
    //     geofenceStatus: bike.geofenceStatus,
    // });

    io.emit("geofenceAlert", {
      message: `Bike ${bike.bikeId} exited the geofence!`,
      bikeId: bike.bikeId,
      location: bike.currentLocation.coordinates,
    });
  } else if (isInside && bike.geofenceStatus !== "inside") {
    bike.geofenceStatus = "inside"; // Bike re-entered the geofence
  }

  await bike.save();

  // Emit real-time location update
  const io = req.app.get("io");
  io.emit("bikeLocationUpdated", {
    bikeId,
    longitude,
    latitude,
    geofenceStatus: bike.geofenceStatus,
  });

  res
    .status(200)
    .json({ success: true, message: "Bike location updated", bike });
});

// Delete bike (SuperAdmin only)
exports.deleteBike = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const bike = await Bike.findOne({ _id: req.params.id });
  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  if (bike.status == "in-use" || bike.status == "reserved") {
    return res.status(400).json({
      success: false,
      message: "Can not delete bike in-use.",
    });
  }

  if (bike.status == "underMaintenance") {
    return res.status(400).json({
      success: false,
      message: "Can not delete bike under maintenance.",
    });
  }

  const station = await Station.findById(bike.currentStation);
  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  const bikeIndex = station.available_bikes.indexOf(bike._id);
  if (bikeIndex > -1) {
    station.available_bikes.splice(bikeIndex, 1);
  }

  await station.save();
  await Bike.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Bike deleted successfully",
  });
});

// Get bike metrics (All users)

exports.getBikeMetrics = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }
  const totalBikes = await Bike.countDocuments();
  const totalAvailableBikes = await Bike.countDocuments({
    status: "available",
  });
  const totalRentedBikes = await Bike.countDocuments({ status: "in-use" });
  const totalReservedBikes = await Bike.countDocuments({
    status: "reserved",
  });
  const totalBikesInMaintenance = await Bike.countDocuments({
    status: "underMaintenance",
  });

  res.status(200).json({
    success: true,
    data: {
      totalBikes,
      totalAvailableBikes,
      totalRentedBikes,
      totalReservedBikes,
      totalBikesInMaintenance,
    },
  });
});

// Update bike details (Admins & SuperAdmins only)
exports.updateBikeDetails = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const id = req.params.id;
  let { model, currentStation } = req.body;

  const bike = await Bike.findOne({ _id: id });
  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  if (!model) {
    model = bike.model;
  }

  if (!currentStation) {
    currentStation = bike.currentStation;
  }

  const prevStation = await Station.findOne({ _id: bike.currentStation });
  if (!prevStation) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  const prevStationIndex = prevStation.available_bikes.indexOf(id);

  if (prevStationIndex > -1) {
    prevStation.available_bikes.splice(prevStationIndex, 1);
  }

  await prevStation.save();

  const newStation = await Station.findOne({ _id: currentStation });
  if (!newStation) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }
  newStation.available_bikes.push(id);
  await newStation.save();

  const updatedBike = await Bike.findByIdAndUpdate(
    id,
    {
      model,
      currentStation,
      currentLocation: {
        type: "Point",
        coordinates: newStation.location.coordinates,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    success: true,
    data: updatedBike,
  });
});

exports.getBikeLocations = catchAsync(async (req, res) => {
  const bike = await Bike.find({}, { bikeId: 1, currentLocation: 1 }).sort({
    createdAt: -1,
  });

  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "No Bikes found",
    });
  }

  const bikeLocations =
    bike &&
    bike.map((bike) => {
      return {
        bikeId: bike.bikeId,
        coordinates: bike.currentLocation.coordinates,
      };
    });
  res.status(200).json({
    success: true,
    data: bikeLocations,
  });
});

exports.checkBikeAvailability = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const bikeId = req.query.bikeId;
  if (!bikeId) {
    return res.status(400).json({
      success: false,
      message: "Bike ID is required",
    });
  }
  const bike = await Bike.findOne({ bikeId: bikeId });

  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      bikeId: bike.bikeId,
      status: bike.status === "available",
    },
  });
});
