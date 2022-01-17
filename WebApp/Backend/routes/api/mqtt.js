const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const mqttMessgae = require("../../models/mqttmessage");
const trackId = require("../../models/tracking");
const date = new Date();

const topic = "taggtoday/#";
const host = "34.214.65.82";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;
let client;

let deviceDetails = {
  macAddress: "",
  trackingId: "",
};

//Get all Devices Data
router.get("/", async (req, res) => {
  try {
    let mqttMessgaes = await mqttMessgae.find();

    res.send(mqttMessgaes);
  } catch (err) {
    console.log(err);
  }
});

//To Get one Device Data using MacAddress
router.post("/getOne", async (req, res) => {
  try {
    let mqttMessgaes = await mqttMessgae.find({
      macAddress: req.body.macAddress,
    });
    return res.send(mqttMessgaes);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.post("/", async (req, res) => {
  try {
    client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000000,
      username: "hello",
      password: "hello",
      reconnectPeriod: 1000000,
    });

    client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);

        deviceDetails.macAddress = req.body.macAddress;
        deviceDetails.trackingId = req.body.trackingId;

        let tracking = new trackId({
          macAddress: req.body.macAddress,
          trackingId: req.body.trackingId,
          startLat: req.body.startLat,
          startLong: req.body.startLong,
          endLat: req.body.endLat,
          endLong: req.body.endLong,
        });
        tracking.save();
        console.log("duon");
      });
    });

    client.on("message", async (topic, payload) => {
      let message = JSON.parse(payload);
      console.log("Received Message:", topic, message);

      const macAdrs = topic.split("/");
      console.log(deviceDetails);

      console.log(message);
      // let macAd = message.macAddress;
      let mqttMsg = new mqttMessgae({
        macAddress: message.macAddress,
        longitude: message.longitude,
        latitude: message.latitude,
      });
      mqttMsg.save();
    });
    res.send("DATA SAVED");
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/publish/:macAddress/:button", async (req, res) => {
  try {
    let { message } = req.body;

    client.publish(
      `${req.params.macAddress}/${req.params.button}`,
      message,
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
    return res.status(200).send("Message Published  ");
  } catch (e) {
    console.log(e);
  }
});

router.get("/tracking/:macAddress", async (req, res) => {
  try {
    console.log(req.params.macAddress);
    let track = await trackId.findOne({ macAddress: req.params.macAddress });
    return res.status(200).send(track);
  } catch (e) {
    console.log(e);
  }
});

router.post("/tracking", async (req, res) => {
  try {
    let track = new trackId({
      macAddress: req.body.macAddress,
      trackingId: req.body.trackingId,
      startLat: req.body.startLat,
      startLong: req.body.startLong,
      endLat: req.body.endLat,
      endLong: req.body.endLong,
    });
    track.save();
    return res.status(200).send("Saved");
  } catch (e) {
    console.log(e);
  }
});

router.get("/longlat/:macAddress", async (req, res) => {
  try {
    let mqtt = await mqttMessgae.find({ macAddress: req.params.macAddress });
    return res.status(200).send(mqtt);
  } catch (e) {
    console.log(e);
  }
});

router.get("/packageTrack/:trackingId", async (req, res) => {
  try {
    let track = await trackId.findOne({ trackingId: req.params.trackingId });
    return res.status(200).send(track);
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
