const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
    getAllStations,
    getStationById,
    addStation,
    updateStationLocation,
    deleteStation
} = require('../controller/stationController');

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Operations related to bike stations
 */

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all stations
 *     description: Fetch all stations with available bikes (accessible by all user, admin and supperadmin)
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
 *       401:
 *         description: Unauthorized, no token provided
 *       500:
 *         description: Internal Server Error
 */
router.get('/stations', protect, getAllStations);

/**
 * @swagger
 * /stations/{id}:
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
 *       401:
 *         description: Unauthorized, no token provided
 *       500:
 *         description: Internal Server Error
 */
router.get('/stations/:id', protect, getStationById);

/**
 * @swagger
 * /stations:
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
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Internal Server Error
 */
router.post("/stations", protect, authorizeRoles("SuperAdmin"), addStation);

/**
 * @swagger
 * /stations/{id}/location:
 *   put:
 *     summary: Update station location
 *     description: Update the location of a station (Admin or SuperAdmin only)
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
 *         description: Forbidden - Only Admin or SuperAdmin can update
 *       404:
 *         description: Station not found
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Internal Server Error
 */
router.put("/stations/:id/location", protect, authorizeRoles("Admin", "SuperAdmin"), updateStationLocation);

/**
 * @swagger
 * /stations/{id}:
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
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Internal Server Error
 */
router.delete("/stations/:id", protect, authorizeRoles("SuperAdmin"), deleteStation);