const Station = require("../models/Station");
const Bike = require("../models/Bike");
const Ride = require("../models/Ride");
const catchAsync = require("../utils/catchAsync");

// Helper to calculate percentage change
function getPercentageChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// Get dashboard stats (All admins and superadmins)
exports.getDashboardStats = catchAsync(async (req, res) => {
  // limit the role to be admin or superadmin
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const now = new Date();

  // Start of this month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // Start of last month
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Rented bikes (rides started this month)
  const rentedThisMonth = await Ride.countDocuments({
    startTime: { $gte: startOfThisMonth },
  });
  const rentedLastMonth = await Ride.countDocuments({
    startTime: { $gte: startOfLastMonth, $lt: startOfThisMonth },
  });

  const rentedChange = getPercentageChange(rentedThisMonth, rentedLastMonth);

  // Bikes in maintenance
  const maintenanceThisMonth = await Bike.countDocuments({
    status: "underMaintenance",
    updatedAt: { $gte: startOfThisMonth },
  });
  const maintenanceLastMonth = await Bike.countDocuments({
    status: "underMaintenance",
    updatedAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
  });
  const maintenanceChange = getPercentageChange(
    maintenanceThisMonth,
    maintenanceLastMonth
  );

  // Available bikes
  const availableThisMonth = await Bike.countDocuments({
    status: "available",
    updatedAt: { $gte: startOfThisMonth },
  });
  const availableLastMonth = await Bike.countDocuments({
    status: "available",
    updatedAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
  });
  const availableChange = getPercentageChange(
    availableThisMonth,
    availableLastMonth
  );

  // Revenue (sum of cost for paid rides)
  const revenueThisMonthAgg = await Ride.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        startTime: { $gte: startOfThisMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$cost" },
      },
    },
  ]);
  const revenueThisMonth = revenueThisMonthAgg[0]?.total || 0;

  const revenueLastMonthAgg = await Ride.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        startTime: { $gte: startOfLastMonth, $lt: startOfThisMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$cost" },
      },
    },
  ]);
  const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;

  const revenueChange = getPercentageChange(revenueThisMonth, revenueLastMonth);

  res.status(200).json({
    success: true,
    data: {
      rented: {
        count: rentedThisMonth,
        change: rentedChange,
      },
      maintenance: {
        count: maintenanceThisMonth,
        change: maintenanceChange,
      },
      available: {
        count: availableThisMonth,
        change: availableChange,
      },
      revenue: {
        total: revenueThisMonth,
        change: revenueChange,
      },
    },
  });
});

exports.getRentalStats = catchAsync(async (req, res) => {
  // limit the role to be admin or superadmin
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const year = parseInt(req.query.year) || 2025;

  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const completedRidesAgg = await Ride.aggregate([
    {
      $match: {
        startTime: { $gte: startOfYear },
        status: "completed",
      },
    },
    {
      $group: {
        _id: { $month: "$startTime" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const completedRides = Array.from({ length: 12 }, (_, i) => {
    const monthData = completedRidesAgg.find((m) => m._id === i + 1);
    return {
      month: i + 1,
      count: monthData ? monthData.count : 0,
    };
  });

  const activeRidesAgg = await Ride.aggregate([
    {
      $match: {
        startTime: { $gte: startOfYear },
        status: "active",
      },
    },
    {
      $group: {
        _id: { $month: "$startTime" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const activeRides = Array.from({ length: 12 }, (_, i) => {
    const monthData = activeRidesAgg.find((m) => m._id === i + 1);
    return {
      month: i + 1,
      count: monthData ? monthData.count : 0,
    };
  });

  const rentals = completedRides.map((ride, index) => ({
    month: ride.month,
    active: activeRides[index].count,
    completed: ride.count,
  }));

  res.status(200).json({
    success: true,
    data: rentals,
  });
});

exports.getRentStatus = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { timeframe = "this-week" } = req.query;

  let startDate;
  const now = new Date();
  if (timeframe === "this-week") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
    startDate.setHours(0, 0, 0, 0);
  } else if (timeframe === "this-month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (timeframe === "this-year") {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid timeframe" });
  }

  const stats = await Ride.aggregate([
    {
      $match: {
        startTime: { $gte: startDate },
      },
    },
    {
      $facet: {
        rented: [{ $match: { status: "active" } }, { $count: "count" }],
        completed: [
          { $match: { status: "completed", paymentStatus: "paid" } },
          { $count: "count" },
        ],
        total: [{ $count: "count" }],
      },
    },
    {
      $project: {
        rented: { $arrayElemAt: ["$rented.count", 0] },
        completed: { $arrayElemAt: ["$completed.count", 0] },
        total: { $arrayElemAt: ["$total.count", 0] },
      },
    },
  ]);

  const { rented = 0, completed = 0, total = 0 } = stats[0] || {};

  const data = [
    {
      label: "Rented",
      percentage: total ? Math.round((rented / total) * 100) : 0,
      count: rented,
    },
    {
      label: "Completed",
      percentage: total ? Math.round((completed / total) * 100) : 0,
      count: completed,
    },
  ];

  res.status(200).json({
    success: true,
    data,
  });
});
