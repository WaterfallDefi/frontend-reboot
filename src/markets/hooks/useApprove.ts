import React, {
  useCallback,
  useMemo,
} from 'react';

import { utils } from 'ethers';

import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';

import ERC20 from '../../config/abis/WTF.json';
import {
  getContract,
  getSigner,
  multicall,
} from '../../hooks/getContract';
import {
  Modal,
  ModalProps,
  Network,
} from '../../WaterfallDefi';

const useERC20Contract = (network: Network, address: string) => {
  const signer = getSigner();
  return useMemo(
    () => getContract(ERC20.abi, address, network, signer),
    [signer, network, address]
  );
};

const approve = async (
  contract: Contract,
  address: string,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
) => {
  const tx = await contract.approve(
    address,
    //USDC
    address === "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" ||
      address === "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
      ? utils.parseUnits("999999999", 6)
      : utils.parseEther("999999999").toString()
  );
  setModal({
    state: Modal.Txn,
    txn: tx.hash,
    status: "SUBMITTED",
    message: "Approve Submitted",
  });
  const receipt = await tx.wait();
  if (receipt.status === 1) {
    setModal({
      state: Modal.Txn,
      txn: tx.hash,
      status: "COMPLETED",
      message: "Approve Success",
    });
  } else {
    setModal({
      state: Modal.Txn,
      txn: tx.hash,
      status: "REVERTED",
      message: undefined,
    });
  }
  return receipt;
};

const useApprove = (
  network: Network,
  approveTokenAddress: string,
  masterChefAddress: string,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>
) => {
  const { account } = useWeb3React();

  const contract = useERC20Contract(network, approveTokenAddress);

  const handleApprove = useCallback(async () => {
    if (account) {
      const receipt = await approve(contract, masterChefAddress, setModal);
      return receipt;
    }
  }, [account, contract, masterChefAddress]);

  return { onApprove: handleApprove };
};

export const useMultiApprove = (
  network: Network,
  approveTokenAddresses: string[],
  masterChefAddress: string
) => {
  const { account } = useWeb3React();

  const calls = approveTokenAddresses.map((a, i) => ({
    address: a,
    name: "approve",
    params: [
      masterChefAddress,
      //USDC
      a === "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" ||
      a === "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
        ? utils.parseUnits("999999999", 6) //we should add custom approval amounts...
        : utils.parseEther("999999999").toString(), //like seriously... HUGE security flaw!!
    ],
  }));

  const handleMultiApprove = useCallback(async () => {
    if (account) {
      try {
        await multicall(network, ERC20.abi, calls);
      } catch (e) {
        console.log(e);
      }
    }
  }, [account, network, calls]);

  return { onMultiApprove: handleMultiApprove };
};

export default useApprove;
