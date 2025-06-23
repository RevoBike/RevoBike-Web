const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const protect = async (req, res, next) => {
  let token;

  // Check for x-auth-token header
  if (req.header("x-auth-token")) {
    token = req.header("x-auth-token");
  }

  // Check for Authorization Bearer token
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Here", req.user.role, roles);
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
