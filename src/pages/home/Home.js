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
          <h4 className="home-subtitle">About the project</h4>
          <div className="home-content ">
            This project was created as part of the Chainlink Spring 2022
            Hackathon. We call it CertDefi even though there are no financial
            aspects involved. CertDefi illustrates a use case in which an
            educational institution issues certificates to its participants for
            attending one of its courses via the blockchain.
          </div>
        </div>

        <div className="disclaimer-margin">
          <h4 className="home-subtitle">Disclaimer</h4>
          <div className="home-content ">
            In our usecase, the participant (certificate holder) is informed
            that they are using a wallet address, which can be associated with
            their real name without any restrictions. A wallet which is to
            remain pseudo-anonymous for privacy reasons (doxxing) is not
            suitable for this application.
          </div>
        </div>

        <div>
          <h4 className="home-subtitle">About the team</h4>
          <div className="home-content ">
            The team formed in part via Patrick's gigantic course "Solidity,
            Blockchain, and Smart Contract Course - Beginner to Expert Python
            Tutorial" and its Github forum, and was joined by two more members
            on the first day of the hackathon.
          </div>
        </div>
        <div className="team-content">
          Team players are in alphabetical order: <br />
          cromewar#6054 <br />
          Nandi#3110 <br />
          nanobite#5247 <br />
          timo#3514 <br />
          tobythekiller01#4566
        </div>
      </div>
    </>
  );
};

export default Home;
