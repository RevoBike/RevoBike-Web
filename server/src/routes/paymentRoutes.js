const express = require("express");
const router = express.Router();
const { initiatePayment, paymentCallback } = require("../controller/paymentController");

router.post("/pay/:rideId", initiatePayment);
router.post("/callback", paymentCallback);
// router.get("/all", authMiddleware.protect, authMiddleware.authorizeRoles("Admin", "SuperAdmin"), paymentController.getAllPayments);
// router.get("/", authMiddleware.protect, paymentController.getUserPayments);
// router.get("/:id", authMiddleware.protect, paymentController.getPaymentById);

module.exports = router;
