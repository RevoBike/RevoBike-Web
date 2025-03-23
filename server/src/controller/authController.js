const User = require("../models/User");
const { signToken } = require("../utils/JWTUtils");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

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
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id, user.role);
    // Send the token in the response
    res.status(200).json({ success: true, token });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Get user profile
exports.profile = catchAsync(async (req, res, next) => {
  // Get the user from the request object
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).json({ message: "Invalid token" });

    const user = await User.findById(verified.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
