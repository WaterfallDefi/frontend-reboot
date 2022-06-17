import { useCallback } from "react";
import { Contract } from "@ethersproject/contracts";
import { utils, BigNumber } from "ethers";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const invest = async (
  contract: Contract,
  amount: string,
  selectTrancheIdx: string,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean
) => {
  const _amount = !isUSDC
    ? utils.parseEther(amount).toString()
    : utils.parseUnits(amount, 6).toString();
  const _zero = !isUSDC
    ? utils.parseEther("0").toString()
    : utils.parseUnits(amount, 6).toString();
  let tx;
  if (multicurrencyIdx === -1) {
    tx = await contract.investDirect(_amount, selectTrancheIdx, _amount);
  } else {
    const _amountArray: BigNumber[] = [];
    for (let index = 0; index < multicurrencyTokenCount; index++) {
      _amountArray.push(BigNumber.from(_zero));
    }
    _amountArray[multicurrencyIdx] = BigNumber.from(_amount);
    tx = await contract.investDirect(
      selectTrancheIdx,
      _amountArray,
      _amountArray
    );
  }

  // dispatch(
  //   setConfirmModal({
  //     isOpen: true,
  //     txn: tx.hash,
  //     status: "SUBMITTED",
  //     pendingMessage: "Deposit Submitted",
  //   })
  // );
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

const useInvestDirect = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean
) => {
  const signer = getSigner();

  const contract = getContract(abi, trancheMasterAddress, network, signer);
  // let contract: Contract;
  // if (multicurrencyIdx === -1) {
  //   contract = useTrancheMasterContract(trancheMasterAddress);
  // } else {
  //   contract = useMulticurrencyTrancheMasterContract(trancheMasterAddress);
  // }
  const handleInvestDirect = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(
        contract,
        amount,
        selectTrancheIdx,
        multicurrencyIdx,
        multicurrencyTokenCount,
        isUSDC
      );
      // dispatch(getMarkets(MarketList));
      return result;
    },
    [contract, isUSDC, multicurrencyIdx, multicurrencyTokenCount]
  );

  return { onInvestDirect: handleInvestDirect };
};

export default useInvestDirect;
