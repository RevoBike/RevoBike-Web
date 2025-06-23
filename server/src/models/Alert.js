const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bike",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  alertType: {
    type: String,
    enum: ["Geofence Exit", "Theft Alert"],
    required: true,
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model("Alert", AlertSchema);
module.exports = Alert;
