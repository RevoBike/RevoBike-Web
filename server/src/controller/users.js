const User = require("../models/User");
const { generateToken } = require("../config/JwtConfig");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "User" } = req.body;
    const user = await User.create({ name, email, password, role });
    res
      .status(201)
      .json({
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

    res.json({
      message: "Login successful",
      token: generateToken(user),
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
