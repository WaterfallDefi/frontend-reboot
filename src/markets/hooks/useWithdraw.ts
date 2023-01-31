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

  const handleWithdraw = useCallback(
    async (amount: string, multicurrencyAmount?: string[]) => {
      const tx = await trancheContract.queueWithdrawal(multicurrencyAmount ? multicurrencyAmount : amount);
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

      //TODO: update trancheBalance
      //TODO: update positions
      //   // account && dispatch(getTrancheBalance({ account }));
      //   market && account && dispatch(getPosition({ market, account }));

      // [account]
    },
    [trancheContract, setModal, setMarkets]
  );

  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
