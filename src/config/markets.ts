import {
  Arbitrum_Ethereum_DepositAddress,
  Arbitrum_Rewards_Contract,
  Arbitrum_TrancheMaster,
  LSD_BenqiStrat,
  LSD_MasterWTF,
  LSD_TraderJoeStrat,
  USDC_Address_Arbitrum,
} from "./address";
import LSD_Finance from "./abis/LSD_Finance.json";
import YEGO_Finance from "./abis/YEGO_Finance.json";
import YEGO_RewardTokens from "./abis/YEGO_RewardTokens.json";
import MasterChef from "./abis/MasterChef.json";
import { Market, NETWORKS } from "../types";

type NETWORKS_TYPE = (typeof NETWORKS)[keyof typeof NETWORKS];
const NETWORK = "MAINNET" as NETWORKS_TYPE; //exposing network switch here, since this is the main control config,
//but since product is live, this should never change

export const MarketList: Market[] = [
  {
    portfolio: "USDC Yego",
    network: 42161,
    wrap: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["USDC"],
    tokens: [],
    listingDate: "2023/03/14",
    tranches: [],
    trancheCount: 2,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: Arbitrum_TrancheMaster[NETWORK],
    abi: YEGO_Finance.abi,
    pools: [],
    depositAssetAddress: USDC_Address_Arbitrum[NETWORK],
    depositAssetAddresses: [],
    strategyFarms: [
      {
        farmName: "Hop Protocol",
        shares: 0.5,
        farmTokenContractAddress: "0x18aEd529b28e3eAd5197280851810FD0a064A9cF",
      },
      {
        farmName: "Stargate",
        shares: 0.5,
        farmTokenContractAddress: "0x29fD85019646c942285c939A654EFe9adD0F50ac",
      },
    ],
    rewardsContract: Arbitrum_Rewards_Contract[NETWORK],
    rewardsContractAbi: YEGO_RewardTokens.abi,
    strategyBlurbs: ["YEGO Finance"],
    subgraphURL: "https://apiarbitrum.yego.finance/subgraphs/name/yego/arb-usdc",
  },
];
