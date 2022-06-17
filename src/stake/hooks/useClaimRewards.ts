import { useCallback, useMemo } from "react";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";
import WTFRewards from "../../config/abis/WTFRewards.json";
import {
  WTFRewardsAddressAVAX,
  WTFRewardsAddressBNB,
} from "../../config/address";
import { NETWORKS } from "../../types";

const useWTFRewardsContract = (network: Network) => {
  const signer = getSigner();

  return useMemo(
    () =>
      getContract(
        WTFRewards.abi,
        network === Network.BNB
          ? WTFRewardsAddressBNB[NETWORKS.MAINNET]
          : WTFRewardsAddressAVAX[NETWORKS.MAINNET],
        network,
        signer
      ),
    [network, signer]
  );
};

const claimRewards = async (contract: Contract) => {
  const tx = await contract.claimRewards();
  const receipt = await tx.wait();
  return receipt.status;
};

const useClaimRewards = (network: Network) => {
  const contract = useWTFRewardsContract(network); //has signer, doesn't need account
  const handleClaimReward = useCallback(async () => {
    const result = await claimRewards(contract);
    //   dispatch();
    return result;
  }, [contract]);

  return { claimRewards: handleClaimReward };
};

export default useClaimRewards;
