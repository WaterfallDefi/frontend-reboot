import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import useVeWTFContract from "./useVeWTFContract";
import { Network } from "../../WaterfallDefi";

const extendLockTime = async (contract: Contract, duration: number) => {
  const tx = await contract.increaseTimeAndAmount("0", duration);
  const receipt = await tx.wait();
  return receipt.status;
};

const useExtendLockTime = (network: Network) => {
  const { account } = useWeb3React();
  const contract = useVeWTFContract(network);
  const handleExtendLockTime = useCallback(
    async (duration: number) => {
      const result = await extendLockTime(contract, duration);
      //   dispatch();
      return result;
    },
    [account, contract]
  );

  return { extendLockTime: handleExtendLockTime };
};

export default useExtendLockTime;
