import { useCallback } from "react";
import { Contract } from "@ethersproject/contracts";
import useVeWTFContract from "./useVeWTFContract";
import { Network } from "../../WaterfallDefi";

const unstake = async (contract: Contract, account: string) => {
  // const _amount = utils.parseEther(amount.toString()).toString();
  const tx = await contract.unlock();
  const receipt = await tx.wait();
  return receipt.status;
};

const useUnstake = (network: Network) => {
  const contract = useVeWTFContract(network);
  const handleUnstake = useCallback(
    async (account: string) => {
      const result = await unstake(contract, account);
      //   dispatch();
      return result;
    },
    [contract]
  );

  return { unstake: handleUnstake };
};

export default useUnstake;
