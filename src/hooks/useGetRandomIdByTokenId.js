import {  useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

export const useGetRandomIdByTokenId = () => {
  const { fetch: fetchMoralis } = useWeb3ExecuteFunction();
  const {  enableWeb3 } = useMoralis();
  const [randomId, setRandomId] = useState();


  const getRandomId = async (token_id, contract) => {
      setRandomId();
    await enableWeb3();
    let options = {
      abi: [
        {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_indexOfToken",
                "type": "uint256"
              }
            ],
            "name": "getRandomnessBasedOnId",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
          },
      ],
      contractAddress: contract,
      functionName: "getRandomnessBasedOnId",
      params: {
          _indexOfToken: token_id
      }
    };
    fetchMoralis({
      params: options,
      onSuccess: (data) => {
          setRandomId(parseInt(data._hex, 16));
      },
      onError: console.log,
    });
  };


  return { getRandomId, randomId };
};
