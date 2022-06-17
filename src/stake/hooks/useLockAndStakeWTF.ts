import { useCallback } from "react";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import useVeWTFContract from "./useVeWTFContract";
import { Network } from "../../WaterfallDefi";

const createLock = async (
  contract: Contract,
  amount: string,
  duration: number
) => {
  const _amount = utils.parseEther(amount.toString()).toString();
  const _duration = duration.toString();
  const tx = await contract.createLock(_amount, _duration);
  const receipt = await tx.wait();
  return receipt.status;
};

const useLockAndStakeWTF = (network: Network) => {
  const contract = useVeWTFContract(network); //has signer, no need to call account hook
  const handleLockAndStakeWTF = useCallback(
    async (amount: string, duration: number) => {
      const result = await createLock(contract, amount, duration);
      //   dispatch();
      return result;
    },
    [contract]
  );

  return { lockAndStakeWTF: handleLockAndStakeWTF };
};

export default useLockAndStakeWTF;
