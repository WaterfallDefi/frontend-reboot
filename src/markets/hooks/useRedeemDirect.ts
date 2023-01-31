import { useCallback } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";
import { Market } from "../../types";

const useRedeemDirect = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>
) => {
  const signer = getSigner();

  const contract = getContract(abi, trancheMasterAddress, network, signer);

  const handleRedeemDirect = useCallback(
    async (i: number) => {
      const tx = await contract.redeemDirectPending(i);
      const receipt = await tx.wait();
      setMarkets(undefined);

      if (receipt.status === 1) {
        setModal({
          state: Modal.Txn,
          txn: tx.hash,
          status: "COMPLETED",
          message: "Deposit Success",
        });
      }

      return receipt.status;
    },
    [contract, setMarkets, setModal]
  );

  return { onRedeemDirect: handleRedeemDirect };
};

export default useRedeemDirect;
