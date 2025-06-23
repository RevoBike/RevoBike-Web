const express = require("express");
const {
  startRide,
  endRide,
  getUserRides,
  getAllRides,
} = require("../controller/rideController");
const { protect, authorizeRoles } = require("../middlewares/middleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: Ride management (start, end, history, and admin view)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - user
 *         - bike
 *         - startLocation
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the ride
 *         user:
 *           type: string
 *           description: User ID who started the ride
 *         bike:
 *           type: string
 *           description: Bike ID being used
 *         startLocation:
 *           type: object
 *           description: Starting location of the ride
 *         endLocation:
 *           type: object
 *           description: Ending location (if completed)
 *         status:
 *           type: string
 *           enum: [active, completed]
 *           description: Ride status
 *         distance:
 *           type: number
 *           description: Distance traveled (if completed)
 *         cost:
 *           type: number
 *           description: Ride cost (if completed)
 *       example:
 *         id: "65f9a12e5a01c3d7c12345ab"
 *         user: "65f987c12d3eabcd56789xyz"
 *         bike: "65f8a12bcde4567f890abcde"
 *         startLocation: { lat: 40.7128, lng: -74.0060 }
 *         status: "active"
 */

/**
 * @swagger
 * /api/rides/start/{bikeId}:
 *   post:
 *     summary: Start a new ride
 *     tags: [Rides]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bikeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the bike to start the ride
 *     responses:
 *       201:
 *         description: Ride started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       400:
 *         description: Bike not available
 *       403:
 *         description: Only users can start a ride
 */
router.post("/start/:bikeId", protect, authorizeRoles("User"), startRide);

/**
 * @swagger
 * /api/rides/end/{rideId}:
 *   post:
 *     summary: End an active ride
 *     tags: [Rides]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the ride to end
 *     responses:
 *       200:
 *         description: Ride ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       400:
 *         description: Ride not found or already ended
 *       403:
 *         description: Only users can end a ride
 */
router.post("/end/:rideId", protect, authorizeRoles("User"), endRide);

/**
 * @swagger
 * /api/rides/history:
 *   get:
 *     summary: Get user's ride history
 *     tags: [Rides]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User ride history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
router.get("/history", protect, getUserRides);

/**
 * @swagger
 * /api/rides:
 *   get:
 *     summary: Get all rides (Admin/SuperAdmin only)
 *     tags: [Rides]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All rides retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 *       403:
 *         description: Unauthorized access
 */
router.get("/", protect, authorizeRoles("Admin", "SuperAdmin"), getAllRides);

module.exports = router;
