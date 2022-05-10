import { message } from "antd";
import React from "react";
import { useMoralis } from "react-moralis";

const Header = () => {
  const { authenticate, isAuthenticated, logout, user } = useMoralis();
  const getEllipsisTxt = (str, n = 4) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

  const copyToClipboard = () => {
    let temp = document.createElement("textarea");
    temp.value = user.get("ethAddress");
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    message.success("Copy to clipboard");
  };

  return (
    <div className="header">
      <div className="header-content">
        {isAuthenticated ? (
          <>
            <button className="metamask-button" onClick={copyToClipboard}>
              {getEllipsisTxt(user.get("ethAddress"))}
            </button>
            <button className="metamask-button ml-3" onClick={logout}>
              LogOut
            </button>
          </>
        ) : (
          <button className="metamask-button" onClick={authenticate}>
            Login With Metamask
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
