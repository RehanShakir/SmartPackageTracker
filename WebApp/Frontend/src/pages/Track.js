import "../assets/styles/main.css";
// import "../assets/styles/track.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import AwsMap from "./AwsMap";

import taggtoday from "../api/taggtoday";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Description,
  message,
} from "antd";
import smartFarmingIot from "../assets/images/smartFarmingIot.png";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const Track = () => {
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState();
  const [macAddress, setMacAddress] = useState("");

  // const getLocationParams = async () => {
  //   console.log("iND LAT DO");
  //   const macAddress = localStorage.getItem("macAddress");
  //   // console.log("Calling");
  //   await taggtoday
  //     .get(`/api/mqtt/tracking/${macAddress}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       setLocationData(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // getLocationParams();

  // const taggtodayDeviceData = async () => {
  //   // console.log("Calling");
  //   await taggtoday
  //     .post("/api/mqtt/getOne", {
  //       macAddress: localStorage.getItem("macAddress"),
  //     })
  //     .then((res) => {
  //       setData(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // taggtodayDeviceData();

  const onFinish = async (values) => {
    await taggtoday
      .get(`/api/mqtt/packageTrack/${values.trackingId}`)
      .then(async (res) => {
        console.log(res.data);
        setLocationData(res.data);
        // setMacAddress(res.data.macAddress);
        await taggtoday
          .post("/api/mqtt/getOne", {
            macAddress: res.data.macAddress,
          })
          .then((res) => {
            console.log(res.data);
            setData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishFailed = () => {
    console.log("onFinishFailed");
  };
  return (
    <>
      <Layout className="layout-default layout-signin">
        <Header style={{ paddingBottom: 120 }}>
          <div className="header-col header-brand">
            {/* <h3>Taggtoday Tracker</h3> */}
            <img
              src={smartFarmingIot}
              alt="tagttoday"
              style={{ width: 150, height: 150 }}
            />
          </div>
        </Header>
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-5" level={6}>
                Track Your Package
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Tracking Id"
                  name="trackingId"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Tracking Id",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Tracking Id"
                    style={{
                      paddingTop: 23.5,
                      paddingBottom: 23.5,
                      borderRadius: 50,
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "50%",
                      borderRadius: 50,
                      alignItems: "center",
                    }}
                  >
                    Track
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col style={{ width: "80%" }}>
              {locationData && data.length > 0 ? (
                <AwsMap locationData={locationData} data={data} />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Content>
        <Footer>
          <p className="copyright"> Copyright © 2021 </p>
        </Footer>
      </Layout>
    </>
  );
};

export default Track;
