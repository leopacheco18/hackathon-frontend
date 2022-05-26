import { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction,
} from "react-moralis";

export const useHolderCertificates = () => {
  const { fetch: fetchMoralis } = useWeb3ExecuteFunction();
  const { isInitialized, enableWeb3, user } = useMoralis();
  const [certificateDetails, setCertificateDetails] = useState([]);
  const { fetch: fetchDB } = useMoralisQuery(
    "Certificate",
    (query) =>
      query.fullText("receiver_wallet", user ? user.get("ethAddress") : " "),
    [user],
    {
      autoFetch: false,
    }
  );
  useEffect(() => {
    if (isInitialized) {
      fetchCertificate();
    }
  }, [isInitialized]);

  const fetchCertificate = async () => {
    await enableWeb3();
    let arr = [];
    fetchDB().then((data) => {
      data.forEach((item) => {
        let options = {
          abi: [
            {
              inputs: [{ internalType: "address", name: "", type: "address" }],
              name: "OwnerToId",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          contractAddress: item.get("courseAddress"),
          functionName: "OwnerToId",
          params: {
            "": user.get("ethAddress"),
          },
        };
        fetchMoralis({
          params: options,
          onSuccess: (dataContract) => {
            arr.push({
              id: parseInt(dataContract._hex, 16),
              address: item.get("courseAddress"),
            });
            if (arr.length === data.length) {
              getNTT(arr);
            }
          },
          onError: console.log,
        });
      });
    });
  };

  const getNTT = async (arr) => {
    let arrAux = [];
    arr.forEach(async (item) => {
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
        contractAddress: item.address,
        functionName: "tokenURI",
        params: {
          tokenId: item.id,
        },
      };
      await fetchMoralis({
        params: options,
        // eslint-disable-next-line no-loop-func
        onSuccess: async (data) => {
          let urlArr = data.split("/");
          let ipfsHash = urlArr[urlArr.length - 1];
          let url = `https://gateway.moralisipfs.com/ipfs/${ipfsHash}`;
          let result = await fetch(url);
          arrAux.push(await result.json());
          if (arrAux.length === arr.length) {
            setCertificateDetails(arrAux);
          }
        },
        onError: console.log,
      });
    });
  };

  return { fetchCertificate, certificateDetails };
};
