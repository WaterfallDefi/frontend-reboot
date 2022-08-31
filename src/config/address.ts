import { NETWORKS } from "../types";

export const TranchesAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "54952856D5AAd556fB455fEdf5031C82D9f14889",
  [NETWORKS.TESTNET]: "d641dD6B44534bda3c7abbB718eC4e53947Dd994",
  // [NETWORKS.MAINNET]: "FDDA6514a13161a5a1724F8DD787d9d3faeC9557"
  // [NETWORKS.MAINNET]: "8060a28e41275a3181e8f96ab8dc65ebe8e119d7"
  [NETWORKS.MAINNET]: "171EE011C2A7d7A1b372eEaf502bcB6072e7a906", //avax
};

export const MasterChefAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "E6127428E7efBCC68d6C2e117C135386a7F11663",
  [NETWORKS.TESTNET]: "bFf5837e8606c730a1D53D6BE41741557d1bC1a0",
  // [NETWORKS.MAINNET]: "2a201B39EB0C50fA3eFA5cD1c66d0351bEF8E492" //avax
  [NETWORKS.MAINNET]: "Ee0C679c7e1D676ED919F97290D62dcCD4f4F853",
};

export const BUSDAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "9Ad6a4A86CAE27024F693C933488070a70b56f5E",
  [NETWORKS.TESTNET]: "8fac0A9CD6489EB1AF0E633ADcc540d4357E69c8",
  [NETWORKS.MAINNET]: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
};

export const DaiEPendingRewardLiquidFillChartAddress: {
  [network: string]: string;
} = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
};

//BNB staking addresses
export const WTFAddressBNB: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "7d892AcA63BcABd86C8eDc0a926B0ED344F395A4",
  [NETWORKS.TESTNET]: "4e373228174464cE8bA2946BF54f070fE846fB7a",
  [NETWORKS.MAINNET]: "d73F32833B6D5D9c8070c23e599e283a3039823C", //realWTF (March 24th mainnet)
};
export const WTFRewardsAddressBNB: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0x9be9bb36848CC9C2C447F9BEe078C4977C4FFd57",
  [NETWORKS.TESTNET]: "0xa6c819f1dd62579dcec2e2173b4ab6e4e22b7594",
  [NETWORKS.MAINNET]: "0x51CaA3657721cF9A1Fb068c3c01988A6387159ef", // realWTF (March 24th mainnet)
};
export const VeWTFAddressBNB: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0xD9c58DEF9280847082144Cd6B72B45b8F16964Ac",
  [NETWORKS.TESTNET]: "0xd7cec07ed863bd6843306cdc4bac8520aaa5db99",
  [NETWORKS.MAINNET]: "0x4df3Cc03FAfB2BCC139e23CD6fa6073a8F73E7c7", // realWTF (March 24th mainnet)
};
export const FeeRewardsAddressBNB: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0x14c4ec080ba871008797f9e6b20068de22756ad1",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x8964aA741BA592090149B4C451897F0Dcf94a150", // realWTF (March 24th mainnet)
};

//AVAX staking addresses
export const WTFAddressAVAX: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x873801Ae2ff12d816Db9a7B082F5796BEC64C82C",
};
export const WTFRewardsAddressAVAX: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xE94047709e4129D054a392e640953B5934de52d8",
};
export const VeWTFAddressAVAX: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xe3969906806AF7D97D4B483f22eb01EF6E53de8a",
};
export const FeeRewardsAddressAVAX: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x2c2a57e44320408f37d60E4f872C0757308A5118",
};

export const MultiSigAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x46D0C754463E3Bd07c1451CF4a683fEcD507d36B",
};
export const AVAXMultiSigAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x1ACC14EAf24F87835A9cc2F1F2DBcEEd1C7Fc324",
};

export const MulticallAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
  [NETWORKS.TESTNET]: "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
  // [NETWORKS.MAINNET]: "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
  [NETWORKS.MAINNET]: "0x0b78ad358dDa2887285eaD72e84b47242360b872", //avax
};

