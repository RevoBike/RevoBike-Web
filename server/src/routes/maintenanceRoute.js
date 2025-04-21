const express = require("express");
const {
  getBikesUnderMaintenance,
  addBikeUnderMaintenance,
  doneBikeMaintenance,
} = require("../controller/maintenanceController");
const { protect, authorizeRoles } = require("../middlewares/middleware");

const router = express.Router();

/**
 * @openapi
 * /bikes:
 *   get:
 *     summary: Get all bikes
 *     description: Retrieves a list of all bikes in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved all bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bike'
 */
router.get("/", protect, getBikesUnderMaintenance);

router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  doneBikeMaintenance
);

router.post(
  "/:id",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  addBikeUnderMaintenance
);

module.exports = router;
