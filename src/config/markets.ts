import {
  Arbitrum_Ethereum_DepositAddress,
  Arbitrum_TrancheMaster,
  LSD_BenqiStrat,
  LSD_MasterWTF,
  LSD_TraderJoeStrat,
  USDC_Address_Arbitrum,
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
    abi: LSD_Finance.abi,
    masterChefAbi: MasterChef.abi, //we don't need this anymore
    masterChefAddress: LSD_MasterWTF[NETWORK], //we don't need this anymore
    pools: [],
    depositAssetAddress: USDC_Address_Arbitrum[NETWORK],
    depositAssetAddresses: [],
    strategyFarms: [
      {
        farmName: "Farm 1",
        shares: 0.5,
        sAddress: LSD_BenqiStrat[NETWORK], //we don't need this anymore
        apiKey: "qi_dai", // we don't need this anymore
      },
      {
        farmName: "Farm 2",
        shares: 0.5,
        sAddress: LSD_TraderJoeStrat[NETWORK], // we don't need this anymore
        apiKey: "joe_dai", // we don't need this anymore
      },
    ],
    strategyBlurbs: ["YEGO Finance"],
    subgraphURL: "https://apiarbitrum.yego.finance/subgraphs/name/waterfall/arbitrum-usdc",
  },
];
