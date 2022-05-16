import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useNavigate } from "react-router-dom";
import BG from "../../assets/img/background.JPG";
import MetamaskIcon from "../../assets/img/Metamask-icon.png";
import "./Home.css";
import { notification } from "antd";

const Home = () => {
  const { authenticate, authError, isAuthenticated, logout } = useMoralis();
  const navigate = useNavigate();
  useEffect(() => {
    if (authError && authError.message) {
      notification.error({
        description: authError.message,
      });
    }
  }, [authError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/certificateOverview");
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="home-container">
        <img src={BG} alt="background" className="bg-image"></img>
        <div className="centered">
          <h1 className="home-title">CertDefi</h1>
        </div>
        <div className="top-right">
          {isAuthenticated ? (
            <button className="button-rounded metamask-button" onClick={logout}>
              Sign Out
            </button>
          ) : (
            <button
              className="button-rounded metamask-button"
              onClick={authenticate}
            >
              Connect your wallet
              <img
                className="metamask-icon"
                src={MetamaskIcon}
                alt="metamask icon"
              ></img>
            </button>
          )}
        </div>
      </div>
      <div className="home-container-content">
        <div>
          <h4 className="home-subtitle">About Us</h4>
          <div className="home-content"></div>
        </div>

        <div>
          <h4 className="home-subtitle">How To use CertDefi</h4>
          <div className="home-content"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
