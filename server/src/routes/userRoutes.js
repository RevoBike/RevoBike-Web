const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  verifyUser,
  getUserMetrics,
  getAllUsersInTheSystem,
  updateUserRole,
  createSuperAdmin,
  getUserProfile,
  updateProfile,
} = require("../controller/userController");
const { protect, authorizeRoles } = require("../middlewares/middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/admin/all:
 *   get:
 *     summary: Get all users in the system
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get("/all", protect, getAllUsersInTheSystem);

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/profile", protect, getUserProfile);
router.get("/user-metrics", protect, getUserMetrics);
router.get("/:id", protect, getUserById);

/**
 * @swagger
 * /api/admin/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               universityId:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */

router.put("/profile", protect, updateProfile);

router.put("/:id", protect, updateUser);

router.put(
  "/update/:id",
  protect,
  authorizeRoles("SuperAdmin"),
  updateUserRole
);

router.delete("/:id", protect, authorizeRoles("SuperAdmin"), deleteUser);

/**
 * @swagger
 * /api/admin/verify/{userId}:
 *   put:
 *     summary: Verify user (Admin and SuperAdmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID to verify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 */
router.put(
  "/verify/:userId",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  verifyUser
);

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Create a new admin user (SuperAdmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Admin user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               universityId:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin user created successfully
 */
router.post("/", protect, authorizeRoles("SuperAdmin"), createAdmin);
// for adding superadmin
router.post("/superadmin", createSuperAdmin);

module.exports = router;
