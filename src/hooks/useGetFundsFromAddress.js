import {  useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export const useGetFundsFromAddress = (contract) => {
    const { Moralis} = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const [funds, setFunds] = useState();

  const getFunds = async () => {
    const options = {
        chain: "mumbai",
        address: contract,
      };
      const balances = await Web3Api.account.getTokenBalances(options);
      let funds = 0;
      balances.forEach(item => {
          if(item.token_address.toLowerCase() === "0x326c977e6efc84e512bb9c30f76e30c160ed06fb"){
            funds = Moralis.Units.FromWei(item.balance, item.decimals);
          }
      })
      setFunds(funds)
  };


  return { getFunds, funds };
};
