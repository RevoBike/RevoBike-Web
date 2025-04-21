const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");

// Get all stations (All users)
exports.getAllStations = catchAsync(async (req, res) => {
  const filter = req.query.filter;
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  let query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (filter) {
    const capacityFilter = {};
    if (filter === "underloaded") {
      capacityFilter.$expr = {
        $lt: [{ $divide: ["$available_bikes.length", "$capacity"] }, 0.2],
      };
    } else if (filter === "normal") {
      capacityFilter.$expr = {
        $and: [
          {
            $gte: [{ $divide: ["$available_bikes.length", "$capacity"] }, 0.2],
          },
          {
            $lte: [{ $divide: ["$available_bikes.length", "$capacity"] }, 0.8],
          },
        ],
      };
    } else if (filter === "overloaded") {
      capacityFilter.$expr = {
        $gt: [{ $divide: ["$available_bikes.length", "$capacity"] }, 0.8],
      };
    }
    query = { ...query, ...capacityFilter };
  }

  const stations = await Station.find(query)
    .populate("available_bikes")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: stations,
  });
});

// Get a station by ID (All users)
exports.getStationById = catchAsync(async (req, res) => {
  const station = await Station.findById(req.params.id).populate(
    "available_bikes"
  );

  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  res.status(200).json({
    success: true,
    data: station,
  });
});

// get all station names

exports.getStationsList = catchAsync(async (req, res) => {
  const stations = await Station.find({}, { name: 1, _id: 1 }).sort({
    createdAt: -1,
  });

  if (!stations) {
    return res.status(404).json({
      success: false,
      message: "No stations found",
    });
  }

  const stationLists = stations.map((station) => {
    return {
      value: station._id,
      label: station.name,
    };
  });

  res.status(200).json({
    success: true,
    data: stationLists,
  });
});

// Add a new station (Only SuperAdmins)
exports.addStation = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { name, location, totalSlots, address } = req.body;

  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid location. Must provide coordinates [longitude, latitude].",
    });
  }

  if (!name || !totalSlots || totalSlots <= 0) {
    return res.status(400).json({
      success: false,
      message: "Name and totalSlots are required",
    });
  }

  const station = await Station.create({
    name,
    location: { type: "Point", coordinates: location.coordinates },
    totalSlots,
    address,
  });

  res.status(201).json({
    success: true,
    data: station,
  });
});

// Update Station Location (Only SuperAdmins)
exports.updateStationLocation = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { coordinates } = req.body;
  const { id } = req.params;

  if (!coordinates || coordinates.length !== 2) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid location. Must provide coordinates [longitude, latitude].",
    });
  }

  const station = await Station.findByIdAndUpdate(
    id,
    { location: { type: "Point", coordinates } },
    { new: true, runValidators: true }
  );

  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  res.status(200).json({
    success: true,
    data: station,
  });
});

// Delete station (SuperAdmin only)
exports.deleteStation = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const existingStation = await Station.findById(req.params.id);
  if (!existingStation) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  if (existingStation.available_bikes.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete station with available bikes",
    });
  }

  const station = await Station.findByIdAndDelete(req.params.id);

  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Station deleted",
  });
});

// Get station metrics (All users)

exports.getStationMetrics = catchAsync(async (req, res) => {
  const totalStations = await Station.countDocuments();
  const maxBikes = await Station.find().sort({ totalSlots: -1 }).limit(1);

  res.status(200).json({
    success: true,
    data: {
      totalStations,
      maxCapacity: maxBikes[0]?.totalSlots,
    },
  });
});

// Update Station (SuperAdmin only)

exports.updateStation = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
  )}
  }
  const id = req.params.id;
  let { name, totalSlots, address, location } = req.body;
  const station = await Station.findOne({ _id: id });
  if (!station) {
    return res.status(404).json({
      success: false,
      message: "Station not found",
    });
  }

  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid location. Must provide coordinates [longitude, latitude].",
    });
  }

  if (totalSlots < station.available_bikes.length) {
    return res.status(400).json({
      success: false,
      mesage: "Total slots cannot be less than available bikes",
    });
  }

  if (!name) {
    name = station.name;
  }

  const updatedStation = await Station.findByIdAndUpdate(
    id,
    {
      name,
      totalSlots,
      address,
      location: { type: "Point", coordinates: location.coordinates },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedStation,
  });
});
