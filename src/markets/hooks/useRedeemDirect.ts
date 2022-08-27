import { useCallback } from "react";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { ModalProps, Network } from "../../WaterfallDefi";
import { Market } from "../../types";

const redeem = async (contract: Contract, i: number) => {
  const tx = await contract.redeemDirect(i);
  const receipt = await tx.wait();
  return receipt.status;
};

const useRedeemDirect = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>
) => {
  const signer = getSigner();

  const contract = getContract(abi, trancheMasterAddress, network, signer);

  // const market = useSelectedMarket();
  const handleRedeemDirect = useCallback(
    async (i: number) => {
      const result = await redeem(contract, i);
      setMarkets(undefined);

      //   setModal({
      //     state: Modal.Txn,
      //     txn: tx.hash,
      //     status: "COMPLETED",
      //     message: "Deposit Success",
      //   });

      return result;
    },
    [contract, setMarkets]
  );

  return { onRedeemDirect: handleRedeemDirect };
};

export default useRedeemDirect;
