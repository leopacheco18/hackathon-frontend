import React, { useEffect } from "react";
import {
  useMoralis,
  useNewMoralisObject,
  useMoralisQuery,
} from "react-moralis";
import { useNavigate } from "react-router-dom";
// CSS freamework ant-design short antd
import { Form, Input, Button, notification } from "antd";

const CreateAccount = () => {
  const { isAuthenticated, user } = useMoralis();
  const { save } = useNewMoralisObject("organization");
  const { fetch, data } = useMoralisQuery(
    "organization",
    (query) => query.equalTo("userWallet", user?.get("ethAddress")),
    [user],
    { autoFetch: false }
  );
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/");
  }

  useEffect(() => {
    if (user && user.get("ethAddress")) {
      fetch();
    }
  }, [user]);

  useEffect(() => {
    if (data.length > 0) {
      notification.error({
        message: "Your account is already created!",
        description: "You will be redirect to home in 3 seconds...",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [data]);

  const onFinish = (values) => {
    values.userWallet = user.get("ethAddress");
    save(values).then(
      () => {
        // Execute any logic that should take place after the object is saved.
        notification.success({
          message: "Organization name was created with your connected address.",
          description:
            "The title of your organization '" +
            values.organizationName +
            "' was created successfully.",
        });
      },
      (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.

        notification.error({
          message: "Something went wrong!",
          description: error.message,
        });
      }
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h2>{data.length === 0 ? "Create" : "Update"} Account</h2>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Organization"
          name="organizationName"
          rules={[
            {
              required: true,
              message: "Please input the name of your organization Name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateAccount;
