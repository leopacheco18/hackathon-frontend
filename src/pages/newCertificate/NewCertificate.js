import React, { useState } from "react";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import helper from "./helperTemplate.json";
import "./NewCertificate.css";

const NewCertificate = () => {
  const navigate = useNavigate();
  const [templateSelected, setTemplateSelected] = useState(helper[0]);
  return (
    <div className="container">
      <BoxGray>
        <ArrowLeftOutlined onClick={() => navigate("/")} /> Choose a Template
      </BoxGray>
      <div className="certificate-template-container">
        <div className="certificate-template-gallery">
          <BoxGray>
            <div className="text-center">Templates</div>
            <div className="certificate-template-gallery-container max-height-gallery">
              {helper.map((item) => (
                <div
                  className={
                    "certificate-template-gallery-item " +
                    (item.id === templateSelected.id
                      ? "certificate-template-gallery-item-active"
                      : "")
                  }
                  onClick={() => setTemplateSelected(item)}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="text-center"> {item.name} </div>
                </div>
              ))}
            </div>
          </BoxGray>
        </div>
        <div className="certificate-template-content">
          <BoxGray>
            <div className="container">
              <div className="text-center">
                Preview: {templateSelected.name}
              </div>
            </div>
            <div className="certificate-template-preview-container certificate-template-gallery-container max-height-content">
              <img src={templateSelected.image} alt={templateSelected.name} />
            </div>
          </BoxGray>

          <div className="certificate-template-buttons-container">
            <button
              className="button-rounded certificate-template-buttons"
              onClick={() => alert("Not working yet :)")}
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCertificate;
