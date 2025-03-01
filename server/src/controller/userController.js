const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Get all users (Only Admin & SuperAdmin)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new AppError("Access denied", 403));
  }
  const users = await User.find({ role: "User" });
  res.status(200).json({ success: true, data: users });
});

// Get all admins (Only SuperAdmin)
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  if (req.user.role !== "SuperAdmin") {
    return next(new AppError("Access denied", 403));
  }
  const admins = await User.find({ role: "Admin" });
  res.status(200).json({ success: true, data: admins });
});

// Get user by ID (Admins can only view Users, SuperAdmin can view anyone)
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  // Restrict Admins from viewing other Admins/SuperAdmins
  if (req.user.role === "Admin" && user.role !== "User") {
    return next(new AppError("Access denied", 403));
  }

  res.status(200).json({ success: true, data: user });
});

// Update user profile (Users can update their own profile)
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return next(new AppError("User not found", 404));

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  await user.save();
  res.status(200).json({ success: true, data: user });
});

// SuperAdmin creates a new Admin
exports.createAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== "SuperAdmin") {
    return next(new AppError("Access denied", 403));
  }
  const { name, email, password } = req.body;
  const admin = await User.create({ name, email, password, role: "Admin" });

  res.status(201).json({ success: true, data: admin });
});

// Delete a user (Only SuperAdmin)
exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== "SuperAdmin") {
    return next(new AppError("Access denied", 403));
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({ success: true, message: "User deleted" });
});
