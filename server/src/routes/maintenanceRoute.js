const express = require("express");
const {
  getBikesUnderMaintenance,
  addBikeUnderMaintenance,
  doneBikeMaintenance,
  updateBikeUnderMaintenance,
  deleteBikeMaintenance,
} = require("../controller/maintenanceController");
const { protect, authorizeRoles } = require("../middlewares/middleware");

const router = express.Router();

/**
 * @swagger
 * /bikes/maintenance:
 *   get:
 *     summary: Get all bikes under maintenance
 *     description: Retrieves a list of all bikes currently under maintenance (authenticated users only).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all bikes under maintenance
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
router.get("", protect, getBikesUnderMaintenance);

/**
 * @swagger
 * /bikes/maintenance/{id}:
 *   get:
 *     summary: Mark bike maintenance as done
 *     description: Marks a bike's maintenance as completed (Admin and SuperAdmin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bike maintenance record
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bike maintenance marked as done
 *       404:
 *         description: Maintenance record not found
 */
router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  doneBikeMaintenance
);

/**
 * @swagger
 * /bikes/maintenance/{id}:
 *   post:
 *     summary: Add bike under maintenance
 *     description: Adds a bike to the maintenance list (Admin and SuperAdmin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bike to add to maintenance
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Bike added to maintenance successfully
 *       404:
 *         description: Bike not found
 */
router.post(
  "/:id",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  addBikeUnderMaintenance
);

router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  updateBikeUnderMaintenance
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  deleteBikeMaintenance
);

module.exports = router;
