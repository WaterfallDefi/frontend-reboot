import { useCallback, useEffect, useState } from "react";
import { Network } from "../../Yego";
import { useWeb3React } from "@web3-react/core";
import { multicall } from "../../hooks/getContract";
import BigNumber from "bignumber.js";
import { Web3Provider } from "@ethersproject/providers";
import numeral from "numeral";

const BIG_TEN = new BigNumber(10);

export const useFarmTokenPendingRewards = (
  network: Network,
  address: string,
  abi: any,
  farmTokenAddresses: string[]
) => {
  const [rewards, setRewards] = useState<string[]>([]);

  const { account } = useWeb3React<Web3Provider>();

  const fetchRewards = useCallback(async () => {
    if (!account) return;

    const calls = farmTokenAddresses.map((a) => {
      return {
        // hardcoded farmPool address for convenience
        address: address,
        name: "pendingRewardOf",
        params: [a, account],
      };
    });

    const [...rewardBalances] = await multicall(network, abi, calls);

    const bignumbers = rewardBalances.map((tb: BigNumber[]) => tb[0]);

    setRewards(
      bignumbers.map((v: any) =>
        numeral(new BigNumber(v._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[0000]")
      )
    );
  }, [account, network, farmTokenAddresses, abi, address]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards, farmTokenAddresses]);

  return { rewards, fetchRewards };
};
