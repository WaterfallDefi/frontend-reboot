import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { multicall } from "../../hooks/getContract";
import MasterChef from "../../config/abis/MasterChef.json";
import { Network } from "../../WaterfallDefi";
import BigNumber from "bignumber.js";

const usePendingWTFReward = (
  network: Network,
  masterChefAddress: string,
  trancheCount: number
) => {
  const { account } = useWeb3React<Web3Provider>();
  const [totalPendingReward, setTotalPendingReward] = useState("0");
  const [tranchesPendingReward, setTranchesPendingReward] = useState<string[]>(
    []
  );
  //   const { slowRefresh } = useRefresh();
  //   const network = useNetwork();

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [];
      for (let i = 0; i < trancheCount; i++) {
        calls.push({
          address: masterChefAddress,
          name: "pendingReward",
          params: [account, i],
        });
      }
      const result = await multicall(network, MasterChef.abi, calls);
      let _pendingReward = new BigNumber(0);
      const _tranchesPendingReward = [];
      for (let i = 0; i < result.length; i++) {
        _pendingReward = _pendingReward.plus(new BigNumber(result[i][0]?._hex));
        _tranchesPendingReward.push(
          new BigNumber(result[i][0]?._hex).toString()
        );
      }
      setTotalPendingReward(_pendingReward.toString());
      setTranchesPendingReward(_tranchesPendingReward);
    };
    if (account) fetchBalance();
  }, [masterChefAddress, account, network]);

  return { totalPendingReward, tranchesPendingReward };
};

export default usePendingWTFReward;
