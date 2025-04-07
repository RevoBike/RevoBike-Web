const Payment = require("../models/Payment");
const Ride = require("../models/Ride");
const { initiateChapaPayment, verifyChapaPayment } = require("../utils/chapa");
const catchAsync = require("../utils/catchAsync");
const { v4: uuidv4 } = require("uuid");

// Initiate Chapa payment for a completed ride
exports.initiatePayment = catchAsync(async (req, res) => {
  const { rideId } = req.params;
  const ride = await Ride.findById(rideId).populate("user");

  if (!ride || ride.paymentStatus !== "pending") {
    return res.status(400).json({ message: "Invalid or already paid ride" });
  }

  const tx_ref = uuidv4(); // Now inside the controller

  const Payload = {
    amount: ride.cost,
    currency: "ETB",
    email: user.email,
    first_name: ride.user.name,
    phone_number: ride.user.phone_number,
    tx_ref,
    callback_url: `${process.env.BASE_URL}/api/payments/callback/${tx_ref}`,
    return_url: `${process.env.FRONTEND_URL}/payment-success/${tx_ref}`,
    customizations: {
        title: "Bike Sharing Payment",
        description: `Payment for ride ${rideId}`,
    },
};

  const chapaRes = await initiateChapaPayment(Payload);

  const payment = await Payment.create({
    user: user._id,
    ride: ride._id,
    amount: ride.cost,
    tx_ref,
    checkout_url: chapaRes.data.checkout_url,
  });

  await payment.save();

  res.status(200).json({ success: true, checkout_url: chapaRes.data.checkout_url });
});

// verify payemet 
exports.handleChapaCallback = catchAsync(async (req, res) => {
    const { tx_ref } = req.params;

    const existingPayment = await Payment.findOne({ tx_ref }).populate("ride");
    if (!existingPayment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (existingPayment.status === "successful") {
        return res.status(200).send("Payment already verified.");
    }

    const chapaData = await verifyChapaPayment(tx_ref);

    if (chapaData.status === "success") {
        existingPayment.status = "successful";
        existingPayment.verifiedAt = new Date();
        existingPayment.chapa_tx_id = chapaData.data.id;
        await existingPayment.save();

        existingPayment.ride.paymentStatus = "paid";
        await existingPayment.ride.save();

        return res.status(200).send("Payment verified and ride updated.");
    } else {
        existingPayment.status = "failed";
        await existingPayment.save();
        return res.status(400).send("Payment failed or not completed.");
    }
});
