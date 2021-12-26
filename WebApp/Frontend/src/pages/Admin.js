import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";

import taggtoday from "../api/taggtoday";

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
  Checkbox,
  Divider,
} from "antd";
import Title from "antd/lib/typography/Title";

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  "Timestamp(Last Updated)",
  "MachineSerialNumber",
  "MachineType",
  "Device MAC",
  "Alive(Online)",
  "TotalRunningTime",
  "TotalSessionCount",
  "TotalSessionCorrectlyEnded",
  "TotalSessionEndedBeforeTime",
  "StartSession",
  "EndSession",
  "EndSessionType",
  "Temperature",
  "AnemometerSensor",
  "PresencePhases",
  "SensorFilters",
  "LampMaintenance",
  "AnnualMaintenance",
  "ActualLastTemp",
  "HighestTemp",
  "PowerFactorCorrection",
  "CorrectPF",
  "PFDeviationFromOptimalLevel",
  "LastFanSpeed",
  "InputVoltage",
  "Poll",
  "Message",
  "PaymentSystem",
  "InstallDate",
  "Transmit",
];
let defaultCheckedList = [];

let evnObj = {
  Alive: false,
  TotalRunningTime: false,
  TotalSessionCount: false,
  TotalSessionCorrectlyEnded: false,
  TotalSessionEndedBeforeTime: false,
  TotalSessionNotEndedCorrectly: false,
  StartSession: false,
  EndSession: false,
  EndSessionType: false,
  Temperature: false,
  AnemometerSensor: false,
  PresencePhases: false,
  SensorFilters: false,
  LampMaintenance: false,
  AnnualMaintenance: false,
  ActualLastTemp: false,
  HighestTemp: false,
  PowerFactorCorrection: false,
  PFDeviationFromOptimalLevel: false,
  LastFanSpeed: false,
  InputVoltage: false,
  Message: false,
  MachineSerialNumber: false,
  MachineType: false,
  CorrectPF: false,
  PaymentSystem: false,
  InstallDate: false,
  macAddress: false,
  Timestamp: false,
  Poll: false,
  Transmit: false,
};

