import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CertificateDetails.css";
import helper from "../certificateOverview/helper.json";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
const CertificateDetails = () => {
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
        <ArrowLeftOutlined onClick={() => navigate("/")} /> Certificate Overview
      </BoxGray>
      <div className="certificate-details-container">
        <div className="certificate-details-gallery">
          <BoxGray>
            <div className="text-center">Certificates</div>
            <div className="certificate-details-gallery-container max-height-gallery">
              {helper.map((item) => (
                <div
                  className={
                    "certificate-details-gallery-item " +
                    (item.address === contractAddress
                      ? "certificate-details-gallery-item-active"
                      : "")
                  }
                  onClick={() =>
                    navigate("/certificateDetails/" + item.address)
                  }
                >
                  <img src={item.image} alt={item.name} />
                  <div className="text-center"> {item.name} </div>
                </div>
              ))}
            </div>
          </BoxGray>
        </div>
        <div className="certificate-details-content">
          <BoxGray>
            <div className="container">
              <h2 className="certificate-details-title">
                Certificates Details
              </h2>
              <h5 className="certificate-details-address">
                {contractAddress}{" "}
              </h5>
            </div>
            <div className="certificate-details-gallery-container max-height-content">
              <Skeleton active size={"large"} />
              <div className="bottom-right">
                <UploadOutlined />
              </div>
            </div>
          </BoxGray>

          <div className="certificate-details-buttons-container">
            <button
              className="button-rounded certificate-details-buttons"
              onClick={() => navigate("/newCertificate")}
            >
              Create New Certificate
            </button>

            <button
              className="button-rounded certificate-details-buttons"
              onClick={() => navigate("/issueCertificate/" + contractAddress)}
            >
              Issue Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
