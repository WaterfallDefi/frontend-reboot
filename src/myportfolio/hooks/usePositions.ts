import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Market } from "../../types";
import { useEffect, useState } from "react";
import { multicall } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

export const usePositions = (marketList: Market[]) => {
  const { account } = useWeb3React<Web3Provider>();
  // const { slowRefresh } = useRefresh();
  const [result, setResult] = useState<any>([]);

  useEffect(() => {
    const fetchBalance = async () => {
      const _result = [];
      for (let i = 0; i < marketList.length; i++) {
        const calls = !marketList[i].isMulticurrency
          ? [
              {
                address: marketList[i].address,
                name: "userInvest",
                params: [account, 0],
              },
              {
                address: marketList[i].address,
                name: "userInvest",
                params: [account, 1],
              },
              ...(marketList[i].trancheCount === 3
                ? [
                    {
                      address: marketList[i].address,
                      name: "userInvest",
                      params: [account, 2],
                    },
                  ]
                : []),
            ]
          : [];
        if (marketList[i].isMulticurrency) {
          calls.push({
            address: marketList[i].address,
            name: "userCycle",
            params: [account],
          });
          marketList[i].depositAssetAddresses.forEach((a) => {
            calls.push(
              {
                address: marketList[i].address,
                name: "userInvest",
                params: [account, 0, a],
              },
              {
                address: marketList[i].address,
                name: "userInvest",
                params: [account, 1, a],
              },
              ...(marketList[i].trancheCount === 3
                ? [
                    {
                      address: marketList[i].address,
                      name: "userInvest",
                      params: [account, 2, a],
                    },
                  ]
                : [])
            );
          });
        }
        const userInvest = await multicall(marketList[i].network, marketList[i].abi, calls);
        // _result.push(userInvest);
        _result[i] = userInvest;
      }
      setResult(_result);
    };
    if (account) fetchBalance();
  }, [account, marketList]);

  return result;
};
