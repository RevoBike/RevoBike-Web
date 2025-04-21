const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/middleware");
const {
  getAllStations,
  getStationById,
  addStation,
  updateStationLocation,
  deleteStation,
  getStationMetrics,
  getStationsList,
} = require("../controller/stationController");

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Operations related to bike stations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the station
 *         name:
 *           type: string
 *           description: The name of the station
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               description: The type of location (Point)
 *               example: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example: [37.7749, -122.4194]
 *         totalSlots:
 *           type: integer
 *           description: Total number of available slots at the station
 *         available_bikes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Bike'
 *           description: List of available bikes at the station
 *       required:
 *         - name
 *         - location
 *         - totalSlots
 */

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all stations
 *     description: Fetch all stations with available bikes (accessible by all users, admins, and superadmins)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Station'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", protect, getAllStations);

// add swagger for this route

/**
 * @swagger
 * /api/stations/station-metrics:
 *  get:
 *    summary: Get station metrics
 *   description: Fetch metrics for all stations (accessible by all authenticated users)
 *  tags: [Stations]
 *  security:
 *    - bearerAuth: []
 *   responses:
 *     200:
 *      description: Successfully retrieved station metrics
 *     content:
 *       application/json:
 *        schema:
 *         type: object
 *        properties:
 *         success:
 *          type: boolean
 *         data:
 *         type: array
 *        items:
 *         type: object
 *        properties:
 *         stationId:
 *         type: string
 *        description: The ID of the station
 *        totalBikes:
 *        type: integer
 *       description: Total number of bikes at the station
 *       availableBikes:
 *      type: integer
 *     description: Total number of available bikes at the station
 *      totalSlots:
 *     type: integer
 *    description: Total number of slots at the station
 *     500:
 *       description: Internal Server Error
 * */

router.get("/station-metrics", protect, getStationMetrics);

/**
 * @swagger
 * /api/stations/stationList:
 *  get:
 *   summary: Get a list of stations
 *  description: Fetch a list of stations (accessible by all authenticated users)
 * tags: [Stations]
 * security:
 *  - bearerAuth: []
 * responses:
 *  200:
 *   description: Successfully retrieved the list of stations
 *  content:
 *  application/json:
 *   schema:
 *    type: object
 *   properties:
 *   success:
 *   type: boolean
 *  data:
 *  type: array
 * items:
 *  $ref: '#/components/schemas/Station'
 *  500:
 *  description: Internal Server Error
 * */

router.get("/stationList", protect, getStationsList);

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     summary: Get a station by ID
 *     description: Fetch a single station by its ID (accessible by all authenticated users)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the station to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the station
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/:id", protect, getStationById);

/**
 * @swagger
 * /api/stations:
 *   post:
 *     summary: Add a new station
 *     description: Creates a new station (SuperAdmin only)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the station
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [37.7749, -122.4194]
 *               totalSlots:
 *                 type: integer
 *                 description: Total number of available slots at the station
 *     responses:
 *       201:
 *         description: Station successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - Only SuperAdmin can create stations
 *       500:
 *         description: Internal Server Error
 */
router.post("/", protect, authorizeRoles("SuperAdmin"), addStation);

/**
 * @swagger
 * /api/stations/{id}/location:
 *   put:
 *     summary: Update station location
 *     description: Update the location of a station (SuperAdmin only)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the station to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [37.7749, -122.4194]
 *     responses:
 *       200:
 *         description: Station location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       400:
 *         description: Invalid location input
 *       403:
 *         description: Forbidden - Only SuperAdmin can update
 *       404:
 *         description: Station not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/:id/location",
  protect,
  authorizeRoles("SuperAdmin"),
  updateStationLocation
);

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     summary: Delete a station
 *     description: Delete a station by its ID (SuperAdmin only)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the station to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station deleted successfully
 *       403:
 *         description: Forbidden - Only SuperAdmin can delete stations
 *       404:
 *         description: Station not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", protect, authorizeRoles("SuperAdmin"), deleteStation);

module.exports = router;
