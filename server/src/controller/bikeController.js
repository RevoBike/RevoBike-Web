const Bike = require("../models/Bike");
const Alert = require("../models/Alert");
const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");
const { isBikeInsideGeofence } = require("../utils/rideUtils");
const generateQRCode = require("../utils/generateQRCode");
const { v4: uuidv4 } = require("uuid");

// Get all bikes (Admins & SuperAdmins only)
exports.getAllBikes = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const bikes = await Bike.find();
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

  res.status(200).json({
    success: true,
    data: bike,
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

  const { model, station } = req.body;
  const file = req.file;
  const imgUrl = `/uploads/${file.filename}`;

  const qrCode = uuidv4();

  const qrCodeImageUrl = await generateQRCode(qrCode, `qr-${qrCode}.png`);

  const newBike = await Bike.create({
    model,
    currentStation: station,
    imageUrl: imgUrl,
    qrCode: qrCodeImageUrl,
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
  const { qrCode, longitude, latitude } = req.body;

  const bike = await Bike.findOne({ qrCode });
  if (!bike) {
    return res.status(404).json({ success: false, message: "Bike not found" });
  }

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
    qrCode,
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

  const bike = await Bike.findByIdAndDelete(req.params.id);
  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Bike deleted successfully",
  });
});
