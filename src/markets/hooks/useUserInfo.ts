import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { getContract, getSigner } from "../../hooks/getContract";
import { Network } from "../../WaterfallDefi";

const getUserInfo = async (contract: Contract, account: string | null | undefined) => {
  const autoRoll = await contract.userInfo(account);
  return autoRoll.isAuto;
};

const useUserInfo = (network: Network, trancheMasterAddress: string, abi: any) => {
  const { account } = useWeb3React();

  const signer = getSigner();

  const contract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [network, signer, trancheMasterAddress, abi]
  );

  const handleGetUserInfo = useCallback(async () => {
    if (!account) return;
    const result = await getUserInfo(contract, account);
    return result;
  }, [account, contract]);

  return {
    getUserInfo: handleGetUserInfo,
  };
};

export default useUserInfo;
