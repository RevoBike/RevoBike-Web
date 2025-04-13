const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    available_bikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bike",
      },
    ],
    totalSlots: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", StationSchema);

module.exports = Station;
