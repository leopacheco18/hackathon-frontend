import React from "react";
import { useNavigate } from "react-router-dom";
import BoxGray from "../../components/global/BoxGray";
import "./CertificateOverview.css";
import helper from "./helper.json";

const CertificateOverview = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <BoxGray>Certificate Overview</BoxGray>
      <br /> <br />
      <div className="certificate-overview-container">
        {helper.map((item) => (
          <div
            className="certificate-overview-item"
            onClick={() => navigate("/certificateDetails/" + item.address)}
          >
            <img
              className="certificate-overview-img"
              src={item.image}
              alt={item.name}
            />
            <h6 className="certificate-overview-name"> {item.name} </h6>
          </div>
        ))}
      </div>
      <div className="certificate-overview-buttons-container">
        <button
          className="button-rounded certificate-overview-buttons"
          onClick={() => navigate("/newCertificate")}
        >
          Create New Certificate
        </button>

        <button
          className="button-rounded certificate-overview-buttons"
          onClick={() => alert("Not working yet :)")}
        >
          Create New from Copy
        </button>
      </div>
    </div>
  );
};

export default CertificateOverview;