const Admin = () => {
  let publishMsgObj = {
    MachineSerialNumber: "",
    MachineType: "",
    CorrectPF: "",
    PaymentSystem: "",
    InstallDate: "",
  };

  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState("");
  const [userMacAddress, setUserMacAddress] = useState([]);
  //   const [defaultCheckedList, setDefaultCheckedList] = useState([]);

  // setDefaultCheckedList()

  const [defCheckData, setDefCheckData] = useState([]);

  //checkbox useEffect

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
  const taggtodayDeviceData = () => {
    // console.log("Calling");
    taggtoday
      .post("/api/mqtt/getOne", {
        macAddress: localStorage.getItem("macAddress"),
      })
      .then((res) => {
        // console.log("Sucess");
        // console.log(res.data);
        localStorage.setItem("LampMaintenance", res.data[0].LampMaintenance);
        localStorage.setItem(
          "AnnualMaintenance",
          res.data[0].AnnualMaintenance
        );
        if (res.data[0].LampMaintenance === "") {
          setData(null);
        } else {
          setData(res.data.reverse());
        }
      })
      .catch((err) => {
        console.log(err);
      });

    taggtoday
      .get("/api/check")
      .then((response) => {
        // console.log(response.data[0].Timestamp);
        setCheckedList([
          response.data[0].Timestamp === true ? "Timestamp(Last Updated)" : "",
          response.data[0].MachineSerialNumber === true
            ? "MachineSerialNumber"
            : "",
          response.data[0].MachineType === true ? "MachineType" : "",
          response.data[0].macAddress === true ? "Device MAC" : "",
          response.data[0].Alive === true ? "Alive(Online)" : "",
          response.data[0].TotalRunningTime === true ? "TotalRunningTime" : "",
          response.data[0].TotalSessionCount === true
            ? "TotalSessionCount"
            : "",
          response.data[0].TotalSessionCorrectlyEnded === true
            ? "TotalSessionCorrectlyEnded"
            : "",
          response.data[0].TotalSessionEndedBeforeTime === true
            ? "TotalSessionEndedBeforeTime"
            : "",
          response.data[0].StartSession === true ? "StartSession" : "",
          response.data[0].EndSession === true ? "EndSession" : "",
          response.data[0].EndSessionType === true ? "EndSessionType" : "",
          response.data[0].Temperature === true ? "Temperature" : "",
          response.data[0].AnemometerSensor === true ? "AnemometerSensor" : "",
          response.data[0].PresencePhases === true ? "PresencePhases" : "",
          response.data[0].SensorFilters === true ? "SensorFilters" : "",
          response.data[0].LampMaintenance === true ? "LampMaintenance" : "",
          response.data[0].AnnualMaintenance === true
            ? "AnnualMaintenance"
            : "",
          response.data[0].ActualLastTemp === true ? "ActualLastTemp" : "",
          response.data[0].HighestTemp === true ? "HighestTemp" : "",
          response.data[0].PowerFactorCorrection === true
            ? "PowerFactorCorrection"
            : "",
          response.data[0].CorrectPF === true ? "CorrectPF" : "",
          response.data[0].PFDeviationFromOptimalLevel === true
            ? "PFDeviationFromOptimalLevel"
            : "",
          response.data[0].LastFanSpeed === true ? "LastFanSpeed" : "",
          response.data[0].InputVoltage === true ? "InputVoltage" : "",
          response.data[0].Poll === true ? "Poll" : "",
          response.data[0].Message === true ? "Message" : "",
          response.data[0].PaymentSystem === true ? "PaymentSystem" : "",
          response.data[0].InstallDate === true ? "InstallDate" : "",
          response.data[0].Transmit === true ? "Transmit" : "",
        ]);
        setDefCheckData(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      history.push("/data");
    }
    // console.log("In USE");

    // console.log(checkedList);
    taggtodayDeviceData();
  }, [macAddress]);
  useEffect(() => {}, [data]);
  useInterval(() => {
    // Make the request here
    taggtodayDeviceData();
  }, 1000 * 60);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  // console.log(checkedList);

  //checkbox functions

  const setVisible = (col) => {
    if (checkedList.includes(col)) {
      // console.log(checkedList))
      return true;
    } else {
      return false;
    }
  };

  //Input Function

  const onChangeMachineType = (e) => {
    // console.log(e.target.value);
    publishMsgObj.MachineType = e.target.value;
  };
  const onChangeMachineSerialNumber = (e) => {
    // console.log(e.target.value);
    publishMsgObj.MachineSerialNumber = e.target.value;
  };
  const onChangeCorrectPF = (e) => {
    // console.log(e.target.value);
    publishMsgObj.CorrectPF = e.target.value;
  };
  const handleChangePaymentSystem = (value) => {
    // console.log(value);
    publishMsgObj.PaymentSystem = value;
  };
  const onChangeInstallDate = (e) => {
    // console.log(e.target.value);
    publishMsgObj.InstallDate = e.target.value;
  };
  //   console.log("OBJ");

  const hanldleTransmitClick = () => {
    // console.log(JSON.stringify(publishMsgObj));
    publishToMqtt("fieldData", JSON.stringify(publishMsgObj));
  };

  const publishToMqtt = (topic, msg) => {
    let macaddress = localStorage.getItem("macAddress");

    taggtoday
      .post(`/api/mqtt/publish/${macaddress}/${topic}`, {
        message: msg,
      })
      .then((res) => {
        // console.log(res);

        message.success("Message Published");
      })
      .catch((err) => {
        // console.log("In err");
        console.log(err);
      });
  };
  const handlePollClick = () => {
    publishToMqtt("poll", "poll");
  };

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
  //   console.log(environmentCol);
  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleSaveCheck = () => {
    // console.log(environmentCol);
    if (columns.length === 0) {
      taggtoday.put("/api/check", evnObj).then((res) => {
        message.success("Saved");
      });
    } else {
      columns.map((item) => {
        evnObj[item.key] = item.visible;
      });
      taggtoday.put("/api/check", evnObj).then((res) => {
        message.success("Saved");
      });
    }
    // console.log(evnObj);
  };

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

    return user.id;
  };
  //Form Functions
  const onFinish = async (values) => {
    const id = getIdofLoggedInUser();
    const hide = message.loading("Processing", 0);
    // console.log(id);
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

  const getMacAddresses = async () => {
    // const id = getIdofLoggedInUser();

    await taggtoday
      .get(`/api/users/getAllUsersMac`)
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
        {/* <Row style={{ marginTop: 20 }}>
          <Col xs="24">
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              style={{ padding: 20 }}
            >
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                span={8}
              >
                Check all
              </Checkbox>
              <Divider />
              <CheckboxGroup
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
                style={{ width: "100%" }}
              />
              <Button
                type="primary"
                className="addDevicebtn"
                onClick={handleSaveCheck}
                style={{
                  marginLeft: "5px",
                  borderRadius: "50px",
                }}
              >
                Save
              </Button>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
};

export default Admin;
