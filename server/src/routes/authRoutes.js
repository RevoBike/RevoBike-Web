const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/middleware");
const { registerUser, loginUser } = require("../controller/authController");

router.post("/register", async (req, res, next) => {
  try {
    await registerUser(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/login", async (req, res, next) => {
  try {
    await loginUser(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/profile", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Admin-only route
router.get("/admin", protect, authorizeRoles("Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

module.exports = router;
