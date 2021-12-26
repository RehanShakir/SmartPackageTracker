import React from "react";
import { Link } from "react-router-dom";
import taggtoday from "../api/taggtoday";
import history from "../utils/CreateBrowserHistory";

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

const SignIn = () => {
  const onFinish = async (values) => {
    const hide = message.loading("Processing", 0);
    await taggtoday
      .post("/api/users/login", {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        setTimeout(hide, 0);
        // console.log(res.data);

        localStorage.setItem("user-info", JSON.stringify(res.data.token));
        localStorage.setItem("userType", res.data.type);
        localStorage.setItem("userEmail", res.data.name);
        localStorage.setItem("userId", res.data.id);

        history.push("/");

        // console.log(res.data);
      })
      .catch((err) => {
        setTimeout(hide, 0);

        message.error("Password Not Correct");

        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Layout className="layout-default layout-signin">
        <Header>
          <div className="header-col header-brand">
            <h5>Taggtoday Device</h5>
          </div>
        </Header>
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email and password to sign in
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Email"
                    style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
                  />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-dark font-bold">
                    Sign Up
                  </Link>
                </p>
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 100 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img
                src={smartFarmingIot}
                alt="tagttoday"
                style={{ marginTop: -80 }}
              />
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

export default SignIn;
