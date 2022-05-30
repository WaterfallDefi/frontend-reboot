import { ethers } from "ethers";
import Multicall from "../config/abis/Multicall.json";
import { Network } from "../WaterfallDefi";

export const getContract = (
  abi: any,
  address: string,
  network: Network,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  const simpleRpcProvider =
    network === Network.AVAX
      ? new ethers.providers.JsonRpcProvider(
          "https://api.avax.network/ext/bc/C/rpc"
        )
      : new ethers.providers.JsonRpcProvider(
          "https://bsc-dataseed.binance.org/"
        );
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getSigner = () => {
  if (window?.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if (signer) return signer;
  }
  return;
};

interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

const getMulticallContract = (
  network: Network,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  //turn into a switch case if we ever add a third chain
  const multicallAddress =
    network === Network.AVAX
      ? "0x0b78ad358dDa2887285eaD72e84b47242360b872"
      : "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c";

  return getContract(Multicall, multicallAddress, network, signer);
};

export const multicall = async <T = any>(
  network: Network,
  abi: any[],
  calls: Call[]
): Promise<T> => {
  try {
    const multi = getMulticallContract(network);
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);

    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call: any, i: number) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};
