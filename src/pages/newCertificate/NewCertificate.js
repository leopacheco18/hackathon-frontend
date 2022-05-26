import React, { useEffect, useState } from "react";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import abi from "./abi.json";
import "./NewCertificate.css";
import { Input, Modal, notification } from "antd";
import {
  useMoralis,
  useMoralisFile,
  useMoralisQuery,
  useNewMoralisObject,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { Loading } from "../../components/global/Loading";
import useAllowedList from "../../hooks/useAllowedList";

const NewCertificate = () => {
  const { contractAddress } = useParams();
  const { saveFile } = useMoralisFile();
  const { user, enableWeb3 } = useMoralis();
  const { isValid, validateAddress } = useAllowedList();
  const { fetch: fetchContract, error } = useWeb3ExecuteFunction();
  const { save } = useNewMoralisObject("Certificate");

  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [creationForm, setCreationFrom] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fetch: fetchCertificate } = useMoralisQuery(
    "Certificate",
    (query) =>
      query
        .fullText(
          "receiver_wallet",
          creationForm["receiver_wallet"]
            ? creationForm["receiver_wallet"]
            : " "
        )
        .equalTo("courseAddress", contractAddress),
    [creationForm, contractAddress],
    {
      autoFetch: false,
    }
  );
  const { fetch, data } = useMoralisQuery(
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

  useEffect(() => {
    if (error && loading) {
      if (error.message) {
        notification.error({
          description: error.message,
        });
      } else {
        notification.error({
          description: "Something went wrong, please try again later.",
        });
      }
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (user) validateAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (isValid === 2) {
      navigate("/holder");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    if (user && user.get("ethAddress") && isValid === 1) {
      validateCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isValid]);

  const validateCertificate = () => {
    fetch().then((data) => {
      if (data.length === 0) navigate("/");
    });
  };

  if (isValid === 0) return <></>;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const processImage = () => {
    var canvas = document.createElement("canvas");
    canvas.id = "idCanvas";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
    var context = canvas.getContext("2d");

    var imageObj = new Image();

    imageObj.onload = function () {
      context.canvas.width = imageObj.width;
      context.canvas.height = imageObj.height;
      context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
      context.font = "40px Pinyon Script";
      context.fillStyle = "black";
      var textString = creationForm.receiver_name,
        textWidth = context.measureText(textString).width;

      context.fillText(textString, imageObj.width / 2 - textWidth / 2, 380);

      context.font = "16px Pinyon Script";
      context.fillStyle = "black";
      var dateString = formatDate(),
        dateWidth = context.measureText(dateString).width;
      context.fillText(dateString, imageObj.width / 2 - dateWidth / 2, 530);

      canvas.remove();
      setCreationFrom({
        ...creationForm,
        image: canvas.toDataURL(),
      });
      setShowReview(true);
    };
    imageObj.setAttribute("crossOrigin", "anonymous");
    imageObj.src = data[0].get("image");
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const uploadCertificate = () => {
    setLoading(true);
    let file = dataURLtoFile(
      creationForm.image,
      creationForm.receiver_wallet + "_" + contractAddress + "_preview.jpeg"
    );
    saveFile(
      creationForm.receiver_wallet + "_" + contractAddress + "_preview.jpeg",
      file,
      {
        saveIPFS: true,
      }
    ).then((img) => {
      let dataToSave = { ...creationForm };
      dataToSave.ethAddress = user.get("ethAddress");
      dataToSave.image = img.ipfs();
      dataToSave.name = data[0].get("name");
      dataToSave.description = data[0].get("description");

      saveFile(
        creationForm.receiver_wallet + "_" + contractAddress + "_metadata.json",
        { base64: btoa(JSON.stringify(dataToSave)) },
        { type: "base64", saveIPFS: true }
      ).then(async (metadata) => {
        if (metadata) {
          await enableWeb3();
          // let songsMetadata = [...metadataAllIPFS];
          let options = {
            abi: abi,
            contractAddress: contractAddress,
            functionName: "createCertificateAndSetToken",
            params: {
              _owner: dataToSave.receiver_wallet,
              _tokenURI: metadata.ipfs(),
            },
          };
          fetchContract({ params: options }).then((r, erro) => {
            if (r) {
              save({
                courseAddress: contractAddress,
                receiver_wallet: dataToSave.receiver_wallet,
              }).then((r) => {
                if (r) {
                  setLoading(false);

                  notification.success({
                    description:
                      "Your certificate have been minted successfully. You will be redirect to course detail",
                  });
                  setTimeout(() => {
                    navigate("/courseDetails/" + contractAddress);
                  }, 3000);
                }
              });
            }
          });
        }
      });
    });
  };

  if (showReview) {
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
            Are you ready to upload your certificate?
            <button
              className="button-rounded certificate-template-buttons"
              onClick={uploadCertificate}
            >
              Confirm & Upload
            </button>
            or
            <button
              className="button-rounded certificate-template-buttons"
              onClick={() => setIsModalVisible(false)}
            >
              Go Back
            </button>
          </div>
        </Modal>
        <BoxGray>
          <ArrowLeftOutlined onClick={() => setShowReview(false)} /> Review your
          Certificate
        </BoxGray>
        <div className="new-cetificate-form">
          <div>
            <BoxGray>
              <div className="new-certificate-form-container">
                <p className="new-certificate-review-title">
                  Certificate Details
                </p>

                <p className="new-certificate-review-address">
                  {creationForm.receiver_wallet}
                </p>
                <div className="certificate-template-preview-container certificate-template-gallery-container">
                  <img src={creationForm.image} alt={data[0].get("name")} />
                </div>
              </div>
            </BoxGray>
            <div className="text-center">
              <br />
              <button
                className="button-rounded certificate-template-buttons"
                onClick={showModal}
              >
                Upload Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstForm = [
    {
      label: "Title of qualification and, if applicable, title conferred",
      key: "qualification_title",
      required: true,
    },
    {
      label: "Main field(s) of study for the qualification",
      key: "study_fields",
      required: true,
    },
    {
      label: "Name and status of awarding institution",
      key: "awarding_institution",
      required: true,
    },
    {
      label: "Name and status of institution administering studies",
      key: "institution_administering_studies",
      required: false,
    },
    {
      label: "Language(s) of instruction/examination",
      key: "instruction_language",
      required: true,
    },
  ];

  const secondForm = [
    {
      label: "Level of qualification",
      key: "qualification_level",
      required: true,
    },
    {
      label: "Official length of the program",
      key: "program_official_length",
      required: true,
    },
    {
      label: "Access requirements",
      key: "access_requirements",
      required: false,
    },
  ];

  const thirdForm = [
    {
      label: "Mode of study",
      key: "study_mode",
      required: false,
    },
    {
      label: "Program requirements",
      key: "program_requirements",
      required: false,
    },
    {
      label:
        "Program details (e.g. modules or units studied), and the individual grades/marks/credits obtained",
      key: "program_details",
      required: false,
    },
    {
      label: "Grading scheme and, if available, grade distribution guidance",
      key: "grading_scheme",
      required: false,
    },
    {
      label: "Overall classification of the qualification",
      key: "overall_classification",
      required: false,
    },
  ];

  const fourthForm = [
    {
      label: "Access to further study",
      key: "access_further_study",
      required: false,
    },
    {
      label: "Professional status (if applicable)",
      key: "professional_status",
      required: false,
    },
  ];

  const receiverForm = [
    {
      label: "Receiver Name",
      key: "receiver_name",
      required: true,
    },
    {
      label: "Receiver Wallet",
      key: "receiver_wallet",
      required: true,
    },
  ];

  const steps = [
    {
      title: "Receiver information",
      content: receiverForm,
    },
    {
      title: "Identifying the qualification",
      content: firstForm,
    },
    {
      title: "Level of the qualification",
      content: secondForm,
    },
    {
      title: "Contents and results gained",
      content: thirdForm,
    },
    {
      title: "Function of the qualification",
      content: fourthForm,
    },
  ];

  const next = async () => {
    let errors = [];
    let isValid = true;
    steps[current].content.forEach((item) => {
      if (item.required && !creationForm[item.key]) {
        errors[item.key] = "This field is required.";
        isValid = false;
      }
    });
    setFormErrors(errors);
    if (!isValid) {
      return;
    }
    if (current === 0) {
      await fetchCertificate().then((r) => {
        if (r.length > 0) {
          errors["receiver_wallet"] =
            "There is already a certificate linked to this wallet";
          setFormErrors(errors);
          isValid = false;
        }
      });

      if (!isValid) {
        return;
      }
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const changeForm = (e) => {
    setCreationFrom({ ...creationForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <BoxGray>
        <ArrowLeftOutlined
          onClick={() => navigate("/courseDetails/" + contractAddress)}
        />{" "}
        Edit Details
      </BoxGray>
      <div className="new-cetificate-form">
        <div>
          <BoxGray>
            <div className="new-certificate-form-container">
              {steps[current].title}
              {steps[current].content.map((item) => (
                <div className="new-certificate-input-group">
                  <label className="new-certificate-label">
                    {item.label}
                    {item.required && <span className="text-danger"> * </span>}
                  </label>
                  <Input
                    name={item.key}
                    onChange={changeForm}
                    size="large"
                    value={creationForm[item.key]}
                  />
                  {formErrors[item.key] && (
                    <span className="new-certificate-error">
                      {formErrors[item.key]}
                    </span>
                  )}
                </div>
              ))}
              <div className="new-certificate-button-container">
                {current > 0 && (
                  <button
                    className="button-rounded certificate-template-buttons mr-3"
                    onClick={prev}
                  >
                    Prev
                  </button>
                )}

                {current === steps.length - 1 ? (
                  <button
                    className="button-rounded certificate-template-buttons"
                    onClick={processImage}
                  >
                    Review Certificate
                  </button>
                ) : (
                  <button
                    className="button-rounded certificate-template-buttons"
                    onClick={next}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </BoxGray>
        </div>
      </div>
    </div>
  );
};

export default NewCertificate;
