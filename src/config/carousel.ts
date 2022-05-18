import { abi as AR_TranchesAbi } from "./abis/AR_TrancheMaster.json";
import AVAXTrancheMasterAutorollABI from "./abis/AVAXTrancheMasterAutoroll.json";
import { abi as TranchesAbi } from "./abis/TrancheMaster.json";
import { abi as MC_TranchesAbi } from "./abis/MC_TrancheMaster.json";

export const Carousel = [
  {
    address: "0x4D364f4e813740D963b03D8c315d6F8c0e6b17E3",
    network: "BSC",
    abi: AR_TranchesAbi,
    trancheCount: 3,
  },
  {
    address: "0x41EA3e25f4eE30C49657dF20564B3B0F21a172b5", //DAI Falls
    network: "AVAX",
    abi: AVAXTrancheMasterAutorollABI,
    trancheCount: 3,
  },

  {
    address: "0x852a59E83FeE95165006d00F83356139aebfCaC4", //AVAX Falls
    network: "AVAX",
    coin: "wavax",
    abi: AVAXTrancheMasterAutorollABI,
    trancheCount: 3,
  },
  {
    address: "0xd4BcafB934d417D533C5D06f084394205990a6Bc", //MAXI Falls
    network: "AVAX",
    abi: AVAXTrancheMasterAutorollABI,
    trancheCount: 3,
  },
  {
    address: "0xCe7E8d95e1b6C4891a610BED1A612D2Ab2D3bf90", //BNB Bull
    network: "BSC",
    coin: "wbnb",
    abi: MC_TranchesAbi,
    trancheCount: 2,
  },
  {
    address: "0xA124C3b6418FEd23aAc8c35B5C652b79281e5De9", //BNB Bear
    network: "BSC",
    coin: "wbnb",
    abi: TranchesAbi,
    trancheCount: 2,
  },
];
