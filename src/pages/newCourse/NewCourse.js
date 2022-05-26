import React, { useEffect, useState } from "react";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import helper from "./helperTemplate.json";
import "./NewCourse.css";
import { Input, Modal, notification } from "antd";
import { Loading } from "../../components/global/Loading";
import {
  useMoralis,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from "react-moralis";
import useAllowedList from "../../hooks/useAllowedList";
import abi from "./abi.json";

const NewCourse = () => {
  const navigate = useNavigate();
  const { isValid, validateAddress } = useAllowedList();
  const [templateSelected, setTemplateSelected] = useState(helper[0]);
  const [showEdit, setShowEdit] = useState(false);
  const [creationForm, setCreationFrom] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, enableWeb3 } = useMoralis();
  const { saveFile } = useMoralisFile();
  const { fetch, error } = useWeb3ExecuteFunction();

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
  }, [user]);

  useEffect(() => {
    if (isValid === 2) {
      navigate("/holder");
    }
  }, [isValid]);

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

  const getLines = (ctx, text, maxWidth) => {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const processImage = () => {
    if (!creationForm.course_name || !creationForm.course_description) {
      let errors = [];
      if (!creationForm.course_name)
        errors["course_name"] = "This field is required.";
      if (!creationForm.course_description)
        errors["course_description"] = "This field is required.";

      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

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

      context.font = "16px Pinyon Script";
      context.fillStyle = "gray";
      var descriptionString = creationForm.course_description;

      let descriptionArr = getLines(
        context,
        descriptionString,
        imageObj.width - 300
      );
      var lineheight = 15;

      for (var i = 0; i < descriptionArr.length; i++) {
        let descriptionWidth = context.measureText(descriptionArr[i]).width;
        context.fillText(
          descriptionArr[i],
          imageObj.width / 2 - descriptionWidth / 2,
          430 + i * lineheight
        );
      }

      canvas.remove();
      setCreationFrom({
        ...creationForm,
        img: canvas.toDataURL(),
      });
      setShowReview(true);
    };
    imageObj.setAttribute("crossOrigin", "anonymous");
    imageObj.src = templateSelected.image;
  };

  const capitalizeTitle = (txt) => {
    var input = txt;
    var output = input.replace(/\w+/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
    return output;
  };

  const getSymbol = (txt) => {
    var strings = txt;
    var i = 0;
    var character = "";
    var symbol = "";
    while (i <= strings.length) {
      character = strings.charAt(i);
      if (character === character.toUpperCase()) {
        symbol += character;
      }
      i++;
    }
    return symbol;
  };

  const saveCourse = () => {
    setLoading(true);
    let file = dataURLtoFile(
      creationForm.img,
      creationForm.course_name + "_preview.jpeg"
    );
    saveFile(creationForm.course_name + "_preview.jpeg", file, {
      saveIPFS: true,
    }).then(async (data) => {
      let dataToSave = { ...creationForm };
      dataToSave.ethAddress = user.get("ethAddress");
      dataToSave.img = data.ipfs();
      await enableWeb3();
      let name = capitalizeTitle(creationForm.course_name);
      let symbol = getSymbol(name);
      // let songsMetadata = [...metadataAllIPFS];
      let options = {
        abi: abi,
        contractAddress: "0x085d50e2ef8ec566244015B650b95BD5d6409D4D",
        functionName: "createNewCourse",
        params: {
          _name: name,
          _symbol: symbol,
          _image: dataToSave.img,
          _description: dataToSave.course_description,
        },
      };
      fetch({ params: options }).then((r) => {
        if (r) {
          setLoading(false);
          notification.success({
            description:
              "Your course have been created successfully. You will be redirect to home.",
          });
          setTimeout(() => {
            navigate("/");
          }, 3000);
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
            Are you ready to save your course?
            <button
              className="button-rounded certificate-template-buttons"
              onClick={saveCourse}
            >
              Save
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
              <div className="new-course-form-container">
                <p className="new-course-review-title">Course Details</p>

                <p className="new-course-review-address">
                  {creationForm.course_name}
                </p>
                <div className="certificate-template-preview-container certificate-template-gallery-container max-height-content">
                  <img src={creationForm.img} alt={templateSelected.name} />
                </div>
              </div>
            </BoxGray>
            <div className="text-center">
              <br />
              <button
                className="button-rounded certificate-template-buttons"
                onClick={showModal}
              >
                Save course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const changeForm = (e) => {
    setCreationFrom({ ...creationForm, [e.target.name]: e.target.value });
  };

  if (showEdit) {
    // to show form
    return (
      <div className="container">
        <BoxGray>
          <ArrowLeftOutlined onClick={() => setShowEdit(false)} /> Choose a
          Template
        </BoxGray>
        <div className="new-cetificate-form">
          <div>
            <BoxGray>
              <div className="new-course-form-container">
                Course Information
                <div className="new-course-input-group">
                  <label className="new-course-label">Course name</label>
                  <Input
                    name={"course_name"}
                    onChange={changeForm}
                    size="large"
                    value={creationForm["course_name"]}
                  />
                  {formErrors["course_name"] && (
                    <span className="new-course-error">
                      {formErrors["course_name"]}
                    </span>
                  )}
                </div>
                <div className="new-course-input-group">
                  <label className="new-course-label">Course description</label>
                  <Input.TextArea
                    rows={4}
                    name={"course_description"}
                    onChange={changeForm}
                    size="large"
                    value={creationForm["course_description"]}
                  />
                  {formErrors["course_description"] && (
                    <span className="new-course-error">
                      {formErrors["course_description"]}
                    </span>
                  )}
                </div>
                <div className="new-course-button-container">
                  <button
                    className="button-rounded certificate-template-buttons"
                    onClick={processImage}
                  >
                    Review Course
                  </button>
                </div>
              </div>
            </BoxGray>
          </div>
        </div>
      </div>
    );
  }

  // To show templates
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
              onClick={() => {
                setCreationFrom({});
                setFormErrors([]);
                setShowEdit(true);
              }}
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
