import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { getContract, getSigner } from "../../hooks/getContract";
import MasterChef from "../../config/abis/MasterChef.json";
import { Network } from "../../WaterfallDefi";

const useClaimAll = (network: Network, masterChefAddress: string) => {
  const { account } = useWeb3React();
  const signer = getSigner();

  const masterChefContract = useMemo(
    () => getContract(MasterChef.abi, masterChefAddress, network, signer),
    [network, signer, masterChefAddress]
  );
  const handleClaimAll = useCallback(
    async (
      _lockDurationIfLockNotExists: string,
      _lockDurationIfLockExists: string
    ) => {
      const tx = await masterChefContract.claimAll(
        _lockDurationIfLockNotExists,
        _lockDurationIfLockExists
      );

      const receipt = await tx.wait();

      //TODO: modals

      //TODO: update staked balance

      //   await claim(
      //     masterChefContract,
      //     dispatch,
      //     _lockDurationIfLockNotExists,
      //     _lockDurationIfLockExists
      //   );
      // account && dispatch(getPendingWTFReward({ account }));
      //   dispatch(updateUserStakedBalance(sousId, account));
    },
    [account, masterChefContract]
  );

  return { onClaimAll: handleClaimAll };
};

export default useClaimAll;
