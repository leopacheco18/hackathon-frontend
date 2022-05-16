import React from "react";
import { useMoralis } from "react-moralis";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout } = useMoralis();
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return <></>;
  }

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="container">
      <div className="header ">
        <div className="ellipse"></div>
        <div className="header-content">
          <div className="header-title" onClick={() => navigate("/")}>
            CertDefi
          </div>
          <div className="text-right signOut">
            <button className="button-rounded header-button" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
