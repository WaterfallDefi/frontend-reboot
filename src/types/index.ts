import { Contract } from "web3-eth-contract";
import { Network } from "../WaterfallDefi";

export const PORTFOLIO_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
};
export interface Tranche {
  apy: string;
  fee: string;
  principal: string;
  target: string;
  autoPrincipal: string;
  validPercent?: string;
}
export interface Invest {
  cycle: string;
  principal: string;
}

export interface Pool {
  accRewardPerShare: string;
  allocPoint: string;
  lastRewardBlock: string;
  totalSupply: string;
}

export interface FarmConfig {
  lpTokenAddress: string;
  lpRewardAddress: string;
  name: string;
  logo1: string;
  logo2: string;
  lpButtonTitle: string;
  lpURL: string;
}

export interface Market {
  portfolio: string;
  network: Network;
  wrap?: boolean;
  autorollImplemented: boolean;
  isMulticurrency: boolean;
  assets: string[];
  tokens: Token[];
  listingDate: string;
  // lockupPeriod: string;
  duration?: string;
  actualStartAt?: string;
  cycle?: string;
  tranches: Tranche[];
  trancheCount: number;
  trancheInvests?: { type: "BigNumber"; hex: string }[][];
  totalTranchesTarget: string;
  tvl: string;
  status: string;
  nextTime: string;
  address: string;
  abi: any;
  contract?: Contract;
  pools: string[];
  totalAllocPoints?: string;
  depositAssetAddress: string;
  depositAssetAddresses: string[];
  depositAssetContract?: Contract;
  rewardPerBlock?: string;
  strategyFarms: StrategyFarm[];
  strategyBlurbs: string[];
  subgraphURL: string;
  isRetired?: boolean;
  //NEW - rewards contract address
  rewardsContract: string;
  //NEW - rewards contract abi
  rewardsContractAbi: any;
}
export type Token = {
  addr: string;
  strategy: string;
  percent: { type: "BigNumber"; hex: string };
};
export type StrategyFarm = {
  farmName: string;
  shares: number;
  dataId: string;
  farmTokenContractAddress: string;
};

export type UserInvest = {
  capital: string;
  cycle: number;
  harvestAt: number;
  id: string;
  investAt: number;
  owner: string;
  principal: string;
  tranche: number;
  interest: string;
  earningsAPY: string;
  MCprincipal: string[];
};

export type EthersCall = {
  address: string;
  name: string;
  params: any[];
};

export const NETWORKS = {
  DEVNET: "DEVNET",
  TESTNET: "TESTNET",
  MAINNET: "MAINNET",
};
