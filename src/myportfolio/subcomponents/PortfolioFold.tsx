import numeral from "numeral";
import React, { useState } from "react";
import BigNumber from "bignumber.js";
import useRedeemDirect from "../../markets/hooks/useRedeemDirect";
import { useTrancheBalance } from "../../markets/hooks/useTrancheBalance";
import useWithdraw from "../../markets/hooks/useWithdraw";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";

const BIG_TEN = new BigNumber(10);

const formatBigNumber2HexString = (bn: BigNumber) => {
  return "0x" + bn.toString(16);
};

type Props = {
  network: Network;
  trancheMasterAddress: string;
  masterWTFAddress: string;
  abi: any;
  totalAmount: string;
  totalAmounts: string[];
  assets: string[];
  isCurrentCycle: boolean;
  isPending: boolean;
  isActive: boolean;
  currentTranche: number;
  fee: string;
  isMulticurrency: boolean;
  autorollImplemented: boolean;
  trancheCount: number;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

function PortfolioFold(props: Props) {
  const {
    network,
    trancheMasterAddress,
    masterWTFAddress,
    abi,
    totalAmount,
    totalAmounts,
    assets,
    isCurrentCycle,
    isPending,
    isActive,
    currentTranche,
    fee,
    isMulticurrency,
    autorollImplemented,
    trancheCount,
    setModal,
    setMarkets,
  } = props;

  const { onRedeemDirect } = useRedeemDirect(network, trancheMasterAddress, abi, setModal, setMarkets);

  const { onWithdraw } = useWithdraw(network, trancheMasterAddress, abi, setModal, setMarkets);

  const { balance } = useTrancheBalance(network, trancheMasterAddress, abi, isMulticurrency);

  // const { getAutoroll, changeAutoroll } = useAutoroll(network, trancheMasterAddress);

  // const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);

  //TODO: handle tracking ALL multicurrency deposits for a specific held MC falls position
  // !isMulticurrency ? useTrancheBalance(trancheMasterAddress) : useAllMulticurrencyTrancheBalance(trancheMasterAddress, assets.length);

  const withdrawAll = async () => {
    // setWithdrawAllLoading(true);

    try {
      if (!balance) return;
      await onWithdraw(formatBigNumber2HexString(new BigNumber(balance).times(BIG_TEN.pow(18))));
    } catch (e) {
      console.error(e);
      setModal({
        state: Modal.Txn,
        txn: "",
        status: "REJECTED",
        message: "Withdraw Failed",
      });
    } finally {
      // setWithdrawAllLoading(false);
      setMarkets(undefined);
    }
  };

  const redeemDirect = async (i: number) => {
    setRedeemLoading(true);
    try {
      const result = await onRedeemDirect(i);
      setModal({
        state: Modal.Txn,
        txn: result.hash,
        status: "COMPLETED",
        message: "Claim Success",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setRedeemLoading(false);
      setMarkets(undefined);
    }
  };

  return (
    <div className="fold">
      <div className="wrapper">
        <div className="card">
          <div className="card-title">
            Principal +<u className="est-yield">Est. Yield</u>
          </div>
          <div className="card-value">
            {!isMulticurrency
              ? numeral(totalAmount).format("0,0.[0000]") + " " + assets
              : totalAmounts.map((a, i) => (
                  <span key={i}>
                    {numeral(a).format("0,0.[0000]")} {assets[i]}
                  </span>
                ))}
          </div>
          <div className="card-action">
            {isCurrentCycle && isPending && !redeemLoading && (
              <button onClick={() => redeemDirect(currentTranche)}>Redeem</button>
            )}
            {!isPending && !isActive && <button onClick={withdrawAll}>Withdraw All</button>}
          </div>
        </div>

        <div className="prompt">
          {/* Union */}
          <div>
            <p>
              After maturity, you can choose to withdraw all the principal + yield. The platform will charge a fee of
              (principal + all yield in the current period) x <span className="fee">{fee + "%"}</span>
            </p>
            <p>
              You can also select roll-deposit to the next cycle, and you can change the Tranche and amount during
              Roll-deposit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioFold;
