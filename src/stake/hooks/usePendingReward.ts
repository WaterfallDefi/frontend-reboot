import { useEffect, useState } from "react";
import WTFRewards from "../../config/abis/WTFRewards.json";
import BigNumber from "bignumber.js";
import { multicall } from "../../hooks/getContract";
import numeral from "numeral";
import { Network } from "../../WaterfallDefi";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";

const BIG_TEN = new BigNumber(10);

export const usePendingReward = (
  network: Network,
  rewardTokenAddress: string,
  account: string | null | undefined
) => {
  const [result, setResult] = useState("");

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, 50000);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: rewardTokenAddress,
          name: "pendingReward",
          params: [account],
        },
      ];
      const [pendingReward] = await multicall(network, WTFRewards.abi, calls);

      setResult(
        numeral(
          new BigNumber(pendingReward.reward._hex)
            .dividedBy(BIG_TEN.pow(18))
            .toString()
        ).format("0,0.[0000]")
      );
    };
    if (account) fetchBalance();
  }, [rewardTokenAddress, refreshCounter, account, network]);

  return result;
};
