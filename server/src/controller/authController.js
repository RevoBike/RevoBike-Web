const User = require("../models/User");
const { signToken } = require("../utils/JWTUtils");
const catchAsync = require("../utils/catchAsync");
const { generateOTP, sendOTPEmail } = require("../utils/otpservice");
const jwt = require("jsonwebtoken");

// Define your university email domain
const UNIVERSITY_EMAIL_DOMAIN = "@aastustudent.edu.et";

// Register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, phone_number, universityId } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!email.endsWith(UNIVERSITY_EMAIL_DOMAIN)) {
      return res.status(400).json({ 
        success: false, 
        message: `Only university emails (${UNIVERSITY_EMAIL_DOMAIN}) are allowed.` 
      });
    }

    // Generate OTP and set expiration
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // // Only "User" role can register directly
    // if (role && role !== "User") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You cannot register as an Admin or SuperAdmin.",
    //   });
    // }

    const user = new User({ 
      name, 
      email, 
      phone_number,
      password, 
      universityId, 
      role: "User",  // Force role to "User"
      isVerified: false, // User needs admin verification
      otpCode: otp,
      otpExpires,
    });
    
    await user.save();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please visit the station for verification.",
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check OTP validity
  if (user.otpCode !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  // Mark user as verified
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Account verified successfully" });
});

// Login user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Prevent unverified users from logging in
  if (user.role === "User" && !user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "You are not verified. Please check your email for OTP verification.",
    });
  }

  const token = signToken(user._id, user.role);
  // Send the token in the response
  res.status(200).json({ success: true, token });
  
});
