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
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  // Rented bikes (rides started this week)
  const rentedThisWeek = await Ride.countDocuments({
    startTime: { $gte: startOfThisWeek },
  });
  const rentedLastWeek = await Ride.countDocuments({
    startTime: { $gte: startOfLastWeek, $lt: startOfThisWeek },
  });
  const rentedChange = getPercentageChange(rentedThisWeek, rentedLastWeek);

  // Bikes in maintenance
  const maintenanceThisWeek = await Bike.countDocuments({
    status: "underMaintenance",
    updatedAt: { $gte: startOfThisWeek },
  });
  const maintenanceLastWeek = await Bike.countDocuments({
    status: "underMaintenance",
    updatedAt: { $gte: startOfLastWeek, $lt: startOfThisWeek },
  });
  const maintenanceChange = getPercentageChange(
    maintenanceThisWeek,
    maintenanceLastWeek
  );

  // Available bikes
  const availableThisWeek = await Bike.countDocuments({
    status: "available",
    updatedAt: { $gte: startOfThisWeek },
  });
  const availableLastWeek = await Bike.countDocuments({
    status: "available",
    updatedAt: { $gte: startOfLastWeek, $lt: startOfThisWeek },
  });
  const availableChange = getPercentageChange(
    availableThisWeek,
    availableLastWeek
  );

  // Revenue (sum of cost for paid rides)
  const revenueThisWeekAgg = await Ride.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        startTime: { $gte: startOfThisWeek },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$cost" },
      },
    },
  ]);
  const revenueThisWeek = revenueThisWeekAgg[0]?.total || 0;

  const revenueLastWeekAgg = await Ride.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        startTime: { $gte: startOfLastWeek, $lt: startOfThisWeek },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$cost" },
      },
    },
  ]);
  const revenueLastWeek = revenueLastWeekAgg[0]?.total || 0;

  const revenueChange = getPercentageChange(revenueThisWeek, revenueLastWeek);

  res.status(200).json({
    success: true,
    data: {
      rented: {
        count: rentedThisWeek,
        change: rentedChange,
      },
      maintenance: {
        count: maintenanceThisWeek,
        change: maintenanceChange,
      },
      available: {
        count: availableThisWeek,
        change: availableChange,
      },
      revenue: {
        total: revenueThisWeek,
        change: revenueChange,
      },
    },
  });
});

// exports.getRentalStats = catchAsync(async (req, res) => {
//   const currentYear = new Date().getFullYear();
//   const startOfYear = new Date(currentYear, 0, 1);

//   const completedRidesAgg = await Ride.aggregate([
//     {
//       $match: {
//         startTime: { $gte: startOfYear },
//         paymentStatus: "paid",
//       },
//     },
//     {
//       $group: {
//         _id: { $month: "$startTime" },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { _id: 1 },
//     },
//   ]);

//   const completedRides = Array.from({ length: 12 }, (_, i) => {
//     const monthData = completedRidesAgg.find((m) => m._id === i + 1);
//     return {
//       month: i + 1,
//       count: monthData ? monthData.count : 0,
//     };
//   });
//   const activeRidesAgg = await Ride.aggregate([
//     {
//       $match: {
//         startTime: { $gte: startOfYear },
//         endTime: null,
//       },
//     },
//     {
//       $group: {
//         _id: { $month: "$startTime" },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: { _id: 1 },
//     },
//   ]);

//   const activeRides = Array.from({ length: 12 }, (_, i) => {
//     const monthData = activeRidesAgg.find((m) => m._id === i + 1);
//     return {
//       month: i + 1,
//       count: monthData ? monthData.count : 0,
//     };
//   });

//   const rentals = completedRides.map((ride, index) => {
//     return {
//       month: ride.month,
//       active: activeRides[index].count,
//       completed: ride.count,
//     };
//   });

//   res.status(200).json({
//     success: true,
//     data: rentals,
//   });
// });

exports.getRentalStats = catchAsync(async (req, res) => {
  // limit the role to be admin or superadmin

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
