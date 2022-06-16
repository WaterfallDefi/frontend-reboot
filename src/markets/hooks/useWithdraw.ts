import { useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Network } from "../../WaterfallDefi";
import { getContract, getSigner } from "../../hooks/getContract";

const useWithdraw = (
  network: Network,
  trancheMasterAddress: string,
  abi: any //too many different types of abis (autoroll, avax, multicurrency) this ensures accuracy
) => {
  const { account } = useWeb3React();

  const signer = getSigner();

  const trancheContract = useMemo(
    () => getContract(abi, trancheMasterAddress, network, signer),
    [abi, trancheMasterAddress, network, signer]
  );

  const handleWithdraw = useCallback(
    async (amount: string, multicurrencyAmount?: string[]) => {
      const tx = await trancheContract.withdraw(
        multicurrencyAmount ? multicurrencyAmount : amount
      );
      const receipt = await tx.wait();
      if (receipt.status) {
        // dispatch(
        //   setConfirmModal({
        //     isOpen: true,
        //     txn: tx.hash,
        //     status: "COMPLETED",
        //     pendingMessage: "Withdraw Success"
        //   })
        // );
      } else {
        // dispatch(
        //   setConfirmModal({
        //     isOpen: true,
        //     txn: tx.hash,
        //     status: "REJECTED",
        //     pendingMessage: "Withdraw Failed"
        //   })
        // );
      }

      //TO DO: refresh markets
      //   dispatch(getMarkets(MarketList));
      //   // account && dispatch(getTrancheBalance({ account }));
      //   market && account && dispatch(getPosition({ market, account }));
    },
    [account, trancheContract]
  );

  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
