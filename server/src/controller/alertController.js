const Alert = require("../models/Alert");
const Bike = require("../models/Bike");
const catchAsync = require("../utils/catchAsync");

//Get all alerts (For Admins & SuperAdmins)
exports.getAllAlerts = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const filter = req.query.filter;
  const date = req.query.date;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  let matchQuery = {};

  if (filter && ["Geofence Exit", "Theft Alert"].includes(filter)) {
    matchQuery.alertType = filter;
  }

  if (date !== "null" && date) {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    matchQuery.timestamp = { $gte: startDate, $lte: endDate };
  }

  const alerts = await Alert.find(matchQuery)
    .populate("user bike", "name phone_number bikeId model")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: alerts,
  });
});

//Get alerts for a specific user
exports.getUserAlerts = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const alerts = await Alert.find({ user: userId }).sort({ timestamp: -1 });

  res.status(200).json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});

//Get alert locations (For Admins & SuperAdmins)
exports.getAlertLocations = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const alerts = await Alert.find({})
    .select("location")
    .populate("bike", "bikeId");

  const alertLocations =
    alerts &&
    alerts.map((alert) => {
      return {
        bikeId: alert.bike ? alert.bike.bikeId : null,
        coordinates: alert.location.coordinates,
      };
    });

  res.status(200).json({
    success: true,
    data: alertLocations,
  });
});

// get five most recent alerts (For Admins & SuperAdmins)

exports.getRecentAlerts = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const recentAlerts = await Alert.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user bike", "name phone_number bikeId model");

  res.status(200).json({
    success: true,
    data: recentAlerts,
  });
});
