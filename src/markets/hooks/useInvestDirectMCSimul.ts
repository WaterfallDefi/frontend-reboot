import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { utils, BigNumber } from "ethers";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const _invest = async (
  contract: Contract,
  amount: string[],
  selectTrancheIdx: string
) => {
  const _amount = amount.map((a) =>
    BigNumber.from(utils.parseEther(a).toString()).toString()
  );
  const tx = await contract.investDirect(selectTrancheIdx, _amount, _amount);

  // dispatch(
  //   setConfirmModal({
  //     isOpen: true,
  //     txn: tx.hash,
  //     status: "SUBMITTED",
  //     pendingMessage: "Deposit Submitted",
  //   })
  // );
  // return tx.hash;
  const receipt = await tx.wait();

  if (receipt.status) {
    // dispatch(
    //   setConfirmModal({
    //     isOpen: true,
    //     txn: tx.hash,
    //     status: "COMPLETED",
    //     pendingMessage: "Deposit Success",
    //   })
    // );
  } else {
    // dispatch(
    //   setConfirmModal({
    //     isOpen: true,
    //     txn: tx.hash,
    //     status: "REJECTED",
    //     pendingMessage: "Deposit Failed",
    //   })
    // );
  }

  return receipt.status;
};

const useInvestDirectMCSimul = (
  network: Network,
  trancheMasterAddress: string,
  abi: any
) => {
  const signer = getSigner();

  const contract = getContract(abi, trancheMasterAddress, network, signer);

  const handleInvestDirectMCSimul = useCallback(
    async (amount: string[], selectTrancheIdx: string) => {
      const result = await _invest(contract, amount, selectTrancheIdx);
      // dispatch(getMarkets(MarketList));
      return result;
    },
    [contract]
  );

  return { onInvestDirectMCSimul: handleInvestDirectMCSimul };
};

export default useInvestDirectMCSimul;
