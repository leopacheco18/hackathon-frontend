import React, { useState } from "react";
import BoxGray from "../../components/global/BoxGray";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import helper from "./helperTemplate.json";
import "./NewCertificate.css";
import { Steps, Input } from "antd";

const NewCertificate = () => {
  const navigate = useNavigate();
  const [templateSelected, setTemplateSelected] = useState(helper[0]);
  const [showEdit, setShowEdit] = useState(false);
  const { Step } = Steps;
  const [current, setCurrent] = useState(0);
  const [creationForm, setCreationFrom] = useState({});
  const [formErrors, setFormErrors] = useState([]);

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

  const steps = [
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

  const next = () => {
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
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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
              <div className="new-certificate-form-container">
                {steps[current].title}
                {steps[current].content.map((item) => (
                  <div className="new-certificate-input-group">
                    <label className="new-certificate-label">
                      {item.label}
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
                      onClick={() => alert("It's not working yet :)")}
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
              onClick={() => setShowEdit(true)}
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
