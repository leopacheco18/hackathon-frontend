import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoxGray from "../../components/global/BoxGray";
import "./IssueCertificate.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import helper from "../certificateOverview/helper.json";
const IssueCertificate = () => {
  const { contractAddress } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    validateCertificate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateCertificate = () => {
    let band = 0;
    helper.forEach((item) => {
      if (item.address === contractAddress) {
        band = 1;
      }
    });
    if (band === 0) navigate("/");
  };
  return (
    <div className="container">
      <BoxGray>
        <ArrowLeftOutlined
          onClick={() => navigate("/certificateDetails/" + contractAddress)}
        />
        Back
      </BoxGray>
      <div className="issue-title">
        Issue your Certificate: {contractAddress}
      </div>
    </div>
  );
};

export default IssueCertificate;
