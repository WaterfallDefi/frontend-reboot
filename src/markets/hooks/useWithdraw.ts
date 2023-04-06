import React, { useCallback, useMemo } from "react";

import { getContract, getSigner } from "../../hooks/getContract";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";

const useWithdraw = (
  network: Network,
  trancheMasterAddress: string,
  abi: any, //too many different types of abis (autoroll, avax, multicurrency) this ensures accuracy,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>
) => {
  // const { account } = useWeb3React();

  const signer = getSigner();

  const trancheContract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [abi, trancheMasterAddress, network, signer]
  );

  const handleQueueWithdraw = useCallback(async () => {
    const tx = await trancheContract.queueWithdrawal();
    console.log("inside handle queue withdraw callback");
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      setModal({
        state: Modal.Txn,
        txn: tx.hash,
        status: "COMPLETED",
        message: "Queue Withdrawal Success",
      });
    } else {
      setModal({
        state: Modal.Txn,
        txn: tx.hash,
        status: "REVERTED",
        message: "Queue Withdrawal Failed",
      });
    }
  }, [trancheContract, setModal]);

  const handleWithdraw = useCallback(
    async (amount: string, multicurrencyAmount?: string[]) => {
      const tx = await trancheContract.withdraw(multicurrencyAmount ? multicurrencyAmount : amount);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setModal({
          state: Modal.Txn,
          txn: tx.hash,
          status: "COMPLETED",
          message: "Withdraw Success",
        });
      } else {
        setModal({
          state: Modal.Txn,
          txn: tx.hash,
          status: "REVERTED",
          message: "Withdraw Failed",
        });
      }

      setMarkets(undefined);

      //TODO?: update trancheBalance

      //TODO?: update positions
      //   // account && dispatch(getTrancheBalance({ account }));
      //   market && account && dispatch(getPosition({ market, account }));

      // [account]
    },
    [trancheContract, setModal, setMarkets]
  );

  return { onWithdraw: handleWithdraw, onQueueWithdraw: handleQueueWithdraw };
};

export default useWithdraw;
