import {
  Arbitrum_MultiStrategy,
  Arbitrum_Rewards_Contract,
  Arbitrum_TrancheMaster,
  USDC_Address_Arbitrum,
} from "./address";

//latest abis
import YEGO_Finance from "./abis/YEGO_Finance.json";
import YEGO_RewardTokens from "./abis/YEGO_RewardTokens.json";
import YEGO_MultiStrategy from "./abis/YEGO_MultiStrategy.json";

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
        farmName: "Stargate",
        shares: 0.2,
        dataId: "stargate-finance",
        farmTokenContractAddress: "0x6694340fc020c5e6b96567843da2df01b2ce1eb6",
      },
      {
        farmName: "Hop Protocol",
        shares: 0.2,
        dataId: "hop-protocol",
        farmTokenContractAddress: "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
      },
      {
        farmName: "Curve",
        shares: 0.3,
        dataId: "curve-dao-token",
        farmTokenContractAddress: "0x11cdb42b0eb46d95f990bedd4695a6e3fa034978",
      },
      {
        farmName: "Convex",
        shares: 0.3,
        dataId: "convex-finance",
        farmTokenContractAddress: "0xb952a807345991bd529fdded05009f5e80fe8f45",
      },
    ],
    rewardsContract: Arbitrum_Rewards_Contract[NETWORK],
    multistrategyContract: Arbitrum_MultiStrategy[NETWORK],
    rewardsContractAbi: YEGO_RewardTokens.abi,
    multistrategyAbi: YEGO_MultiStrategy.abi,
    strategyBlurbs: ["YEGO Finance"],
    subgraphURL: "https://apiarbitrum.yego.finance/subgraphs/name/yego/arb-usdc",
  },
];
