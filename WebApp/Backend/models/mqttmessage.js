const mongoose = require("mongoose");

let mqttMessageSchema = mongoose.Schema(
  {
    macAddress: {
      type: String,
    },
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
    trackingId: {
      type: String,
    },
  },
  { timestamps: true }
);
let mqttMessageModel = new mongoose.model("Mqttmessage", mqttMessageSchema);

module.exports = mqttMessageModel;
