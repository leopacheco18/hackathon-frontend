import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BoxGray from "../../components/global/BoxGray";
import "./CertificateOverview.css";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMoralisQuery, useMoralis, useNFTBalances } from "react-moralis";
import useAllowedList from "../../hooks/useAllowedList";

const CertificateOverview = () => {
  const navigate = useNavigate();
  const { user } = useMoralis();
  const { isValid, validateAddress } = useAllowedList();
  const { getNFTBalances } = useNFTBalances();
  const { fetch, data } = useMoralisQuery(
    "Course",
    (query) => query.equalTo("owner", user?.get("ethAddress")),
    [user],
    {
      autoFetch: false,
    }
  );

  useEffect(() => {
    if (user) validateAddress();
  }, [user]);

  useEffect(() => {
    if (user && user.get("ethAddress") && isValid === 1) {
      fetch();
      getNFTBalances({ chain: "matic" }).then((data) => {
        console.log(data);
      });
    }
  }, [user, isValid]);

  useEffect(() => {
    if (isValid === 2) {
      navigate("/holder");
    }
  }, [isValid]);

  if (isValid === 0) {
    return <></>;
  }
  return (
    <div className="container">
      <BoxGray>Certificate Overview</BoxGray>
      <br /> <br />
      <div className="certificate-overview-container">
        {data.map((item) => (
          <div
            className="certificate-overview-item"
            onClick={() =>
              navigate("/courseDetails/" + item.get("contractAddress"))
            }
          >
            <img
              className="certificate-overview-img"
              src={item.get("image")}
              alt={item.get("name")}
            />
            <h6 className="certificate-overview-name">{item.get("name")}</h6>
          </div>
        ))}

        <div
          className="certificate-overview-item"
          onClick={() => navigate("/newCourse")}
        >
          <div className="certificate-overview-img certificate-overview-add">
            <PlusCircleOutlined
              style={{ fontSize: "60px", color: "darkgray" }}
            />
          </div>
          <h6 className="certificate-overview-name"> Add course </h6>
        </div>
      </div>
      {/* <div className="certificate-overview-buttons-container">
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
      </div> */}
    </div>
  );
};

export default CertificateOverview;
