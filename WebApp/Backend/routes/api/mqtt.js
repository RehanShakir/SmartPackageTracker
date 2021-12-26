const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const mqttMessgae = require("../../models/mqttmessage");
const date = new Date();

const topic = "smartdata/#";
const host = "34.214.65.82";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;
let client;

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
router.put("/", async (req, res) => {
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
      });
    });

    client.on("message", async (topic, payload) => {
      let message = JSON.parse(payload);
      console.log("Received Message:", topic, message);

      const macAdrs = topic.split("/");

      console.log(message);
      let macAd = message.macAddress;
      let mqttMsg = await mqttMessgae.findOneAndUpdate(
        { macAd },
        {
          macAddress: message.macAddress,
          Alive: message.Alive,
          TotalRunningTime: message.TotalRunningTime,
          TotalSessionCount: message.TotalSessionCount,
          TotalSessionCorrectlyEnded: message.TotalSessionCorrectlyEnded,
          TotalSessionEndedBeforeTime: message.TotalSessionEndedBeforeTime,
          TotalSessionNotEndedCorrectly: message.TotalSessionNotEndedCorrectly,
          StartSession: message.StartSession,
          EndSession: message.EndSession,
          EndSessionType: message.EndSessionType,
          Temperature: message.Temperature,
          AnemometerSensor: message.AnemometerSensor,
          PresencePhases: message.PresencePhases,
          SensorFilters: message.SensorFilters,
          LampMaintenance: message.LampMaintenance,
          AnnualMaintenance: message.AnnualMaintenance,
          ActualLastTemp: message.ActualLastTemp,
          HighestTemp: message.HighestTemp,
          PowerFactorCorrection: message.PowerFactorCorrection,
          PFDeviationFromOptimalLevel: message.PFDeviationFromOptimalLevel,
          LastFanSpeed: message.LastFanSpeed,
          InputVoltage: message.InputVoltage,
          Message: message.Message,
        }
      );
      mqttMsg.save();
      // let MqttMessgae = new mqttMessgae(,{
      //   macAddress: message.macAddress,
      //   Alive: message.Alive,
      //   TotalRunningTime: message.TotalRunningTime,
      //   TotalSessionCount: message.TotalSessionCount,
      //   TotalSessionCorrectlyEnded: message.TotalSessionCorrectlyEnded,
      //   TotalSessionEndedBeforeTime: message.TotalSessionEndedBeforeTime,
      //   TotalSessionNotEndedCorrectly: message.TotalSessionNotEndedCorrectly,
      //   StartSession: message.StartSession,
      //   EndSession: message.EndSession,
      //   EndSessionType: message.EndSessionType,
      //   Temperature: message.Temperature,
      //   AnemometerSensor: message.AnemometerSensor,
      //   PresencePhases: message.PresencePhases,
      //   SensorFilters: message.SensorFilters,
      //   LampMaintenance: message.LampMaintenance,
      //   AnnualMaintenance: message.AnnualMaintenance,
      //   ActualLastTemp: message.ActualLastTemp,
      //   HighestTemp: message.HighestTemp,
      //   PowerFactorCorrection: message.PowerFactorCorrection,
      //   PFDeviationFromOptimalLevel: message.PFDeviationFromOptimalLevel,
      //   LastFanSpeed: message.LastFanSpeed,
      //   InputVoltage: message.InputVoltage,
      //   Message: message.Message,
      // });
      // MqttMessgae.save();
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

module.exports = router;
