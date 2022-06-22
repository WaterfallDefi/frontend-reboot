import { useCallback } from 'react';

import {
  BigNumber,
  utils,
} from 'ethers';

import { Contract } from '@ethersproject/contracts';

import {
  getContract,
  getSigner,
} from '../../hooks/getContract';
import {
  Modal,
  ModalProps,
  Network,
} from '../../WaterfallDefi';

const invest = async (
  contract: Contract,
  amount: string,
  selectTrancheIdx: string,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
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

  setModal({
    state: Modal.Txn,
    txn: tx.hash,
    status: "SUBMITTED",
    message: "Deposit Submitted",
  });
  const receipt = await tx.wait();
  if (receipt.status === 1) {
    setModal({
      state: Modal.Txn,
      txn: tx.hash,
      status: "COMPLETED",
      message: "Deposit Success",
    });
  } else {
    setModal({
      state: Modal.Txn,
      txn: tx.hash,
      status: "REVERTED",
      message: "Deposit Failed",
    });
  }
  return receipt.status;
};

const useInvestDirect = (
  network: Network,
  trancheMasterAddress: string,
  abi: any,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number,
  isUSDC: boolean,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
) => {
  const signer = getSigner();

  const contract = getContract(abi, trancheMasterAddress, network, signer);

  const handleInvestDirect = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(
        contract,
        amount,
        selectTrancheIdx,
        multicurrencyIdx,
        multicurrencyTokenCount,
        isUSDC,
        setModal
      );
      // dispatch(getMarkets(MarketList));
      return result;
    },
    [contract, isUSDC, multicurrencyIdx, multicurrencyTokenCount, setModal]
  );

  return { onInvestDirect: handleInvestDirect };
};

export default useInvestDirect;