export const TestLPTokenAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0x727B439108B1ECc4493cA637254D78a581f0CC28",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0xE5d7E2993BfC33d5212281d4E8EfCE6634534A62"
  [NETWORKS.MAINNET]: "0x9e1c5417ee9312e7bDb53B2A19460F80001B5C1e", //test 21Dec
};
export const TestLPTokenAddressApe: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0x727B439108B1ECc4493cA637254D78a581f0CC28",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0xE5d7E2993BfC33d5212281d4E8EfCE6634534A62"
  [NETWORKS.MAINNET]: "0x9e1c5417ee9312e7bDb53B2A19460F80001B5C1e", //test 21Dec
};
export const TestLPRewardAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "0x1F854aBA48720407C64e674952512CDbea5d3c9A",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0x72adfcD18b21797696C499d6d964B2263e125223"
  [NETWORKS.MAINNET]: "0x969632553ff84fcae9b44Fd2C1bac572e0C916e1", //test 21Dec
};

export const DAIFallsTrancheMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test address
  // [NETWORKS.MAINNET]: "0x9c59d895A660F30C8B335AF3a26a371b17192382"
  //LIVE ADDRESS!
  [NETWORKS.MAINNET]: "0xa32290f53Fd616e1a0B2B2dFcfB843a112e959d1",
};
export const DAIFallsMasterWTFAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test address
  // [NETWORKS.MAINNET]: "0x11f21b204D224Bd955a9aEd302f68F0f87962c1B"
  //LIVE ADDRESS!
  [NETWORKS.MAINNET]: "0xb1fe3F585D0C787ad4Bf1A6B5D44A3c63C697228",
};
export const DAI_E_DepositAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
};
export const DAITraderJoeStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test address
  // [NETWORKS.MAINNET]: "0x6d4123fA5De696d459155B5978b9f33e87d1e5a2"
  //LIVE ADDRESS!
  [NETWORKS.MAINNET]: "0x3bF3942A2714ac8FF650F9043542E7C365b48Dfc",
};
export const DAIBenqiStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //LIVE ADDRESS!
  [NETWORKS.MAINNET]: "0x6ab6eCEF94a6695Bf414228264591F47Dc26474A",
};
export const WrapAVAXAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
};
export const WAVAXFallsTrancheMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test
  // [NETWORKS.MAINNET]: "0xA88C319D2947f54D728C9E95122A61E512cEF64e"
  [NETWORKS.MAINNET]: "0x12D7D07F9A1A659Be4E1E2945c8229B387840D2B",
};
export const WAVAXFallsMasterWTFAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test
  // [NETWORKS.MAINNET]: "0x7424F32E9B038555086d11cff17930e56AdE6979"
  [NETWORKS.MAINNET]: "0x71259FF0d07F5f784550b4c693c1FaeF0dDb0C04",
};
export const WAVAXDepositAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
};
export const WAVAXTraderJoeStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test
  // [NETWORKS.MAINNET]: "0xC986263a124fb36359B7b99F35E5E7bEEcD65579"
  [NETWORKS.MAINNET]: "0x25431344a6A2ff4626D4A24519336DB996EeF701",
};
export const WAVAXBenqiStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  //test
  // [NETWORKS.MAINNET]: "0x57c5a9808022aD244E1487F204A01349c90726f9"
  [NETWORKS.MAINNET]: "0xc6af16467151f6de1Cb7c91BF4A0403B7F5f07d4",
};

export const DAIFallsTrancheMasterAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x41EA3e25f4eE30C49657dF20564B3B0F21a172b5",
};
export const DAIFallsMasterWTFAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x3bbdC512aA10afDB9c0eB1598aAe7e7A1b9b1b11",
};

export const DAITraderJoeStrategyAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x6e415d39A83A5C542CF20182696Ff1F88094DA8E",
};
export const DAIBenqiStrategyAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xDb7804D5261E176B55A091bF7EFdc11Ea007828e",
};
export const WAVAXFallsTrancheMasterAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x852a59E83FeE95165006d00F83356139aebfCaC4",
};
export const WAVAXFallsMasterWTFAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x9cBCbBC0A4C9C877D671a2494310bb94a557D3ce",
};
export const WAVAXTraderJoeStrategyAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xA3EfCBA04a3CF91a4db28334506DB4020199D43F",
};
export const WAVAXBenqiStrategyAddress2: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x9bD0F0E513C73b15Db787c4D81f5Bb1DECbD3D74",
};

