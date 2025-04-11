const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/middleware");
const { registerUser, loginUser, verifyOTP, deleteAccount, checkUser, resendOTP, forceVerify, directDelete } = require("../controller/authController");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully, OTP sent
 *       400:
 *         description: Invalid input
 */
router.post("/register", async (req, res, next) => {
  try {
    await registerUser(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res, next) => {
  try {
    await loginUser(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 length: 6
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     summary: Admin-only endpoint
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/admin", protect, authorizeRoles("Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

/**
 * @swagger
 * /api/users/delete-account:
 *   post:
 *     summary: Delete user account by email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */
router.post("/delete-account", deleteAccount);

/**
 * @swagger
 * /api/users/check:
 *   post:
 *     summary: Check if user exists
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User exists
 *       404:
 *         description: User not found
 */
router.post("/check", checkUser);

/**
 * @swagger
 * /api/users/resend-otp:
 *   post:
 *     summary: Resend OTP for verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       404:
 *         description: User not found
 */
router.post("/resend-otp", resendOTP);

/**
 * @swagger
 * /api/users/force-verify:
 *   post:
 *     summary: Force verify a user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User force verified successfully
 *       404:
 *         description: User not found
 */
router.post("/force-verify", forceVerify);

/**
 * @swagger
 * /api/users/direct-delete:
 *   post:
 *     summary: Delete user account directly by email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */
router.post("/direct-delete", directDelete);

/**
 * @swagger
 * /api/users/remove-account:
 *   post:
 *     summary: Remove user account by email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Account removed successfully
 *       404:
 *         description: User not found
 */
router.post("/remove-account", directDelete);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Test route is working" });
});

module.exports = router;