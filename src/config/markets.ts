import {} from "./address";
// import Tranches from "./abis/TrancheMaster.json";
// import MC_Tranches from "./abis/MC_TrancheMaster.json";
// import AR_Tranches from "./abis/AR_TrancheMaster.json";
// import MasterChef from "./abis/MasterChef.json";
// import WTF from "./abis/WTF.json";
// import AVAXTrancheMasterAutorollABI from "./abis/AVAXTrancheMasterAutoroll.json";
import { Market, NETWORKS } from "../types";

type NETWORKS_TYPE = typeof NETWORKS[keyof typeof NETWORKS];
const NETWORK = "MAINNET" as NETWORKS_TYPE; //exposing network switch here, since this is the main control config,
//but since product is live, this should never change

export const MarketList: Market[] = [
  // {
  //   portfolio: "BNB Falls",
  //   network: 56,
  //   wrap: true,
  //   autorollImplemented: true,
  //   isMulticurrency: false,
  //   assets: ["WBNB"], //changed to array for multicurrency
  //   tokens: [],
  //   listingDate: "2022/07/21",
  //   tranches: [],
  //   trancheCount: 3,
  //   tvl: "",
  //   totalTranchesTarget: "",
  //   status: "",
  //   nextTime: "",
  //   address: BNB_Only_Falls_TrancheMasterAddress[NETWORK],
  //   abi: AR_Tranches.abi, //tranches has autoPrincipal even though autoroll not enabled, so must use autoroll ABI
  //   masterChefAbi: MasterChef.abi,
  //   masterChefAddress: BNB_Only_Falls_MasterWTFAddress[NETWORK],
  //   pools: [],
  //   depositAssetAddress: WBNB_Address[NETWORK],
  //   depositAssetAddresses: [],
  //   depositAssetAbi: WTF.abi,
  //   // strategyAddress: StrategyAddress[NETWORK],
  //   // strategyAbi: StrategyAbi,
  //   strategyFarms: [
  //     {
  //       farmName: "Alpaca BNB",
  //       shares: 0.7,
  //       sAddress: BNB_Only_Falls_AlpacaStrategyAddress[NETWORK],
  //       apiKey: "alpaca_bnb",
  //     },
  //     {
  //       farmName: "Venus BNB",
  //       shares: 0.3,
  //       sAddress: BNB_Only_Falls_VenusStrategyAddress[NETWORK],
  //       apiKey: "venus_bnb",
  //     },
  //   ],
  //   strategyBlurbs: [
  //     "Alpaca Finance is the largest lending protocol allowing leveraged yield farming on BNB Chain and Fantom. (https://www.alpacafinance.org)",
  //     "Venus enables users to utilize their cryptocurrencies by supplying collateral to the network that may be borrowed by pledging over-collateralized cryptocurrencies. (https://venus.io)",
  //   ],
  //   subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/bsc-bnb",
  // },
];