export const BULL_BUSDBNB_sALPACA_Address: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x8Db11C594122BD03d824188a83c36576E27c33C7",
};
export const BULL_USDTBNB_sALPACA_Address: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x05cFA583db088661caF3741f114435d08C118437",
};
export const BULL_BNB_TrancheMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0x920d4dB1232c08f52710B48B9aD2FF99a28aDC5a"
  [NETWORKS.MAINNET]: "0xCe7E8d95e1b6C4891a610BED1A612D2Ab2D3bf90",
};
export const BULL_BNB_WTFMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0xb9F79fEa374d191E3Ddf3E6E46243E999b20f786"
  [NETWORKS.MAINNET]: "0x97038a88718947d06D1b6d5520C9a21bA94C0f04",
};

export const BEAR_BNBBUSD_sALPACA_Address: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x317302610ab044Ba3151eb7202079d73e5d0534C",
};
export const BEAR_BNBUSDT_sALPACA_Address: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x875fb36Af9B33b15b1e3BcAE480e655d23036275",
};
export const BEAR_BNB_TrancheMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0xe53e38F14363212fB3B3f596C1Dc51003d3a2Be7"
  [NETWORKS.MAINNET]: "0xA124C3b6418FEd23aAc8c35B5C652b79281e5De9",
};
export const BEAR_BNB_WTFMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  // [NETWORKS.MAINNET]: "0x67169f619C60399EEa18FFa0F0C57866eAbFE69B"
  [NETWORKS.MAINNET]: "0x98C68d53CB9862Ee5A0bBF24A7B8EF2fB243c73E",
};

export const WBNB_Address: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
};
export const USDT_Address_BNB: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x55d398326f99059ff775485246999027b3197955",
};

//MARCH 25TH 2022 - FIRST LIVE AUTOROLL CONTRACT
export const BUSD4_TrancheMaster: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x4D364f4e813740D963b03D8c315d6F8c0e6b17E3",
};
export const BUSD4_MasterWTF: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xEac915BFe5D32a1DD39Aa2a1fD5Aac98d7d62aBA",
};
export const BUSD4_AlpacaStrat: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x3F1557da5638B509d295dc0Ab4139e50757fd38a",
};
export const BUSD4_VenusStrat: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xF7ea83A4E4AF2554e883af4e42c026c91644d544",
};

//april 28th stargate + alpaca + venus falls
export const BUSDTripleStratTrancheMasterAddress: {
  [network: string]: string;
} = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xf23D0b80Ca2e61F837B990c8D390F1327376E361",
};
export const BUSDTripleStratMasterWTFAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xFccE0005423Ed8c5EC37Cb315CF0c9ef597250EB",
};

export const BUSDTriple_AlpacaStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xbF6Edb397f3bF899b1D8463FD4aAf15C5502e0EE",
};
export const BUSDTriple_VenusStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x46dd0Dc25918730bb8528994B1E8abFd58fb9c8e",
};
export const BUSDTriple_StargateStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xfF106F62855984D474c8360E680D06350e3ca898",
};
export const BNB_Only_Falls_TrancheMasterAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x57B505d46a7B88e78C3C5b165DE7A7068cc4E0Da",
};

export const BNB_Only_Falls_MasterWTFAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xb56DCf1FF9fd986548B55DB65B215acc896f143E",
};

export const BNB_Only_Falls_AlpacaStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0xa32290f53Fd616e1a0B2B2dFcfB843a112e959d1",
};

export const BNB_Only_Falls_VenusStrategyAddress: { [network: string]: string } = {
  [NETWORKS.DEVNET]: "",
  [NETWORKS.TESTNET]: "",
  [NETWORKS.MAINNET]: "0x4961446Bd81c1420bd6901E50F951eeaCc5aC1d7",
};
