import WTFRewards from "../../config/abis/WTFRewards.json";
import VEWTF from "../../config/abis/VEWTF.json";
import VotingEscrow from "../../config/abis/VotingEscrow.json";
import FeeRewards from "../../config/abis/FeeRewards.json";

import { useEffect, useState } from "react";
import { multicall } from "../../hooks/getContract";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { FeeRewardsAddressBNB } from "../../config/address";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";
import { Network } from "../../WaterfallDefi";
import { NETWORKS } from "../../types";

const BIG_TEN = new BigNumber(10);

const BLOCK_TIME = (chainId: string) => {
  switch (chainId) {
    case "43114":
      return 1.98833333;
    case "97":
      return 3;
    case "56":
      return 3;
    default:
      return 3;
  }
};

export const useEarningTokenTotalSupply = (
  network: Network,
  tokenAddress: string
) => {
  const [totalSupply, setTotalSupply] = useState("");

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const fetchBalance = async () => {
      const calls = [
        {
          address: tokenAddress,
          name: "totalSupply",
        },
      ];
      const [_totalSupply] = await multicall(network, VEWTF.abi, calls);

      setTotalSupply(
        new BigNumber(_totalSupply[0]?._hex)
          .dividedBy(BIG_TEN.pow(18))
          .toFormat(4)
          .toString()
      );
    };

    fetchBalance();
  }, [network, tokenAddress, refreshCounter]);

  return totalSupply;
};
export const useStakingPool = (
  network: Network,
  tokenAddress: string,
  earningTokenAddress: string,
  account: string | null | undefined
) => {
  const [result, setResult] = useState({
    isPoolActive: false,
    totalStaked: "",
    userStaked: "",
    totalLocked: "",
    maxAPR: "",
    pendingBUSDReward: "",
    rewardPerBlock: "",
  });

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    console.log("hello");
    console.log(account);
    const fetchBalance = async () => {
      const calls = [
        {
          address: tokenAddress,
          name: "isPoolActive",
        },
        {
          address: tokenAddress,
          name: "pool",
        },
        {
          address: tokenAddress,
          name: "getAccountData",
          params: [account],
        },
      ];

      const [isPoolActive, pool, user] = account
        ? await multicall(network, WTFRewards.abi, calls)
        : await multicall(network, WTFRewards.abi, calls.slice(0, 2));

      const calls2 = [
        {
          address: earningTokenAddress,
          name: "totalLocked",
        },
      ];
      const [totalLocked] = await multicall(network, VotingEscrow.abi, calls2);

      const rewardPerBlock = new BigNumber(pool.rewardPerBlock?._hex).dividedBy(
        BIG_TEN.pow(18)
      );
      const totalVeWTF = new BigNumber(pool.totalStaked?._hex).dividedBy(
        BIG_TEN.pow(18)
      );
      const _totalVeWTF = new BigNumber(totalVeWTF).plus(2.4883);
      const blockTime = BLOCK_TIME(network.toString());

      const maxAPR = numeral(
        new BigNumber(2.4883)
          .dividedBy(_totalVeWTF)
          .times(rewardPerBlock)
          .times((60 / blockTime) * 60 * 24 * 365 * 100)
          .toString()
      ).format("0,0.[00]");

      let pendingBUSDReward = "";
      try {
        const calls3 = [
          {
            address: FeeRewardsAddressBNB[NETWORKS.MAINNET],
            // address: network === "bnb" ? FeeRewardsAddressBNB[NETWORK] : FeeRewardsAddressAVAX[NETWORK],
            name: "pendingRewardOf",
            params: [account],
          },
        ];
        const [pending] = await multicall(Network.BNB, FeeRewards.abi, calls3);
        // const [pending] =
        //   network === "avax" ? await multicall(FeeRewardsAbi, calls3) : await multicallBSC(FeeRewardsAbi, calls3);
        pendingBUSDReward = pending
          ? numeral(
              new BigNumber(pending.reward?._hex)
                .dividedBy(BIG_TEN.pow(18))
                .toString()
            ).format("0,0.[00]")
          : "";
      } catch (e) {
        console.error(e);
      }

      setResult({
        isPoolActive,
        totalStaked: new BigNumber(pool.totalStaked?._hex)
          .dividedBy(BIG_TEN.pow(18))
          .toFormat(4)
          .toString(), //total VeWTF
        userStaked: new BigNumber(user?.user.amount?._hex)
          .dividedBy(BIG_TEN.pow(18))
          .toFormat(4)
          .toString(),
        totalLocked: new BigNumber(totalLocked[0]?._hex)
          .dividedBy(BIG_TEN.pow(18))
          .toString(),
        maxAPR: maxAPR,
        pendingBUSDReward,
        rewardPerBlock: rewardPerBlock.toString(),
      });
    };

    if (account) fetchBalance();
  }, [tokenAddress, refreshCounter, account, network, earningTokenAddress]);

  return result;
};
