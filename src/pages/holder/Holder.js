import { notification } from "antd";
import React, { useEffect, useState } from "react";
import BoxGray from "../../components/global/BoxGray";
import { useGetRandomIdByTokenId } from "../../hooks/useGetRandomIdByTokenId";
import { useHolderCertificates } from "../../hooks/useHolderCertificates";
import "./Holder.css";

const Holder = () => {
  const { certificateDetails } = useHolderCertificates();
  const [current, setCurrent] = useState(0);
  const [certificateSelected, setCertificateSelected] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const { getRandomId, randomId } = useGetRandomIdByTokenId();
  useEffect(() => {
    notification.info({
      message: "AllowedList",
      description:
        "Important, add your wallet to the allowed list using the button 'Add wallet to allowed list'",
      duration: null,
    });
  }, []);

  useEffect(() => {
    if (certificateDetails.length > 0) {
      getRandomId(
        certificateDetails[0].token_id,
        certificateDetails[0].course_address
      );
      setCertificateSelected(certificateDetails[0]);
    }
  }, [certificateDetails]);

  const removeAndCapitalize = (text) => {
    var input = text;
    var output = input.replace(/_/g, " ").replace(/\w+/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
    return output;
  };

  return (
    <div className="container">
      <div className="certificate-holder-container">
        <div className="certificate-holder-gallery">
          <BoxGray>
            <div className="text-center">Certificates</div>
            <div className="certificate-holder-gallery-container max-height-gallery-holder">
              {certificateDetails.length > 0 &&
                certificateDetails.map((item, key) => (
                  <div
                    key={key}
                    className={
                      "certificate-holder-gallery-item " +
                      (key === current
                        ? "certificate-holder-gallery-item-active"
                        : "")
                    }
                    onClick={() => {
                      setCurrent(key);
                      getRandomId(item.token_id, item.course_address);
                      setCertificateSelected(item);
                      setShowDetails(false);
                    }}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="text-center"> {item.name} </div>
                  </div>
                ))}
              {certificateDetails.length === 0 && (
                <div className="text-center">There are no certificates yet</div>
              )}
            </div>
          </BoxGray>
        </div>
        <div className="certificate-holder-content">
          {Object.keys(certificateSelected).length > 0 && (
            <>
              <BoxGray>
                <div className="container">
                  <div className="text-center">
                    Preview: {certificateSelected.name}
                  </div>
                </div>
                <div className="certificate-holder-gallery-container max-height-content-holder">
                  {showDetails ? (
                    <table>
                      <thead>
                        <th>Name</th>
                        <th>Value</th>
                      </thead>
                      <tbody>
                        {Object.keys(certificateSelected).map((item, key) => {
                          if (item === "token_id") {
                            return <></>;
                          } else {
                            return (
                              <tr key={key}>
                                <td> {removeAndCapitalize(item)} </td>
                                <td> {certificateSelected[item]} </td>
                              </tr>
                            );
                          }
                        })}

                        {randomId && (
                          <tr>
                            <td> Random Identifier </td>
                            <td> {randomId} </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="certificate-holder-preview-container  ">
                      <img
                        src={certificateSelected.image}
                        alt={certificateSelected.name}
                      />
                    </div>
                  )}
                </div>
              </BoxGray>

              <div className="certificate-template-buttons-container">
                <button
                  className="button-rounded certificate-template-buttons"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  View {showDetails ? "Certificate" : "Details"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Holder;
