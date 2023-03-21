import {
  Arbitrum_Ethereum_DepositAddress,
  Arbitrum_TrancheMaster,
  DAI_E_DepositAddress,
  LSD_BenqiStrat,
  LSD_MasterWTF,
  LSD_TraderJoeStrat,
  LSD_TrancheMaster,
} from "./address";
import LSD_Finance from "./abis/LSD_Finance.json";
import MasterChef from "./abis/MasterChef.json";
import { Market, NETWORKS } from "../types";

type NETWORKS_TYPE = typeof NETWORKS[keyof typeof NETWORKS];
const NETWORK = "MAINNET" as NETWORKS_TYPE; //exposing network switch here, since this is the main control config,
//but since product is live, this should never change

export const MarketList: Market[] = [
  {
    portfolio: "YEGO Finance",
    network: 42161,
    wrap: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["AETH"],
    tokens: [],
    listingDate: "2023/03/14",
    tranches: [],
    trancheCount: 2,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: Arbitrum_TrancheMaster[NETWORK],
    abi: LSD_Finance.abi,
    masterChefAbi: MasterChef.abi, //do we even need this anymore??
    masterChefAddress: LSD_MasterWTF[NETWORK], //do we even need this anymore??
    pools: [],
    depositAssetAddress: Arbitrum_Ethereum_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    strategyFarms: [
      {
        farmName: "Farm 1",
        shares: 0.5,
        sAddress: LSD_BenqiStrat[NETWORK],
        apiKey: "qi_dai",
      },
      {
        farmName: "Farm 2",
        shares: 0.5,
        sAddress: LSD_TraderJoeStrat[NETWORK],
        apiKey: "joe_dai",
      },
    ],
    strategyBlurbs: ["YEGO Finance"],
    subgraphURL: "https://apiarbitrum.yego.finance/subgraphs/name/waterfall/arbitrum-usdc",
  },
];
