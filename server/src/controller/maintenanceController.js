const Bike = require("../models/Bike");
const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const cron = require("node-cron");

// Schedule a job to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const currentDate = new Date();
    const bikes = await Bike.find({
      nextMaintenance: { $lte: currentDate },
      status: { $ne: "underMaintenance" },
    });

    for (const bike of bikes) {
      bike.status = "underMaintenance";
      await bike.save();
    }
    console.log("Bike maintenance statuses updated");
  } catch (error) {
    console.error("Error updating bike maintenance statuses:", error);
  }
});

// Get all bikes (Admins & SuperAdmins only)
exports.getBikesUnderMaintenance = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const bikeFilter = req.query.bikeFilter;

  let matchQuery = {};
  if (search) {
    matchQuery.$or = [
      { model: { $regex: search, $options: "i" } },
      { bikeId: { $regex: search, $options: "i" } },
    ];
  }
  if (bikeFilter && mongoose.isValidObjectId(bikeFilter)) {
    matchQuery.currentStation = new mongoose.Types.ObjectId(bikeFilter);
  }
  matchQuery.status = "underMaintenance";

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
        model: 1,
        bikeId: 1,
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

exports.addBikeUnderMaintenance = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const bikeId = req.params.id;
  const { date, type, description, technician, cost } = req.body;
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  if (bike.status === "underMaintenance") {
    return res.status(400).json({
      success: false,
      message: "Bike is already under maintenance",
    });
  }

  if (bike.status !== "available") {
    return res.status(400).json({
      success: false,
      message: "Bike is in-use. It is not available for maintenance",
    });
  }

  bike.nextMaintenance = new Date(date);

  bike.maintenanceHistory.push({
    date: new Date(date),
    type,
    description,
    technician,
    cost,
  });

  await bike.save();

  res.status(200).json({
    success: true,
    message: "Bike added to maintenance successfully",
    data: bike,
  });
});

//  doneBikeMaintenance

exports.doneBikeMaintenance = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const bikeId = req.params.id;
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  if (bike.status !== "underMaintenance") {
    return res.status(400).json({
      success: false,
      message: "Bike is not under maintenance",
    });
  }

  bike.status = "available";
  bike.lastMaintenance = bike.nextMaintenance;
  bike.nextMaintenance = null;

  await bike.save();

  res.status(200).json({
    success: true,
    message: "Bike maintained successfully",
    data: bike,
  });
});

exports.updateBikeUnderMaintenance = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const bikeId = req.params.id;
  const { date, type, description, technician, cost } = req.body;
  const bike = await Bike.findById(bikeId);
  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  if (date) {
    bike.nextMaintenance = new Date(date);
  }
  if (type) {
    bike.maintenanceHistory[bike.maintenanceHistory.length - 1].type = type;
  }
  if (description) {
    bike.maintenanceHistory[bike.maintenanceHistory.length - 1].description =
      description;
  }

  if (technician) {
    bike.maintenanceHistory[bike.maintenanceHistory.length - 1].technician =
      technician;
  }

  if (cost) {
    bike.maintenanceHistory[bike.maintenanceHistory.length - 1].cost = cost;
  }

  await bike.save();

  res.status(200).json({
    success: true,
    message: "Bike added to maintenance successfully",
    data: bike,
  });
});

// deleteBikeMaintenance

exports.deleteBikeMaintenance = catchAsync(async (req, res) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const bikeId = req.params.id;
  const bike = await Bike.findById(bikeId);

  if (!bike) {
    return res.status(404).json({
      success: false,
      message: "Bike not found",
    });
  }

  if (bike.status !== "underMaintenance") {
    return res.status(400).json({
      success: false,
      message: "Bike is not under maintenance",
    });
  }
  bike.maintenanceHistory.pop();

  bike.status = "available";
  bike.nextMaintenance = null;

  await bike.save();

  res.status(200).json({
    success: true,
    message: "Bike maintenance record deleted successfully",
    data: bike,
  });
});
