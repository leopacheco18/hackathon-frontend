import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const Loading = () => {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 90, color: "#1601ff" }} spin />
  );

  return (
    <div className="loading">
      <Spin indicator={antIcon} />
    </div>
  );
};
