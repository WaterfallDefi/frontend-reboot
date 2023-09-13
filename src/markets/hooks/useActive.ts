import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const getActiveOrNot = async (contract: Contract, account: string | null | undefined) => {
  const activeOrNot = await contract.active();
  return activeOrNot;
};

const useActive = (network: Network, trancheMasterAddress: string, abi: any) => {
  const { account } = useWeb3React();

  const signer = getSigner();

  const contract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [network, signer, trancheMasterAddress, abi]
  );

  const handleGetActiveOrNot = useCallback(async () => {
    if (!account) return;
    const result = await getActiveOrNot(contract, account);
    return result;
  }, [account, contract]);

  return {
    getActiveOrNot: handleGetActiveOrNot,
  };
};

export default useActive;
