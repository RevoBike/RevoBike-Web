const Bike = require("../models/Bike");
const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

// Get all bikes (Admins & SuperAdmins only)
exports.getBikesUnderMaintenance = catchAsync(async (req, res) => {
  // if (req.user.role === "User") {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Unauthorized access",
  //   });
  // }

  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const bikeFilter = req.query.bikeFilter;

  let matchQuery = {};
  if (search) {
    matchQuery.$or = [{ model: { $regex: search, $options: "i" } }];
    if (mongoose.isValidObjectId(search)) {
      matchQuery.$or.push({ _id: new mongoose.Types.ObjectId(search) });
    }
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
  // if (req.user.role === "User") {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Unauthorized access",
  //   });
  // }

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

  bike.status = "underMaintenance";

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
  // if (req.user.role === "User") {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Unauthorized access",
  //   });
  // }

  console.log("I have been here");

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
