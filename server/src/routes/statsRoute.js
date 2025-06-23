const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/middleware");
const {
  getDashboardStats,
  getRentalStats,
  getRentStatus,
} = require("../controller/statsController");

router.get(
  "",
  protect,
  authorizeRoles("SuperAdmin", "Admin"),
  getDashboardStats
);

router.get(
  "/rental-stats",
  protect,
  authorizeRoles("SuperAdmin", "Admin"),
  getRentalStats
);

router.get(
  "/rental-status",
  protect,
  authorizeRoles("SuperAdmin", "Admin"),
  getRentStatus
);

module.exports = router;
