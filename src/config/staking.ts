import { NETWORKS } from "../types";
import { StakingConfig } from "../types";
import {
  WTFRewardsAddressBNB,
  VeWTFAddressBNB,
  WTFRewardsAddressAVAX,
  VeWTFAddressAVAX,
} from "./address";
const Stakings: StakingConfig[] = [
  {
    rewardTokenAddress: WTFRewardsAddressBNB[NETWORKS.MAINNET],
    earningTokenAddress: VeWTFAddressBNB[NETWORKS.MAINNET],
    name: "WTF - BNB",
  },
  {
    rewardTokenAddress: WTFRewardsAddressAVAX[NETWORKS.MAINNET],
    earningTokenAddress: VeWTFAddressAVAX[NETWORKS.MAINNET],
    name: "WTF - AVAX",
  },
];
export default Stakings;
