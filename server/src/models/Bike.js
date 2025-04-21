const mongoose = require("mongoose");

const BikeSchema = new mongoose.Schema(
  {
    // bikeId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    qrCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "in-use", "underMaintenance", "reserved"],
      default: "available",
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        // required: true,
        default: [0, 0],
      },
    },

    currentStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      default: null,
    },
    geofenceStatus: {
      type: String,
      enum: ["inside", "outside"],
      default: "inside",
    },
    // Battery and Power
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    batteryHealth: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    lastCharged: {
      type: Date,
      default: Date.now,
    },
    // Maintenance
    lastMaintenance: {
      type: Date,
      default: Date.now,
    },
    nextMaintenance: {
      type: Date,
      // required: true,
    },
    maintenanceHistory: [
      {
        date: {
          type: Date,
          // required: true,
        },
        type: {
          type: String,
          // required: true,
        },
        description: {
          type: String,
          // required: true,
        },
        technician: {
          type: String,
          // required: true,
        },
        cost: {
          type: Number,
          // required: true,
        },
      },
    ],
    maintenanceNotes: {
      type: String,
      default: "",
    },
    // Usage Statistics
    totalRides: {
      type: Number,
      default: 0,
    },
    totalDistance: {
      type: Number,
      default: 0,
    },
    lastRide: {
      type: Date,
      default: null,
    },
    averageSpeed: {
      type: Number,
      default: 0,
    },
    // Bike Specifications
    model: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      // required: true,
    },
    year: {
      type: Number,
      // required: true,
    },
    color: {
      type: String,
      // required: true,
    },
    // Safety Features
    lockStatus: {
      type: String,
      enum: ["locked", "unlocked"],
      default: "locked",
    },
    alarmStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // Insurance and Compliance
    insuranceExpiry: {
      type: Date,
      // required: true,
    },
    lastInspection: {
      type: Date,
      // required: true,
    },
    nextInspection: {
      type: Date,
      // required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
BikeSchema.index({ currentLocation: "2dsphere" });

const Bike = mongoose.model("Bike", BikeSchema);
module.exports = Bike;
