import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CourseDetails.css";
// import helper from "../certificateOverview/helper.json";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMoralis, useMoralisQuery, useWeb3Transfer } from "react-moralis";
import useAllowedList from "../../hooks/useAllowedList";
import { useCertificate } from "../../hooks/useCertificate";
import { useGetFundsFromAddress } from "../../hooks/useGetFundsFromAddress";
import { Input, message, Modal, notification } from "antd";
import { Loading } from "../../components/global/Loading";
import { useGetRandomIdByTokenId } from "../../hooks/useGetRandomIdByTokenId";
const CourseDetails = () => {
  const { contractAddress } = useParams();
  const { getFunds, funds } = useGetFundsFromAddress(contractAddress);
  const { isValid, validateAddress } = useAllowedList();
  const { user, Moralis } = useMoralis();
  const { certificateDetails } = useCertificate(contractAddress);
  const [details, setDetails] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fundsToAdd, setFundsToAdd] = useState(0);
  const [loading, setLoading] = useState(false);
  const { getRandomId, randomId } = useGetRandomIdByTokenId();

  const { fetch: fetchFunds } = useWeb3Transfer({
    amount: Moralis.Units.Token(fundsToAdd, 18),
    receiver: contractAddress,
    type: "erc20",
    contractAddress: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
  });

  const { fetch } = useMoralisQuery(
    "Courses",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    if (user) {
      validateAddress();
      getFunds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && user.get("ethAddress") && isValid === 1) {
      validateCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isValid]);

  useEffect(() => {
    if (certificateDetails.length > 0) {
      getRandomId(certificateDetails[0].token_id, contractAddress);
      setTemplateSelected(certificateDetails[0]);
    }
  }, [certificateDetails]);

  const addFunds = () => {
    if (fundsToAdd <= 0) {
      notification.error({
        description:
          "The amount: " + funds + " is invalid. Change it and try again.",
      });
      return;
    }
    setLoading(true);

    fetchFunds({
      onComplete: () => {
        setLoading(false);
      },
      onSuccess: (r) => {
        if (r) {
          notification.success({
            description:
              "The funds will be added in few seconds. This page will reload automatically in 3 seconds",
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      },
      onError: (r) => {
        if (r) {
          notification.error({
            description: r.message,
          });
        }
      },
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      {loading && <Loading />}
      <Modal
        title=""
        visible={isModalVisible}
        closable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="modal-confirmation"
        centered={true}
      >
        <div className="modal-confirmation-content">
          How much token LINK do you want to add?
          <Input
            type={"number"}
            className="w-100"
            min={0.01}
            onChange={(e) => setFundsToAdd(e.target.value)}
            step={0.01}
            size={"large"}
          />
          <span className="advice-funds">
            Recommended minimum amount: 1 Link
          </span>
          <div className="buttons-to-add-funds">
            <button
              className="button-rounded certificate-template-buttons"
              onClick={() => setIsModalVisible(false)}
            >
              Go Back
            </button>
            or
            <button
              className="button-rounded certificate-template-buttons"
              onClick={addFunds}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <BoxGray>
        <ArrowLeftOutlined onClick={() => navigate("/")} /> Certificate Overview
        <div className="show-balance">Balance: {funds} LINK</div>
      </BoxGray>
      <div className="course-details-container">
        <div className="course-details-gallery">
          <BoxGray>
            <div className="text-center">Holders</div>
            <div className="course-details-gallery-container max-height-gallery">
              {certificateDetails.length > 0 &&
                certificateDetails.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "certificate-template-gallery-item " +
                      (index === current
                        ? "certificate-template-gallery-item-active"
                        : "")
                    }
                    onClick={() => {
                      setDetails(false);
                      getRandomId(item.token_id, contractAddress);
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
                      {Object.keys(templateSelected).map((item, key) => {
                        if (item === "token_id") {
                          return <></>;
                        } else {
                          return (
                            <tr key={key}>
                              <td> {removeAndCapitalize(item)} </td>
                              <td> {templateSelected[item]} </td>
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
            {funds > 0 ? (
              <button
                className="button-rounded course-details-buttons"
                onClick={() => navigate("/newCertificate/" + contractAddress)}
              >
                Create New Certificate
              </button>
            ) : (
              <button
                className="button-rounded course-details-buttons"
                onClick={showModal}
              >
                Add Funds
              </button>
            )}

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
