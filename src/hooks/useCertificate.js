import { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

export const useCertificate = (contract) => {
  const { fetch: fetchMoralis } = useWeb3ExecuteFunction();
  const { isInitialized, enableWeb3 } = useMoralis();
  const [certificateDetails, setCertificateDetails] = useState([]);

  useEffect(() => {
    if (isInitialized) {
      fetchCertificate();
    }
  }, [isInitialized, contract]);

  const fetchCertificate = async () => {
    await enableWeb3();
    let options = {
      abi: [
        {
          inputs: [],
          name: "emittedCount",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      contractAddress: contract,
      functionName: "emittedCount",
    };
    fetchMoralis({
      params: options,
      onSuccess: (data) => {
        getNTT(parseInt(data._hex, 16));
      },
      onError: console.log,
    });
  };

  const getNTT = async (item) => {
    let arr = [];
    while (item > 0) {
      item--;
      let options = {
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "tokenId", type: "uint256" },
            ],
            name: "tokenURI",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        contractAddress: contract,
        functionName: "tokenURI",
        params: {
          tokenId: item,
        },
      };
      await fetchMoralis({
        params: options,
        // eslint-disable-next-line no-loop-func
        onSuccess: async (data) => {
          let result = await fetch(data);
          arr.push(await result.json());
          if (item === 0) {
            setCertificateDetails(arr);
          }
        },
        onError: console.log,
      });
    }
  };

  return { fetchCertificate, certificateDetails };
};
