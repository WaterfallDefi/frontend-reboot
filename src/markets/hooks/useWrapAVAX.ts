import { useMemo } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import WrapAVAXFalls from "../../config/abis/WrapAVAX.json";
import { WrapAVAXAddress } from "../../config/address";
import { NETWORKS } from "../../types";
import { Network } from "../../WaterfallDefi";

const useWrapAVAXContract = () => {
  const signer = getSigner();
  return useMemo(
    () =>
      getContract(
        WrapAVAXFalls.abi,
        WrapAVAXAddress[NETWORKS.MAINNET],
        Network.AVAX,
        signer
      ),
    [signer]
  );
};

export default useWrapAVAXContract;
