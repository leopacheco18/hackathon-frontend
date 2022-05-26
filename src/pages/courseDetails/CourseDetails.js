import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CourseDetails.css";
// import helper from "../certificateOverview/helper.json";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMoralis, useMoralisQuery } from "react-moralis";
import useAllowedList from "../../hooks/useAllowedList";
import { useCertificate } from "../../hooks/useCertificate";
const CourseDetails = () => {
  const { contractAddress } = useParams();
  const { isValid, validateAddress } = useAllowedList();
  const { user } = useMoralis();
  const { certificateDetails } = useCertificate(contractAddress);
  const [details, setDetails] = useState(false);
  const [current, setCurrent] = useState(0);

  const { fetch } = useMoralisQuery(
    "Course",
    (query) =>
      query
        .equalTo("owner", user?.get("ethAddress"))
        .equalTo("contractAddress", contractAddress),
    [user, contractAddress],
    {
      autoFetch: false,
    }
  );
  const [templateSelected, setTemplateSelected] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isValid === 2) {
      navigate("/holder");
    }
  }, [isValid]);

  useEffect(() => {
    if (user) validateAddress();
  }, [user]);

  useEffect(() => {
    if (user && user.get("ethAddress") && isValid === 1) {
      validateCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isValid]);

  useEffect(() => {
    if (certificateDetails.length > 0) {
      setTemplateSelected(certificateDetails[0]);
      console.log(Object.keys(certificateDetails[0]));
    }
  }, [certificateDetails]);

  const validateCertificate = () => {
    fetch().then((data) => {
      if (data.length === 0) navigate("/");
    });
  };

  const removeAndCapitalize = (text) => {
    var input = text;
    var output = input.replace(/_/g, " ").replace(/\w+/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
    return output;
  };

  return (
    <div className="container">
      <BoxGray>
        <ArrowLeftOutlined onClick={() => navigate("/")} /> Certificate Overview
      </BoxGray>
      <div className="course-details-container">
        <div className="course-details-gallery">
          <BoxGray>
            <div className="text-center">Holders</div>
            <div className="course-details-gallery-container max-height-gallery">
              {certificateDetails.length > 0 &&
                certificateDetails.map((item, index) => (
                  <div
                    className={
                      "certificate-template-gallery-item " +
                      (index === current
                        ? "certificate-template-gallery-item-active"
                        : "")
                    }
                    onClick={() => {
                      setDetails(false);
                      setTemplateSelected(item);
                      setCurrent(index);
                    }}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="text-center"> {item.receiver_name} </div>
                  </div>
                ))}

              {certificateDetails.length === 0 && (
                <div className="text-center">There are no holders yet</div>
              )}
            </div>
          </BoxGray>
        </div>
        <div className="course-details-content ">
          {Object.keys(templateSelected).length > 0 && (
            <BoxGray>
              <div className="container course-details-subtitle">
                Certificates Details
                {Object.keys(templateSelected).length > 0 && (
                  <>: {templateSelected.receiver_wallet}</>
                )}
              </div>
              <div className="course-details-gallery-container  max-height-content">
                {details ? (
                  <table>
                    <thead>
                      <th>Name</th>
                      <th>Value</th>
                    </thead>
                    <tbody>
                      {Object.keys(templateSelected).map((item) => (
                        <tr>
                          <td> {removeAndCapitalize(item)} </td>
                          <td> {templateSelected[item]} </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="certificate-details-preview-container course-details-gallery-container ">
                    <img
                      src={templateSelected.image}
                      alt={templateSelected.name}
                    />
                  </div>
                )}
              </div>
            </BoxGray>
          )}

          <div className="course-details-buttons-container">
            {Object.keys(templateSelected).length > 0 && (
              <button
                className="button-rounded course-details-buttons"
                onClick={() => setDetails(!details)}
              >
                View {details ? "Certificate" : "Details"}
              </button>
            )}
            <button
              className="button-rounded course-details-buttons"
              onClick={() => navigate("/newCertificate/" + contractAddress)}
            >
              Create New Certificate
            </button>

            {/* <button
              className="button-rounded course-details-buttons"
              onClick={() => navigate("/issueCertificate/" + contractAddress)}
            >
              Issue Certificate
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
