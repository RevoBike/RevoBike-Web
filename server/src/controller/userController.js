const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const { sendAdminEmail } = require("../utils/adminEmail");

// Admin verifies a user
exports.verifyUser = catchAsync(async (req, res) => {
  const { universityId } = req.body; // Get university ID from request body

  const user = await User.findOne({ universityId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.role !== "User") {
    return res
      .status(400)
      .json({ success: false, message: "Only users need verification" });
  }

  if (user.isVerified) {
    return res
      .status(400)
      .json({ success: false, message: "User is already verified" });
  }

  user.isVerified = true; // Set verification to true
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "User verified successfully" });
});

// Get all users (Only Admin & SuperAdmin)
exports.getAllUsers = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  const users = await User.find({ role: "User" });
  res.status(200).json({
    success: true,
    data: users,
  });
});

// Get all users (Only Admin & SuperAdmin)
exports.getAllUsersInTheSystem = catchAsync(async (req, res) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  const filter = req.query.filter;
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone_number: { $regex: search, $options: "i" } },
    ];
  }
  if (filter && ["Admin", "SuperAdmin", "User"].includes(filter)) {
    query.role = filter;
  }
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

// Get all admins (Only SuperAdmin)
exports.getAllAdmins = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  const admins = await User.find({ role: "Admin" });
  res.status(200).json({
    success: true,
    data: admins,
  });
});

// Get user by ID (Admins can only view Users, SuperAdmin can view anyone)
exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  // Restrict Admins from viewing other Admins/SuperAdmins
  if (req.user.role === "Admin" && user.role !== "User") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Update user profile (Users can update their own profile)
exports.updateUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  await user.save();
  res.status(200).json({
    success: true,
    data: user,
  });
});

// SuperAdmin creates a new Admin
exports.createAdmin = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  const { name, email, phone_number, role } = req.body;
  const existingUser = await User.find({
    email,
  });
  if (existingUser.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const password = Math.random().toString(36).slice(-8);
  const admin = await User.create({
    name,
    email,
    password: password,
    phone_number,
    role,
  });

  if (!admin) {
    return res.status(400).json({
      success: false,
      message: "Error creating admin",
    });
  }

  sendAdminEmail(email, password);

  res.status(201).json({
    success: true,
    data: admin,
  });
});

// Delete a user (Only SuperAdmin)
exports.deleteUser = catchAsync(async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});

// getUsersMetrics

exports.getUserMetrics = catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCustomers = await User.countDocuments({ role: "User" });
  const totalAdmins = await User.countDocuments({ role: "Admin" });
  const totalSuperAdmins = await User.countDocuments({
    role: "SuperAdmin",
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalSuperAdmins,
    },
  });
});
