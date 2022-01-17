const mongoose = require("mongoose");

let trackingSchema = mongoose.Schema(
  {
    macAddress: {
      type: String,
    },
    trackingId: {
      type: String,
    },
    startLat: {
      type: String,
    },
    startLong: {
      type: String,
    },
    endLat: {
      type: String,
    },
    endLong: {
      type: String,
    },
  },
  { timestamps: true }
);
let trackingModel = new mongoose.model("Tracking", trackingSchema);

module.exports = trackingModel;
