const express = require("express");
const {
  getAllBikes,
  getBikeById,
  addBike,
  deleteBike,
  getBikeMetrics,
  updateBikeLocation,
  updateBikeDetails,
} = require("../controller/bikeController");
const upload = require("../config/multerConfig");
const { protect, authorizeRoles } = require("../middlewares/middleware");

const router = express.Router();

/**
 * @swagger
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
router.get("/", getAllBikes);

/**
 * @swagger
 * /bikes/bike-metrics:
 *   get:
 *     summary: Get bike metrics
 *     description: Retrieves metrics for bikes (authenticated users only).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bike metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 */
router.get("/bike-metrics", protect, getBikeMetrics);

/**
 * @swagger
 * /bikes/{id}:
 *   get:
 *     summary: Get a bike by ID
 *     description: Retrieves a specific bike by its MongoDB ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the bike
 *     responses:
 *       200:
 *         description: Successfully retrieved the bike
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bike'
 *       404:
 *         description: Bike not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getBikeById);

/**
 * @swagger
 * /bikes:
 *   post:
 *     summary: Add a new bike
 *     description: Creates a new bike (admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bikeId:
 *                 type: string
 *                 example: BIKE123
 *               latitude:
 *                 type: number
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 example: -74.0060
 *             required:
 *               - bikeId
 *               - latitude
 *               - longitude
 *     responses:
 *       201:
 *         description: Bike added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bike'
 *       400:
 *         description: Missing required bike data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("file"),
  addBike
);

/**
 * @openapi
 * /bikes/{id}:
 *   delete:
 *     summary: Delete a bike
 *     description: Deletes a bike by its MongoDB ID (admin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ID of the bike
 *     responses:
 *       200:
 *         description: Bike deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bike deleted
 *       404:
 *         description: Bike not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id", protect, authorizeRoles("admin"), deleteBike);

/**
 * @swagger
 * /bikes/location/update:
 *   post:
 *     summary: Update a bike's location
 *     description: Updates the current location of a bike (authenticated users only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bikeId:
 *                 type: string
 *                 example: BIKE123
 *               latitude:
 *                 type: number
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 example: -74.0060
 *             required:
 *               - bikeId
 *               - latitude
 *               - longitude
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Location updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Bike'
 *       400:
 *         description: Missing required data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Bike not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post("/location/update", protect, updateBikeLocation);

router.put("/:id", protect, updateBikeDetails);

module.exports = router;
