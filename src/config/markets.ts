import {
  DAI_E_DepositAddress,
  WAVAXDepositAddress,
  BUSDAddress,
  WBNB_Address,
  DAIFallsTrancheMasterAddress2,
  DAIFallsMasterWTFAddress2,
  DAIBenqiStrategyAddress2,
  DAITraderJoeStrategyAddress2,
  WAVAXFallsTrancheMasterAddress2,
  WAVAXFallsMasterWTFAddress2,
  WAVAXBenqiStrategyAddress2,
  WAVAXTraderJoeStrategyAddress2,
  BUSDTripleStratTrancheMasterAddress,
  BUSDTripleStratMasterWTFAddress,
  BUSDTriple_AlpacaStrategyAddress,
  BUSDTriple_VenusStrategyAddress,
  BUSDTriple_StargateStrategyAddress,
  BNB_Only_Falls_TrancheMasterAddress,
  BNB_Only_Falls_MasterWTFAddress,
  BNB_Only_Falls_AlpacaStrategyAddress,
  BNB_Only_Falls_VenusStrategyAddress,
  StargateBenqi_TrancheMasterAddress,
  StargateBenqi_MasterWTFAddress,
  StargateBenqi_StargateStrategyAddress,
  StargateBenqi_BenqiStrategyAddress,
  USDC_Address_AVAX,
} from "./address";
// import Tranches from "./abis/TrancheMaster.json";
// import MC_Tranches from "./abis/MC_TrancheMaster.json";
import AR_Tranches from "./abis/AR_TrancheMaster.json";
import MasterChef from "./abis/MasterChef.json";
import WTF from "./abis/WTF.json";
import AVAXTrancheMasterAutorollABI from "./abis/AVAXTrancheMasterAutoroll.json";
import { Market, NETWORKS } from "../types";

type NETWORKS_TYPE = typeof NETWORKS[keyof typeof NETWORKS];
const NETWORK = "MAINNET" as NETWORKS_TYPE; //exposing network switch here, since this is the main control config,
//but since product is live, this should never change

export const MarketList: Market[] = [
  {
    portfolio: "(New) BNB Falls",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["WBNB"], //changed to array for multicurrency
    tokens: [],
    listingDate: "2022/07/21",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BNB_Only_Falls_TrancheMasterAddress[NETWORK],
    abi: AR_Tranches.abi, //tranches has autoPrincipal even though autoroll not enabled, so must use autoroll ABI
    masterChefAbi: MasterChef.abi,
    masterChefAddress: BNB_Only_Falls_MasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: WBNB_Address[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTF.abi,
    // strategyAddress: StrategyAddress[NETWORK],
    // strategyAbi: StrategyAbi,
    strategyFarms: [
      {
        farmName: "Alpaca BNB",
        shares: 0.7,
        sAddress: BNB_Only_Falls_AlpacaStrategyAddress[NETWORK],
        apiKey: "alpaca_bnb",
      },
      {
        farmName: "Venus BNB",
        shares: 0.3,
        sAddress: BNB_Only_Falls_VenusStrategyAddress[NETWORK],
        apiKey: "venus_bnb",
      },
    ],
    subgraphURL: "https://api2.waterfalldefi.org/subgraphs/name/waterfall/bsc-alpVeBnb",
  },
  {
    portfolio: "DAI Falls (Autorolled)",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["DAI.e"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: DAIFallsTrancheMasterAddress2[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChef.abi,
    masterChefAddress: DAIFallsMasterWTFAddress2[NETWORK],
    pools: [],
    depositAssetAddress: DAI_E_DepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTF.abi,
    strategyFarms: [
      {
        farmName: "Benqi DAI.e",
        shares: 0.91,
        sAddress: DAIBenqiStrategyAddress2[NETWORK],
        apiKey: "qi_dai",
      },
      {
        farmName: "Trader Joe DAI.e",
        shares: 0.09,
        sAddress: DAITraderJoeStrategyAddress2[NETWORK],
        apiKey: "joe_dai_e",
      },
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiJoe_dai",
    isRetired: false,
  },
  {
    portfolio: "AVAX Falls (Autorolled)",
    isAvax: true,
    wrapAvax: true,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["WAVAX"],
    tokens: [],
    listingDate: "2022/2/28",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: WAVAXFallsTrancheMasterAddress2[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChef.abi,
    masterChefAddress: WAVAXFallsMasterWTFAddress2[NETWORK],
    pools: [],
    depositAssetAddress: WAVAXDepositAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTF.abi,
    strategyFarms: [
      {
        farmName: "Benqi AVAX",
        shares: 0.7,
        sAddress: WAVAXBenqiStrategyAddress2[NETWORK],
        apiKey: "qi_avax",
      },
      {
        farmName: "Trader Joe AVAX",
        shares: 0.3,
        sAddress: WAVAXTraderJoeStrategyAddress2[NETWORK],
        apiKey: "joe_avax",
      },
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiJoe_avax",
    isRetired: false,
  },
  {
    portfolio: "BUSD Falls",
    isAvax: false,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["BUSD"],
    tokens: [],
    listingDate: "2022/4/25",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: BUSDTripleStratTrancheMasterAddress[NETWORK],
    abi: AR_Tranches.abi,
    masterChefAbi: MasterChef.abi,
    masterChefAddress: BUSDTripleStratMasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: BUSDAddress[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTF.abi,
    strategyFarms: [
      {
        farmName: "Alpaca BUSD",
        shares: 0.35,
        sAddress: BUSDTriple_AlpacaStrategyAddress[NETWORK],
        apiKey: "alpaca",
      },
      {
        farmName: "Venus BUSD",
        shares: 0.15,
        sAddress: BUSDTriple_VenusStrategyAddress[NETWORK],
        apiKey: "venus",
      },
      {
        farmName: "Stargate BUSD",
        shares: 0.5,
        sAddress: BUSDTriple_StargateStrategyAddress[NETWORK],
        apiKey: "stargate_bnb_busd",
      },
    ],
    subgraphURL: "https://apitest2.waterfalldefi.org/subgraphs/name/waterfall/bsc_test_alpVeStar",
    isRetired: false,
  },
  {
    portfolio: "USDC Falls",
    isAvax: true,
    wrapAvax: false,
    autorollImplemented: true,
    isMulticurrency: false,
    assets: ["USDC"],
    tokens: [],
    listingDate: "2022/5/20",
    tranches: [],
    trancheCount: 3,
    tvl: "",
    totalTranchesTarget: "",
    status: "",
    nextTime: "",
    address: StargateBenqi_TrancheMasterAddress[NETWORK],
    abi: AVAXTrancheMasterAutorollABI,
    masterChefAbi: MasterChef.abi,
    masterChefAddress: StargateBenqi_MasterWTFAddress[NETWORK],
    pools: [],
    depositAssetAddress: USDC_Address_AVAX[NETWORK],
    depositAssetAddresses: [],
    depositAssetAbi: WTF.abi,
    strategyFarms: [
      {
        farmName: "Stargate USDC",
        shares: 0.7,
        sAddress: StargateBenqi_StargateStrategyAddress[NETWORK],
        apiKey: "stargate_avax_usdc",
      },
      {
        farmName: "Benqi USDC",
        shares: 0.3,
        sAddress: StargateBenqi_BenqiStrategyAddress[NETWORK],
        apiKey: "qi_usdc",
      },
    ],
    subgraphURL: "https://api3.waterfalldefi.org/subgraphs/name/waterfall/qiStarUsdc",
    isRetired: false,
  },
];
