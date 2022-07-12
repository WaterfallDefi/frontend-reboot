import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Market } from "../../types";
import { useEffect, useState } from "react";
import { multicall } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

export const usePositions = (network: Network, marketList: Market[]) => {
  const { account } = useWeb3React<Web3Provider>();
  // const { slowRefresh } = useRefresh();
  const [result, setResult] = useState<any>([]);

  const [filteredMarketList] = useState<Market[]>(
    network === Network.AVAX ? marketList.filter((m) => m.isAvax) : marketList.filter((m) => !m.isAvax)
  );

  useEffect(() => {
    const fetchBalance = async () => {
      const _result = [];
      for (let i = 0; i < filteredMarketList.length; i++) {
        const calls = !filteredMarketList[i].isMulticurrency
          ? [
              {
                address: filteredMarketList[i].address,
                name: "userInvest",
                params: [account, 0],
              },
              {
                address: filteredMarketList[i].address,
                name: "userInvest",
                params: [account, 1],
              },
              ...(filteredMarketList[i].trancheCount === 3
                ? [
                    {
                      address: filteredMarketList[i].address,
                      name: "userInvest",
                      params: [account, 2],
                    },
                  ]
                : []),
            ]
          : [];
        if (filteredMarketList[i].isMulticurrency) {
          calls.push({
            address: filteredMarketList[i].address,
            name: "userCycle",
            params: [account],
          });
          filteredMarketList[i].depositAssetAddresses.forEach((a) => {
            calls.push(
              {
                address: filteredMarketList[i].address,
                name: "userInvest",
                params: [account, 0, a],
              },
              {
                address: filteredMarketList[i].address,
                name: "userInvest",
                params: [account, 1, a],
              },
              ...(filteredMarketList[i].trancheCount === 3
                ? [
                    {
                      address: filteredMarketList[i].address,
                      name: "userInvest",
                      params: [account, 2, a],
                    },
                  ]
                : [])
            );
          });
        }
        const userInvest = await multicall(network, filteredMarketList[i].abi, calls);
        // _result.push(userInvest);
        _result[i] = userInvest;
      }

      setResult(_result);
    };
    if (account) fetchBalance();
  }, [network, filteredMarketList, account]);

  return result;
};
