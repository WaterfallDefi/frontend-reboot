import { useCallback } from "react";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { Network } from "../../WaterfallDefi";
import useVeWTFContract from "./useVeWTFContract";

const increaseAmount = async (contract: Contract, amount: string) => {
  //   const _amount = amount.toString();
  const _amount = utils.parseEther(amount.toString()).toString();
  const tx = await contract.increaseAmount(_amount);
  const receipt = await tx.wait();
  return receipt.status;
};

const useIncreaseLockAmount = (network: Network) => {
  const contract = useVeWTFContract(network); //has signer
  const handleIncreaseLockAmount = useCallback(
    async (amount: string) => {
      const result = await increaseAmount(contract, amount);
      //   dispatch();
      return result;
    },
    [contract]
  );

  return { increaseLockAmount: handleIncreaseLockAmount };
};

export default useIncreaseLockAmount;
