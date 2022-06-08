import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";
import VotingEscrow from "../../config/abis/VotingEscrow.json";
import { useMemo } from "react";
import { NETWORKS } from "../../types";
import { VeWTFAddressAVAX, VeWTFAddressBNB } from "../../config/address";

const useVeWTFContract = (network: Network) => {
  const signer = getSigner();

  return useMemo(
    () =>
      getContract(
        VotingEscrow.abi,
        network === Network.BNB
          ? VeWTFAddressBNB[NETWORKS.MAINNET]
          : VeWTFAddressAVAX[NETWORKS.MAINNET],
        network,
        signer
      ),
    [network, signer]
  );
};

export default useVeWTFContract;
