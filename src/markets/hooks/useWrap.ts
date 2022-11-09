import { useMemo } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import WrapAVAX from "../../config/abis/WrapAVAX.json";
import WrapBNB from "../../config/abis/WrapBNB.json";
import { WrapAVAXAddress, WrapBNBAddress } from "../../config/address";
import { NETWORKS } from "../../types";
import { Network } from "../../WaterfallDefi";

const useWrapAVAXContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(WrapAVAX.abi, WrapAVAXAddress[NETWORKS.MAINNET], Network.AVAX, signer), [signer]);
};

export const useWrapBNBContract = () => {
  const signer = getSigner();
  return useMemo(() => getContract(WrapBNB.abi, WrapBNBAddress[NETWORKS.MAINNET], Network.BNB, signer), [signer]);
};

export default useWrapAVAXContract;
