import React, { useCallback, useMemo } from "react";

import { getContract, getSigner } from "../../hooks/getContract";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";

const useClaimRewards = (
  network: Network,
  rewardsTokensContractAddress: string,
  rewardsTokenAddress: string, //this should probably be an array of addresses when we can handle more than just stargate tokens
  abi: any, //too many different types of abis (autoroll, avax, multicurrency) this ensures accuracy,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>
) => {
  // const { account } = useWeb3React();

  const signer = getSigner();

  const rewardsTokensContract = useMemo(
    () => getContract(abi, rewardsTokensContractAddress, network, signer),
    [abi, rewardsTokensContractAddress, network, signer]
  );

  const handleClaimRewards = useCallback(async () => {
    const tx = await rewardsTokensContract.claimRewards([rewardsTokenAddress]);
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      setModal({
        state: Modal.Txn,
        txn: tx.hash,
        status: "COMPLETED",
        message: "Claim Rewards Success",
      });
    } else {
      setModal({
        state: Modal.Txn,
        txn: tx.hash,
        status: "REVERTED",
        message: "Claim Rewards Failed",
      });
    }
  }, [rewardsTokensContract, rewardsTokenAddress, setModal]);

  return { onClaimRewards: handleClaimRewards };
};

export default useClaimRewards;
