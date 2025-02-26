const User = require("../models/User");
const { signToken } = require("../utils/JWTUtils");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = signToken(user._id, user.role);
    // Send the token in the response
    res.status(201).json({ success: true, token });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Login user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = signToken(user._id, user.role);
    // Send the token in the response
    res.status(200).json({ success: true, token });
  } catch (e) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: e.message });
  }
});
