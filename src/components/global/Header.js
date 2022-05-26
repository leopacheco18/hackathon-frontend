import { notification } from "antd";
import React, { useEffect } from "react";
import { useMoralis, useNewMoralisObject } from "react-moralis";
import { useLocation, useNavigate } from "react-router-dom";
import useAllowedList from "../../hooks/useAllowedList";
import { Loading } from "./Loading";

const Header = () => {
  const { isAuthenticated, logout, user } = useMoralis();
  const { save, isSaving } = useNewMoralisObject("AllowedList");
  const { isValid, validateAddress } = useAllowedList();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) validateAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (location.pathname === "/") {
    return <></>;
  }

  if (!isAuthenticated) {
    navigate("/");
  }

  const addWalletToAllowedList = () => {
    save({ ethAddress: user.get("ethAddress") }).then((r) => {
      if (r) {
        notification.success({
          description:
            "Your wallet is now on the allowed list. This page will reload in 3 seconds",
        });
        validateAddress();
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    });
  };

  return (
    <div className="container">
      {isSaving && <Loading />}
      <div className="header ">
        <div className="ellipse"></div>
        <div className="header-content">
          <div className="header-title" onClick={() => navigate("/")}>
            CertDefi
          </div>
          <div className="text-right signOut">
            {isValid === 2 && (
              <button
                className="button-rounded header-button mr-3"
                onClick={addWalletToAllowedList}
              >
                Add wallet to allowed list
              </button>
            )}
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
