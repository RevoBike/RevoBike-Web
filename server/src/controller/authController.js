const User = require("../models/User");
const { signToken } = require("../utils/JWTUtils");
const catchAsync = require("../utils/catchAsync");
const { generateOTP, sendOTPEmail } = require("../utils/otpservice");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

    // Temporarily allow personal email for testing
    if (
      !email.endsWith(UNIVERSITY_EMAIL_DOMAIN) &&
      !email.endsWith("@gmail.com")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only university emails (@aastustudent.edu.et) or Gmail accounts are allowed for testing.",
      });
    }

    // Generate OTP and set expiration
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    const user = new User({
      name,
      email,
      phone_number,
      password,
      universityId,
      role: "User",
      isVerified: false, // User needs OTP verification
      otpCode: otp,
      otpExpires,
    });

    await user.save();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for OTP verification.",
      user: {
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
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
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  // Mark user as verified
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Generate token for automatic login after verification
  const token = signToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Account verified successfully",
    token,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

// Login user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token_type: "Bearer",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user account
exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await User.findOneAndDelete({ email });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if user exists
exports.checkUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        exists: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "User exists",
      exists: true,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Resend OTP
exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate new OTP and set expiration
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Update user with new OTP
    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Force verify a user
exports.forceVerify = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find and update the user
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          isVerified: true,
          otpCode: null,
          otpExpires: null,
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User force verified successfully",
      user: {
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Direct delete user by email
exports.directDelete = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await User.findOneAndDelete({ email });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/reset-password/${resetToken}`;

  // Email message
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendOTPEmail(email, message);
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res
      .status(500)
      .json({ success: false, message: "Email could not be sent" });
  }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired reset token" });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Generate new token for automatic login
  const token = signToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Password reset successful",
    token,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});
