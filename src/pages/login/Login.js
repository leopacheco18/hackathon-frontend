import React from "react";
import { useNavigate } from "react-router-dom";
import BG from "../../assets/img/bg-login.jpg";
import "./login.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="login-container">
        <img src={BG} alt="background" className="bg-login-image"></img>
        <div className="top-left">
          <h1 className="login-title" onClick={() => navigate("/")}>
            CertDefi
          </h1>
        </div>
        <div className="centered">
          <div className="login-box">
            <h5 className="login-subtitle">Login to an existing account</h5>
            <input className="login-input" placeholder="your@mail.com" />
            <input className="login-input " placeholder="password" />
            <button className="button-rounded login-button mt-15">Login</button>
            <br /> <br />
            <h4 className="login-subtitle">or</h4>
            <button className="button-rounded login-button">
              Create an account
            </button>
          </div>
        </div>
        <div className="top-right">
          <button className="button-rounded headers-button mr-3">Create</button>
          <button
            className="button-rounded headers-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
