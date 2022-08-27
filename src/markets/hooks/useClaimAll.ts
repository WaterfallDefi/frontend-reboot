import {
  useCallback,
  useMemo,
} from 'react';

import MasterChef from '../../config/abis/MasterChef.json';
import {
  getContract,
  getSigner,
} from '../../hooks/getContract';
import { Modal, ModalProps, Network } from '../../WaterfallDefi';

const useClaimAll = (network: Network, masterChefAddress: string, setModal: React.Dispatch<React.SetStateAction<ModalProps>>) => {
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

      setModal({
        state: Modal.Txn,
        txn: tx.hash,
        status: "SUBMITTED",
        message: "Claim Submitted",
      });

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setModal({
          state: Modal.Txn,
          txn: tx.hash,
          status: "COMPLETED",
          message: "Claim Success",
        });
      } else {
        setModal({
          state: Modal.Txn,
          txn: tx.hash,
          status: "REJECTED",
          message: "Claim Failed",
        });
      }
      //these aren't executed either in the original codebase:
      // account && dispatch(getPendingWTFReward({ account }));
      //   dispatch(updateUserStakedBalance(sousId, account));
    },
    [masterChefContract, setModal]
  );

  return { onClaimAll: handleClaimAll };
};

export default useClaimAll;
