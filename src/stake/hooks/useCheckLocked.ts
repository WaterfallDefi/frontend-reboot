import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BigNumber from "bignumber.js";
import useVeWTFContract from "./useVeWTFContract";
import { Network } from "../../WaterfallDefi";

const checkLocked = async (contract: Contract, account: string) => {
  const tx = await contract.getLockData(account);
  return !new BigNumber(tx?.startTimestamp?._hex).isZero();
};

const useCheckLocked = (network: Network) => {
  const { account } = useWeb3React();
  const contract = useVeWTFContract(network);
  const handleCheckLocked = useCallback(async () => {
    if (account) return await checkLocked(contract, account);
    return false;
  }, [account, contract]);

  return { onCheckLocked: handleCheckLocked };
};

export default useCheckLocked;
