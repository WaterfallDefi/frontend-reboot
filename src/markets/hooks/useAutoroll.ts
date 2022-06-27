import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import AutorollingTrancheMaster from "../../config/abis/AR_TrancheMaster.json";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const getAutoroll = async (
  contract: Contract,
  account: string | null | undefined
) => {
  const autoRoll = await contract.userInfo(account);
  return autoRoll.isAuto;
};

const getAutorollBalance = async (
  contract: Contract,
  account: string | null | undefined
) => {
  const autoRollBalance = await contract.balanceOf(account);
  return autoRollBalance;
};

const autoroll = async (contract: Contract, autoState: boolean) => {
  const tx = await contract.switchAuto(autoState);
  const receipt = await tx.wait();
  return receipt.status;
};

const useAutoroll = (network: Network, trancheMasterAddress: string) => {
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
    [network, signer, trancheMasterAddress]
  );

  const handleGetAutoroll = useCallback(async () => {
    if (!account) return;
    const result = await getAutoroll(contract, account);
    return result;
  }, [account, contract]);

  const handleGetAutorollBalance = useCallback(async () => {
    if (!account) return;
    const result = await getAutorollBalance(contract, account);
    return result;
  }, [account, contract]);

  const handleChangeAutoroll = useCallback(
    async (autoState: boolean) => {
      try {
        const result = await autoroll(contract, autoState);
        return result;
      } catch (e) {
        console.log(e);
      }
    },
    [contract]
  );

  return {
    getAutoroll: handleGetAutoroll,
    changeAutoroll: handleChangeAutoroll,
    getAutorollBalance: handleGetAutorollBalance,
  };
};

export default useAutoroll;
