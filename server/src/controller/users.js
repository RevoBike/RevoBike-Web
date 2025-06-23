const User = require("../models/User");
const { generateToken, generateRefreshToken } = require("../config/JwtConfig");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "User" } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    console.log("Login attempt with email:", req.body.email); // Log the email for debugging
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      token: generateToken(user),
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// refresh token endpoint and set it in http cookie
exports.refreshToken = async (req, res) => {
  s;
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = generateToken(payload);

    const newRefreshToken = generateRefreshToken(payload);
    e;
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      token: accessToken,
      role: payload.role,
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
