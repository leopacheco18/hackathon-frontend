import { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";

const useAllowedList = () => {
  const [isValid, setIsValid] = useState(0);
  const { user } = useMoralis();
  const { fetch } = useMoralisQuery(
    "AllowedList",
    (query) => query.fullText("ethAddress", user?.get("ethAddress")),
    [user],
    {
      autoFetch: false,
    }
  );

  const validateAddress = () => {
    fetch().then((data) => {
      if (data.length === 0) {
        setIsValid(2);
      } else {
        setIsValid(1);
      }
    });
  };

  return {
    validateAddress,
    isValid,
  };
};

export default useAllowedList;
