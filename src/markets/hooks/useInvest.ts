import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
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
    ? utils.parseEther(amount)
    : utils.parseUnits(amount, 6);
  const _zero = !isUSDC ? utils.parseEther("0") : utils.parseUnits("0", 6);
  let tx;
  if (multicurrencyIdx === -1) {
    tx = await contract.invest(selectTrancheIdx, _amount.toString(), false);
  } else {
    const _amountArray: BigNumber[] = [];
    for (let index = 0; index < multicurrencyTokenCount; index++) {
      _amountArray.push(BigNumber.from(_zero.toString()));
    }
    _amountArray[multicurrencyIdx] = BigNumber.from(_amount.toString());
    tx = await contract.invest(selectTrancheIdx, [..._amountArray], false);
  }
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

const useInvest = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean
) => {
  const { account } = useWeb3React();
  const signer = getSigner();
  const contract = getContract(abi, trancheMasterAddress, network, signer);

  const handleInvest = useCallback(
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
    [account, contract]
  );

  return { onInvest: handleInvest };
};

export default useInvest;
