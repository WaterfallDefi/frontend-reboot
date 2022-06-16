import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import AutorollingTrancheMaster from "../../config/abis/AR_TrancheMaster.json";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const getAutoRoll = async (
  contract: Contract,
  account: string | null | undefined
) => {
  const autoRoll = await contract.userInfo(account);
  return autoRoll.isAuto;
};

const getAutoRollBalance = async (
  contract: Contract,
  account: string | null | undefined
) => {
  const autoRollBalance = await contract.balanceOf(account);
  return autoRollBalance;
};

const autoRoll = async (contract: Contract, autoState: boolean) => {
  const tx = await contract.switchAuto(autoState);
  const receipt = await tx.wait();
  return receipt.status;
};

const useAutoRoll = (network: Network, trancheMasterAddress: string) => {
  const { account } = useWeb3React();

  const signer = getSigner();

  const contract = useMemo(
    () =>
      getContract(
        AutorollingTrancheMaster.abi,
        trancheMasterAddress,
        network,
        signer
      ),
    [network, signer]
  );

  const handleGetAutoRoll = useCallback(async () => {
    const result = await getAutoRoll(contract, account);
    return result;
  }, [account, contract]);

  const handleGetAutoRollBalance = useCallback(async () => {
    const result = await getAutoRollBalance(contract, account);
    return result;
  }, [account, contract]);

  const handleChangeAutoRoll = useCallback(
    async (autoState: boolean) => {
      try {
        const result = await autoRoll(contract, autoState);
        return result;
      } catch (e) {
        console.log(e);
      }
    },
    [account, contract]
  );

  return {
    getAutoRoll: handleGetAutoRoll,
    changeAutoRoll: handleChangeAutoRoll,
    getAutoRollBalance: handleGetAutoRollBalance,
  };
};

export default useAutoRoll;
