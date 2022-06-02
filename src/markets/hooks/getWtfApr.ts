import BigNumber from "bignumber.js";
import { Tranche } from "../../types";
import { Network } from "../../WaterfallDefi";

const BLOCK_TIME = (chainId: Network) => {
  switch (chainId) {
    case Network.AVAX:
      return 1.98833333;
    case Network.BNB:
      return 3;
    default:
      return 3;
  }
};

const getWTFApr = (
  network: Network,
  wtfAPY: string | undefined,
  tranche: Tranche | undefined,
  duration: string | undefined,
  rewardPerBlock: string | undefined,
  wtfPrice: string | null,
  assets?: string[] | null,
  coingeckoPrices?: any
) => {
  if (wtfAPY === undefined) return;
  if (tranche === undefined) return;
  if (duration === undefined) return;
  if (rewardPerBlock === undefined) return;
  if (wtfPrice === null) return;
  wtfAPY = wtfAPY.replace("+ ", "");

  let target = new BigNumber(tranche.target);
  let avaxPrice = 1;
  let wbnbPrice = 1;
  if (assets?.includes("WAVAX")) {
    avaxPrice = coingeckoPrices?.["wrapped-avax"]?.usd;
    target = target.times(avaxPrice);
  }

  if (assets?.includes("WBNB")) {
    wbnbPrice = coingeckoPrices?.["wbnb"]?.usd;
    target = target.times(wbnbPrice);
  }

  const chainId = network;
  const blockTime = BLOCK_TIME(chainId);
  const blocksInDuration = new BigNumber(duration).dividedBy(blockTime);
  const tokensInDuration = new BigNumber(blocksInDuration).times(
    rewardPerBlock
  );
  // (100 * 1) / 100000 * (365 * 86400) / 60018:27

  const wtfReward = new BigNumber(wtfAPY)
    // .dividedBy(new BigNumber(100))
    .times(tokensInDuration)
    .times(new BigNumber(wtfPrice))
    .dividedBy(target)
    .times(new BigNumber(86400 * 365))
    .dividedBy(duration)
    .toFormat(2)
    .toString();

  return wtfReward;
};

export const formatAllocPoint = (
  allocPoint: string | undefined,
  totalAllocPoints: string | undefined
) => {
  if (!allocPoint || !totalAllocPoints) return "- -";
  return (
    "+ " + Math.floor((parseInt(allocPoint) / parseInt(totalAllocPoints)) * 100)
  );
};

export default getWTFApr;
