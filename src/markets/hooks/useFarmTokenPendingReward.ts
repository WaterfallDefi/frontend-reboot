import { useCallback, useEffect, useState } from "react";
import { Network } from "../../WaterfallDefi";
import { useWeb3React } from "@web3-react/core";
import { multicall } from "../../hooks/getContract";
import BigNumber from "bignumber.js";
import { Web3Provider } from "@ethersproject/providers";
import FarmTokenContract from "../../config/abis/Farm_Token_Contract.json";
import numeral from "numeral";

const BIG_TEN = new BigNumber(10);

export const useFarmTokenPendingRewards = (network: Network, farmTokenAddresses: string[]) => {
  const [rewards, setRewards] = useState<string[]>([]);

  const { account } = useWeb3React<Web3Provider>();

  const fetchRewards = useCallback(async () => {
    if (!account) return;

    const calls = farmTokenAddresses.map((a) => {
      return {
        address: a,
        name: "pendingRewardOf",
        params: [account],
      };
    });

    const [...rewardBalances] = await multicall(network, FarmTokenContract.abi, calls);

    const bignumbers = rewardBalances.map((tb: BigNumber[]) => tb[0]);

    setRewards(
      bignumbers.map((v: any) =>
        numeral(new BigNumber(v._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[0000]")
      )
    );
  }, [account, network, farmTokenAddresses]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards, farmTokenAddresses]);

  return { rewards, fetchRewards };
};
