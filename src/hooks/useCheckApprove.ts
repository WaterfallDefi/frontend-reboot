import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BigNumber from "bignumber.js";
import { getContract, getSigner } from "./getContract";
import ERC20 from "../config/abis/WTF.json";
import { Network } from "../WaterfallDefi";

const checkApprove = async (
  contract: Contract,
  trancheMasterAddress: string,
  account: string
) => {
  const tx = await contract.allowance(account, trancheMasterAddress);
  if (tx?._hex) return new BigNumber(tx?._hex).isZero() ? false : true;
};

const useCheckApprove = (
  network: Network,
  approveTokenAddress: string,
  trancheMasterAddress: string
) => {
  const { account } = useWeb3React();
  const signer = getSigner();
  const contract = getContract(ERC20.abi, approveTokenAddress, network, signer);

  const handleCheckApprove = useCallback(async () => {
    if (account)
      return await checkApprove(contract, trancheMasterAddress, account);
    return false;
  }, [account, contract, trancheMasterAddress]);

  return { onCheckApprove: handleCheckApprove };
};

export const useCheckApproveAll = (
  network: Network,
  approveTokenAddresses: string[],
  trancheMasterAddress: string
) => {
  const { account } = useWeb3React();
  const signer = getSigner();
  const contracts = approveTokenAddresses.map((a, i) =>
    getContract(ERC20.abi, a, network, signer)
  );

  const handleCheckApproveAll = useCallback(async () => {
    if (account) {
      for (let i = 0; i < approveTokenAddresses.length; i++) {
        const approved = await checkApprove(
          contracts[i],
          trancheMasterAddress,
          account
        );
        if (!approved) return false;
      }
      return true;
    }
  }, [account, contracts, approveTokenAddresses, trancheMasterAddress]);

  return { onCheckApproveAll: handleCheckApproveAll };
};

export default useCheckApprove;
