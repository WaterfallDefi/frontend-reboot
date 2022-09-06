import numeral from "numeral";
import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import useAutoroll from "../../markets/hooks/useAutoroll";
import useRedeemDirect from "../../markets/hooks/useRedeemDirect";
import { useTrancheBalance } from "../../markets/hooks/useTrancheBalance";
import useWithdraw from "../../markets/hooks/useWithdraw";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";
import usePendingWTFReward from "../../markets/hooks/usePendingWTFReward";

const BIG_TEN = new BigNumber(10);

const formatBigNumber2HexString = (bn: BigNumber) => {
  return "0x" + bn.toString(16);
};

const formatNumberDisplay = (num: string | undefined, decimals = 18) => {
  if (!num) return "-";
  return numeral(new BigNumber(num).dividedBy(BIG_TEN.pow(decimals)).toFormat(4).toString()).format("0,0.[0000]");
  // .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

type Props = {
  network: Network;
  trancheMasterAddress: string;
  abi: any;
  totalAmount: string;
  totalAmounts: string[];
  assets: string[];
  isCurrentCycle: boolean;
  isPending: boolean;
  isActive: boolean;
  currentTranche: number;
  fee: string;
  isAvax: boolean;
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
    abi,
    totalAmount,
    totalAmounts,
    assets,
    isCurrentCycle,
    isPending,
    isActive,
    currentTranche,
    fee,
    isAvax,
    isMulticurrency,
    autorollImplemented,
    trancheCount,
    setModal,
    setMarkets,
  } = props;

  const { onRedeemDirect } = useRedeemDirect(network, trancheMasterAddress, abi, setModal, setMarkets);

  const { onWithdraw } = useWithdraw(network, trancheMasterAddress, abi, setModal, setMarkets);

  const { balance } = useTrancheBalance(network, trancheMasterAddress, abi, isMulticurrency);

  const { getAutoroll, changeAutoroll } = useAutoroll(network, trancheMasterAddress);

  const { tranchesPendingReward } = usePendingWTFReward(network, trancheMasterAddress, trancheCount);

  useEffect(() => {
    if (autorollImplemented) {
      getAutoroll().then((res) => {
        setAutoroll(res);
        setAutorollPending(false);
      });
    }
  }, [autorollImplemented, getAutoroll]);

  const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);

  const [autoroll, setAutoroll] = useState(false);
  const [autorollPending, setAutorollPending] = useState<boolean>(true);
  const [awaitingAutorollConfirm, setAwaitingAutorollConfirm] = useState<boolean>(false);

  //TODO: handle tracking ALL multicurrency deposits for a specific held MC falls position
  // !isMulticurrency ? useTrancheBalance(trancheMasterAddress) : useAllMulticurrencyTrancheBalance(trancheMasterAddress, assets.length);

  const withdrawAll = async () => {
    setWithdrawAllLoading(true);

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
      setWithdrawAllLoading(false);
    }
  };

  const redeemDirect = async (i: number) => {
    setRedeemLoading(true);
    try {
      const result = await onRedeemDirect(i);
      // successNotification("Redeem Success", "");
    } catch (e) {
      console.error(e);
    } finally {
      setRedeemLoading(false);
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
            {isCurrentCycle && isPending && <button onClick={() => redeemDirect(currentTranche)}>Redeem</button>}
            {!isPending && !isActive && <button onClick={withdrawAll}>Withdraw All Tranches</button>}
          </div>
          {autorollImplemented ? (
            <div className="autoroll-toggle">
              <span>Auto Rolling</span>
              {!autorollPending ? (
                <button
                  className={"autoroll-btn " + (autoroll ? "stop" : "start")}
                  // disabled={awaitingAutorollConfirm}
                  onClick={() => {
                    setAwaitingAutorollConfirm(true);
                    changeAutoroll(!autoroll).then((res) => {
                      getAutoroll().then((res2) => {
                        setAutoroll(res2);
                        setAwaitingAutorollConfirm(false);
                      });
                    });
                  }}
                >
                  {autoroll ? "Stop Autoroll" : "Start Autoroll"}
                </button>
              ) : null}
              <span className={"autoroll-lbl " + (autoroll ? "on" : "off")}>
                {awaitingAutorollConfirm ? "Switch Auto Txn Pending..." : "Autoroll: " + (autoroll ? "On" : "Off")}{" "}
              </span>
            </div>
          ) : null}
        </div>
        <div className="card">
          <div className="card-title">WTF Reward</div>
          <div className="card-value">
            {isCurrentCycle && isActive
              ? numeral(formatNumberDisplay(tranchesPendingReward[currentTranche])).format("0,0.[0000]")
              : "-"}{" "}
            WTF
          </div>
          <div className="card-action">
            <button>Claim</button>
          </div>
        </div>
        <div className="prompt">
          {/* Union */}
          <div>
            <p>
              After maturity, you can choose to withdraw all the principal + yield. The platform will charge a fee of
              (principal + all yield in the current period) x
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
