const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { protect } = require("../middlewares/middleware");

router.post("/initiate/:rideId", protect, paymentController.initiatePayment);
router.get("/callback/:tx_ref", paymentController.handleChapaCallback);

module.exports = router;

// router.get("/all", authMiddleware.protect, authMiddleware.authorizeRoles("Admin", "SuperAdmin"), paymentController.getAllPayments);
// router.get("/", authMiddleware.protect, paymentController.getUserPayments);
// router.get("/:id", authMiddleware.protect, paymentController.getPaymentById);
// router.get("/user/:userId", protect, paymentController.getUserPayments);
// router.get("/ride/:rideId", protect, paymentController.getRidePayment);
// router.get("/status/:tx_ref", protect, paymentController.getPaymentStatus);
// router.get("/", protect, paymentController.getAllPayments); // Admin route

module.exports = router;
