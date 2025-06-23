const express = require("express");
const {
  getAllAlerts,
  getAlertLocations,
  getRecentAlerts,
} = require("../controller/alertController");
const { protect, authorizeRoles } = require("../middlewares/middleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin", "SuperAdmin"), getAllAlerts);
router.get(
  "/locations",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  getAlertLocations
);
router.get(
  "/recent",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  getRecentAlerts
);

module.exports = router;
