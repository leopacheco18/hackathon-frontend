import React from "react";
import { useMoralis } from "react-moralis";
import BG from "../../assets/img/background.JPG";
import MetamaskIcon from "../../assets/img/Metamask-icon.png";
import "./Home.css";

const Home = () => {
  const { authenticate } = useMoralis();

  return (
    <div className="home-container">
      <img src={BG} alt="background" className="bg-image"></img>
      <div className="centered">
        <h1 className="home-title">CertDefi</h1>
        <button
          className="button-rounded metamask-button"
          onClick={authenticate}
        >
          Add a wallet
          <img
            className="metamask-icon"
            src={MetamaskIcon}
            alt="metamask icon"
          ></img>
        </button>
      </div>
      <div className="top-right">
        <button className="button-rounded headers-button mr-3">Create</button>
        <button className="button-rounded headers-button">Login</button>
      </div>
    </div>
  );
};

export default Home;
