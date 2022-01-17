import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import copy from "clipboard-copy";

import taggtoday from "../api/taggtoday";
import Admin from "./Admin";
import AwsMap from "./AwsMap";
import randomstring from "randomstring";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  message,
  Select,
  Typography,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

const { Option } = Select;

const Data = () => {
  // if (localStorage.getItem("user-info")) {
  //   history.push("/tables");
  // } else {
  //   history.push("/sign-in");
  // }
  const myRef = useRef(null);
  const myRef1 = useRef(null);
  const componentMounted = useRef(true);
  // let publishMsgObj = {
  //   MachineSerialNumber: "",
  //   MachineType: "",
  //   CorrectPF: "",
  //   PaymentSystem: "",
  //   InstallDate: "",
  // };

  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState("");
  const [userMacAddress, setUserMacAddress] = useState([]);
  const [locationData, setLocationData] = useState("");
  // const [userType, setUserType] = useState("");
  // const [checkedList, setCheckedList] = useState({});

  // let intervalId = null;

  const getLocationParams = async () => {
    console.log("iND LAT DO");
    const macAddress = localStorage.getItem("macAddress");
    // console.log("Calling");
    await taggtoday
      .get(`/api/mqtt/tracking/${macAddress}`)
      .then((res) => {
        console.log(res.data);
        setLocationData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const executeScroll = () => myRef.current.scrollIntoView();
  // const executeScroll1 = () => myRef1.current.scrollIntoView();

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };
  const taggtodayDeviceData = async () => {
    if (localStorage.getItem("user-info")) {
      history.push("/data");
    } else {
      history.push("/sign-in");
    }
    // console.log("Calling");
    await taggtoday
      .post("/api/mqtt/getOne", {
        macAddress: localStorage.getItem("macAddress"),
      })
      .then((res) => {
        // console.log("Sucess");
        // console.log(res.data[0]);
        // localStorage.setItem("LampMaintenance", res.data[0].LampMaintenance);
        // localStorage.setItem(
        //   "AnnualMaintenance",
        //   res.data[0].AnnualMaintenance
        // );

        // if (res.data[0].LampMaintenance === "") {
        // setData(null);
        // } else {
        setData(res.data);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
    // taggtoday
    //   .get("/api/check")
    //   .then((res) => {
    //     // console.log(res.data[0]);
    //     setCheckedList(res.data[0]);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  useEffect(() => {
    // console.log("In USE");

    taggtodayDeviceData();
    getLocationParams();

    return () => {
      componentMounted.current = false;
    };
  }, [macAddress]);
  // console.log(checkedList);
  useEffect(() => {}, [data]);
  useInterval(() => {
    // Make the request here
    taggtodayDeviceData();
    getLocationParams();
  }, 1000 * 60);

  //Input Function

  // const onChangeMachineType = (e) => {
  //   // console.log(e.target.value);
  //   publishMsgObj.MachineType = e.target.value;
  // };
  // const onChangeMachineSerialNumber = (e) => {
  //   // console.log(e.target.value);
  //   publishMsgObj.MachineSerialNumber = e.target.value;
  // };
  // const onChangeCorrectPF = (e) => {
  //   // console.log(e.target.value);
  //   publishMsgObj.CorrectPF = e.target.value;
  // };
  // const handleChangePaymentSystem = (value) => {
  //   // console.log(value);
  //   publishMsgObj.PaymentSystem = value;
  // };
  // const onChangeInstallDate = (e) => {
  //   // console.log(e.target.value);
  //   publishMsgObj.InstallDate = e.target.value;
  // };
  // // console.log("OBJ");

  // const hanldleTransmitClick = () => {
  //   // console.log(JSON.stringify(publishMsgObj));
  //   publishToMqtt("fieldData", JSON.stringify(publishMsgObj));
  // };

  // const publishToMqtt = (topic, msg) => {
  //   let macaddress = localStorage.getItem("macAddress");

  //   taggtoday
  //     .post(`/api/mqtt/publish/${macaddress}/${topic}`, {
  //       message: msg,
  //     })
  //     .then((res) => {
  //       // console.log(res);

  //       message.success("Message Published");
  //     })
  //     .catch((err) => {
  //       // console.log("In err");
  //       console.log(err);
  //     });
  // };
  // const handlePollClick = () => {
  //   publishToMqtt("poll", "poll");
  // };

  // const setVisible = (visible) => {
  //   // console.log(checkedList[`${visible}`]);
  //   if (checkedList[`${visible}`] === true) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const columns = [
    {
      title: "Timestamp(Last Updated)",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },

    {
      title: "Latitude",
      key: "latitude",
      dataIndex: "latitude",
      align: "center",
    },
    {
      title: "Longitude",
      key: "longitude",
      align: "center",
      dataIndex: "longitude",
    },
  ];

  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getIdofLoggedInUser = () => {
    function parseJwt(token) {
      if (!token) {
        return;
      }
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64));
    }

    const token = localStorage.getItem("user-info");
    const user = parseJwt(token);
    // console.log(user.id);
    console.log(user.id);

    return user.id;
  };
  //Form Functions
  const onFinish = async (values) => {
    const id = getIdofLoggedInUser();
    console.log(id);
    const hide = message.loading("Processing", 0);
    // console.log(id);

    console.log(values.macAddress);
    await taggtoday
      .put(`/api/users/update/${id}`, {
        macAddress: values.macAddress,
      })
      .then((res) => {
        // Dismiss manually and asynchronously
        setTimeout(hide, 0);

        setIsModalVisible(false);
        message.success("Device Added");
      })
      .catch((err) => {
        // console.log("ER");
        // message.
        // setIsModalVisible(false);
        setTimeout(hide, 0);

        message.warn("Device Already Exists");

        console.log(err);
      });
    const trackingId = randomstring.generate(15);
    let formData = new FormData();
    formData.append("trackingId", trackingId);
    formData.append("macAddress", values.macAddress);
    formData.append("startLat", values.startLat);
    formData.append("startLong", values.startLong);
    formData.append("endLat", values.endLat);
    formData.append("endLong", values.endLong);

    await taggtoday
      .post("/api/mqtt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("done");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //Select Functions
  function handleChange(value) {
    localStorage.setItem("macAddress", value);

    setMacAddress(localStorage.getItem("macAddress", value));
    // console.log(`selected ${localStorage.getItem("macAddress", value)}`);
  }
  function copyto() {
    copy(locationData.trackingId);
  }

  const getMacAddresses = async () => {
    const id = getIdofLoggedInUser();

    await taggtoday
      .get(`/api/users/getMacAddress/${id}`)
      .then((res) => {
        setUserMacAddress(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderedOptions = userMacAddress.map((macadd) => {
    if (macadd) {
      return (
        <Option key={`${macadd}`} value={`${macadd}`}>
          {macadd}
        </Option>
      );
    } else {
      return;
    }
  });
  if (localStorage.getItem("userType") === "user") {
    return (
      <>
        <div className="flex-container" style={{ marginBottom: "10px" }}>
          <Button
            type="primary"
            className="addDevicebtn"
            onClick={showModal}
            style={{
              marginLeft: "5px",
              borderRadius: "50px",
            }}
          >
            Add New Device
          </Button>
          <Modal
            title="Add a New Device"
            visible={isModalVisible}
            // onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="username"
                label="Mac Address"
                name="macAddress"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Device MacAddress",
                  },
                ]}
              >
                <Input
                  placeholder="Enter MacAddress"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Start Point"
                name="startLat"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Latitiude",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Latitiude"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label=""
                name="startLong"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Longitude",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Longitude"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="End Point"
                name="endLat"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Latitiude",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Latitiude"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label=""
                name="endLong"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Longitude",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Longitude"
                  style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Select
          className="mac-search"
          defaultValue={localStorage.getItem("macAddress")}
          style={{ width: 120, borderRadius: "150px", marginBottom: "15px" }}
          onChange={handleChange}
          onClick={getMacAddresses}
        >
          {renderedOptions}
        </Select>
        <div className="tabled">
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Taggtoday Device"
              >
                <div style={{ display: "flex" }}>
                  <h4>Device Tracking Id: </h4>{" "}
                  <Paragraph copyable>{locationData.trackingId}</Paragraph>
                </div>
                {/* <CopyOutlined onClick={copyto} /> */}
                {/* <Copyable>{locationData.trackingId}</Copyable> */}
                <div className="table-responsive">
                  <Table
                    key="enCol"
                    columns={columns}
                    pagination={false}
                    dataSource={data}
                    className="ant-border-space"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        {locationData && data.length > 0 ? (
          <AwsMap locationData={locationData} data={data} />
        ) : (
          ""
        )}
      </>
    );
  } else if (localStorage.getItem("userType") === "admin") {
    return <Admin />;
  } else {
    return <h1>Data</h1>;
  }
};

export default Data;
