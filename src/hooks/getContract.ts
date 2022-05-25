import { ethers } from "ethers";
import Multicall from "../config/abis/Multicall.json";

export const getContract = (
  abi: any,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
    "https://api.avax-test.network/ext/bc/C/rpc"
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
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(
    Multicall,
    //FUJI TESTNET!!
    "0xccc75e78Dce6A20bCCa3a30deB23Cb4D23df993a",
    signer
  );
};

export const multicall = async <T = any>(
  abi: any[],
  calls: Call[]
): Promise<T> => {
  try {
    const multi = getMulticallContract();
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
