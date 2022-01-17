import React, { useState, useEffect, useRef } from "react";

// import "./App.css";

import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Amplify, { Auth } from "aws-amplify";
import { Signer } from "@aws-amplify/core";
import Location from "aws-sdk/clients/location";
import awsconfig from "../aws-exports";
import Pin from "./Pin";
import useInterval from "./useInterval";
import { Authenticator } from "@aws-amplify/ui-react";
import { CodeSandboxCircleFilled } from "@ant-design/icons";
import { Button } from "antd";
import taggtoday from "../api/taggtoday";

Amplify.configure(awsconfig);
const mapName = "taggtoday-map"; // HERE IT GOES THE NAME OF YOUR MAP
const indexName = "taggtodayPlaceIndex"; // HERE GOES THE NAME OF YOUR PLACE INDEX
const trackerName = "taggtodayTracker"; // HERE GOES THE NAME OF  YOUR TRACKER
const deviceID = "Box1"; // HERE IT GOES THE NAME OF YOUR DEVICE
let kii = 2;
let pos1 = 0;

let long1 = 74.333333;
let lat1 = 31.416667;
let longEnd = -118.1187;
let latEnd = 54.2819;
/**
 * Sign requests made by Mapbox GL using AWS SigV4.
 */

const transformRequest = (credentials) => (url, resourceType) => {
  // Resolve to an AWS URL
  if (resourceType === "Style" && !url?.includes("://")) {
    url = `https://maps.geo.${awsconfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  // Only sign AWS requests (with the signature as part of the query string)
  if (url?.includes("amazonaws.com")) {
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }

  // Don't sign
  return { url: url || "" };
};

function Header(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-10">{/* <h1>FooBar Maps</h1> */}</div>
        <div className="col-2">{/* <AmplifySignOut /> */}</div>
        <div className="col-2">{/* <AmplifySignOut /> */}</div>
      </div>
    </div>
  );
}

function Search(props) {
  const [place, setPlace] = useState("Helsinki");

  const handleChange = (event) => {
    setPlace(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    props.searchPlace(place);
  };

  return (
    <div className="container">
      <div className="input-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search for Places"
          aria-label="Place"
          aria-describedby="basic-addon2"
          value={place}
          onChange={handleChange}
        />
        <div className="input-group-append">
          <button
            onClick={handleClick}
            className="btn btn-primary"
            type="submit"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

function Track(props) {
  const handleClick = (event) => {
    event.preventDefault();
    props.trackDevice();
  };

  return (
    <div className="container">
      <div className="input-group">
        <div className="input-group-append">
          <button
            onClick={handleClick}
            className="btn btn-primary"
            type="submit"
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
}

const AwsMap = ({ locationData, data }) => {
  const componentMounted = useRef(true);

  const [credentials, setCredentials] = useState(null);

  const [lo, setlo] = useState();
  const [lt, setlt] = useState();

  // console.log(Number(locationData.endLat));
  console.log(data);
  console.log(locationData);
  // setlo(locationData[0].longitude);
  // setlt(locationData[0].latitude);

  // useEffect(() => {
  //   // console.log("In USE");

  //   taggtodayDeviceData();
  //   return () => {
  //     componentMounted.current = false;
  //   };
  // }, []);

  // const [pos, setPos] = useState({
  //   longitude: longitude,
  //   latitude: latitude,
  // });
  // const dataLen = data.length;
  // console.log(dataLen);

  // const [viewport, setViewport] = useState({
  //   longitude: 74,
  //   latitude: 31,
  //   zoom: 5,
  // });
  const [viewport, setViewport] = useState({
    longitude: Number(locationData.startLong),
    latitude: Number(locationData.startLat),
    zoom: 5,
  });

  const [client, setClient] = useState(null);

  // const [marker, setMarker] = useState({
  //   longitude: Number(locationData.startLong),
  //   latitude: Number(locationData.startLat),
  // });

  const [devPosMarkers, setDevPosMarkers] = useState([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();

    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
      });
      setClient(client);
    };

    createClient();
  }, []);

  useInterval(() => {
    getDevicePosition();
  }, 20000);

  // const searchPlace = (place) => {
  //   const params = {
  //     IndexName: indexName,
  //     Text: place,
  //   };

  //   client.searchPlaceIndexForText(params, (err, data) => {
  //     if (err) console.error(err);
  //     if (data) {
  //       const coordinates = data.Results[0].Place.Geometry.Point;
  //       setViewport({
  //         longitude: coordinates[0],
  //         latitude: coordinates[1],
  //         zoom: 5,
  //       });

  //       setMarker({
  //         longitude: coordinates[0],
  //         latitude: coordinates[1],
  //       });
  //       return coordinates;
  //     }
  //   });
  // };
  useEffect(() => {
    getDevicePosition();
  }, []);
  const getDevicePosition = () => {
    // setDevPosMarkers([]);
    console.log("Handle Tracking");

    // var params = {
    //   DeviceId: deviceID,
    //   TrackerName: trackerName,
    //   StartTimeInclusive: "2020-11-02T19:05:07.327Z",
    //   EndTimeExclusive: new Date(),
    // };

    // client.getDevicePositionHistory(params, (err, data) => {
    //   console.log(data);
    //   if (err) console.log(err.message);
    //   if (data) {
    //     console.log(data);
    //     const tempPosMarkers = data.DevicePositions.map(function (
    //       devPos,
    //       index
    //     ) {
    //       return {
    //         index: index,
    //         long: devPos.Position[0],
    //         lat: devPos.Position[1],
    //       };
    //     });

    // setDevPosMarkers(tempPosMarkers);

    // const pos = tempPosMarkers.length - 1;

    if (
      locationData.startLong !== locationData.endLong &&
      locationData.startLat !== locationData.endLat
    ) {
      // setViewport({
      //   longitude: 74.03,
      //   latitude: 31.004,
      //   zoom: 5,
      // });
      setViewport({
        longitude: Number(data[0].longitude),
        latitude: Number(data[0].latitude),
        zoom: 5,
      });
      // setDevPosMarkers({ longitude: long, latitude: lat });
      // console.log("long" + long1);
      // console.log("lat" + lat1);
      // console.log("kii" + kii++);
      console.log("Set Done");
      trackerMarkers();
    } else {
      console.log("Parcel Reached");
    }
  };

  const trackerMarkers = () => {
    console.log("in teacer");
    data.map((m, index) => {
      devPosMarkers.push(
        <Marker
          // longitude={74.04}
          // latitude={31.003}
          key={"marker" + index}
          longitude={Number(m.longitude)}
          latitude={Number(m.latitude)}
          offsetTop={-20}
          offsetLeft={-10}
        >
          <Pin key={"pin" + index} size={20} text={`${index}`} />
        </Marker>
      );
    });
  };
  return (
    <div className="App">
      <Header />
      {/* <div>
          <Search searchPlace={searchPlace} />
        </div> */}
      <br />
      {/* <div>
        <Button onClick={getDevicePosition}>aaa</Button>
      </div> */}
      <br />
      <div>
        {credentials ? (
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100vh"
            transformRequest={transformRequest(credentials)}
            mapStyle={mapName}
            onViewportChange={setViewport}
            w
          >
            <Marker
              // longitude={74}
              // latitude={31}
              longitude={Number(locationData.startLong)}
              latitude={Number(locationData.startLat)}
              offsetTop={-20}
              offsetLeft={-10}
            >
              <Pin size={20} text={"Start"} />
            </Marker>

            <Marker
              // longitude={75}
              // latitude={32}
              longitude={Number(locationData.endLong)}
              latitude={Number(locationData.endLat)}
              offsetTop={-20}
              offsetLeft={-10}
            >
              <Pin size={20} text={"End"} />
            </Marker>

            {devPosMarkers.map((ma) => {
              return ma;
            })}

            <div style={{ position: "absolute", left: 20, top: 20 }}>
              <NavigationControl showCompass={false} />
            </div>
          </ReactMapGL>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default AwsMap;
