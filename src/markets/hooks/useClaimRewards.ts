import React, { useCallback, useMemo } from "react";

import { getContract, getSigner } from "../../hooks/getContract";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";

const useClaimRewards = (
  network: Network,
  rewardsTokensAddress: string,
  abi: any, //too many different types of abis (autoroll, avax, multicurrency) this ensures accuracy,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>
) => {
  // const { account } = useWeb3React();

  const signer = getSigner();

  const rewardsTokensContract = useMemo(
    () => getContract(abi, rewardsTokensAddress, network, signer),
    [abi, rewardsTokensAddress, network, signer]
  );

  const handleClaimRewards = useCallback(async () => {
    //it's not this
    // const tx = await rewardsTokensContract.queueWithdrawal();
    // const receipt = await tx.wait();
    // if (receipt.status === 1) {
    //   setModal({
    //     state: Modal.Txn,
    //     txn: tx.hash,
    //     status: "COMPLETED",
    //     message: "Queue Withdrawal Success",
    //   });
    // } else {
    //   setModal({
    //     state: Modal.Txn,
    //     txn: tx.hash,
    //     status: "REVERTED",
    //     message: "Queue Withdrawal Failed",
    //   });
    // }
  }, [rewardsTokensContract, setModal]);

  return { onClaimRewards: handleClaimRewards };
};

export default useClaimRewards;
