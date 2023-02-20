import { DAI_E_DepositAddress, LSD_BenqiStrat, LSD_MasterWTF, LSD_TraderJoeStrat, LSD_TrancheMaster } from "./address";
import LSD_Finance from "./abis/LSD_Finance.json";
import MasterChef from "./abis/MasterChef.json";
import { Market, NETWORKS } from "../types";

type NETWORKS_TYPE = typeof NETWORKS[keyof typeof NETWORKS];
const NETWORK = "MAINNET" as NETWORKS_TYPE; //exposing network switch here, since this is the main control config,
//but since product is live, this should never change

export const MarketList: Market[] = [
  {
    portfolio: "YEGO Finance",
    network: 43114,
    wrap: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["Dai.E"],
    tokens: [],
    listingDate: "2023/01/31",
    tranches: [],
    trancheCount: 2,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: LSD_TrancheMaster[NETWORK],
    abi: LSD_Finance.abi,
    masterChefAbi: MasterChef.abi, //do we even need this anymore??
    masterChefAddress: LSD_MasterWTF[NETWORK], //do we even need this anymore??
    pools: [],
    depositAssetAddress: DAI_E_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    strategyFarms: [
      {
        farmName: "Benqi",
        shares: 0.3,
        sAddress: LSD_BenqiStrat[NETWORK],
        apiKey: "qi_dai",
      },
      {
        farmName: "Trader Joe",
        shares: 0.7,
        sAddress: LSD_TraderJoeStrat[NETWORK],
        apiKey: "joe_dai",
      },
    ],
    strategyBlurbs: ["LSD (Liquid Staking Derivatives) Finance"],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/avax-dai-perp",
  },
];
