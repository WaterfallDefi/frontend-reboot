import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { Market } from "../../types";
import { Modal, ModalProps } from "../../WaterfallDefi";
import useWithdraw from "../hooks/useWithdraw";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import useUserInfo from "../hooks/useUserInfo";
import Arrow from "../svgs/Arrow";
import { usePositions } from "../../myportfolio/hooks/usePositions";
import { MarketList } from "../../config/markets";
import useRedeemDirect from "../hooks/useRedeemDirect";

type Props = {
  // network: Network;
  selectedMarket: Market;
  // coingeckoPrices: any;
  selectedDepositAssetIndex: number;
  balance: string | string[];
  invested: string | string[]; //prepare for multicurrency
  // simulDeposit: boolean;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

const BIG_TEN = new BigNumber(10);

const formatBigNumber2HexString = (bn: BigNumber) => {
  return "0x" + bn.toString(16);
};

function ClaimRedeposit(props: Props) {
  const {
    // network,
    selectedMarket,
    // coingeckoPrices,
    selectedDepositAssetIndex,
    balance,
    invested,
    // simulDeposit,
    setModal,
    setMarkets,
  } = props;

  const [withdrawalQueued, setWithdrawalQueued] = useState(false);
  const [withdrawalQueuedPending, setWithdrawalQueuedPending] = useState(true);

  const positions = usePositions(MarketList);

  const fixedPendingEntry =
    positions.length > 0
      ? numeral(new BigNumber(positions[0][2][0]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[000000]")
      : "-";

  const degenPendingEntry =
    positions.length > 0
      ? numeral(new BigNumber(positions[0][3][0]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[000000]")
      : "-";

  const { onWithdraw, onQueueWithdraw } = useWithdraw(
    selectedMarket.network,
    selectedMarket.address,
    selectedMarket.abi,
    setModal,
    setMarkets
  );

  const { onRedeemDirect } = useRedeemDirect(
    selectedMarket.network,
    selectedMarket.address,
    selectedMarket.abi,
    setModal,
    setMarkets
  );

  const { account } = useWeb3React<Web3Provider>();

  const { getUserInfo } = useUserInfo(selectedMarket.network, selectedMarket.address, selectedMarket.abi);

  useEffect(() => {
    if (withdrawalQueuedPending) {
      getUserInfo().then((res) => {
        setWithdrawalQueued(!res); //isAuto true = invested, isAuto false = withdrawal queued
        setWithdrawalQueuedPending(false);
      });
    }
  }, [getUserInfo, withdrawalQueuedPending]);

  const withdrawAll = async () => {
    // setWithdrawAllLoading(true);

    setModal({
      state: Modal.Txn,
      txn: undefined,
      status: "PENDING",
      message: "Withdrawing",
    });
    try {
      if (!balance) return;
      await onWithdraw(
        formatBigNumber2HexString(
          !(balance instanceof Array) ? new BigNumber(balance).times(BIG_TEN.pow(18)) : new BigNumber(0)
        ),
        balance instanceof Array ? balance : undefined
      );
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "SUCCESS",
        message: "Withdraw Success",
      });
    } catch (e) {
      console.error(e);
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Withdraw Fail ",
      });
    } finally {
      // setWithdrawAllLoading(false);
    }
  };

  const queueWithdrawAll = async () => {
    // setWithdrawAllLoading(true);

    setModal({
      state: Modal.Txn,
      txn: undefined,
      status: "PENDING",
      message: "Queueing Withdrawal",
    });
    try {
      if (!balance) return;
      await onQueueWithdraw;
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "SUCCESS",
        message: "Queue Withdrawal Success",
      });
    } catch (e) {
      console.error(e);
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Queue Withdrawal Failed ",
      });
    } finally {
      // setWithdrawAllLoading(false);
    }
  };

  const redeemPending = async (trancheId: number) => {
    // setWithdrawAllLoading(true);

    setModal({
      state: Modal.Txn,
      txn: undefined,
      status: "PENDING",
      message: "Redeeming Assets Pending Cycle Entry",
    });
    try {
      if (!balance) return;
      await onRedeemDirect(trancheId);
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "SUCCESS",
        message: "Redeem Success",
      });
    } catch (e) {
      console.error(e);
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Redeem Failed ",
      });
    } finally {
      // setWithdrawAllLoading(false);
    }
  };

  return (
    <div className="claim-redeposit">
      <div className="pocket assetsPendingEntry">
        <div className="rtn-amt">
          {fixedPendingEntry} {selectedMarket.assets[selectedDepositAssetIndex]} <span className="label">(Fixed) </span>
          <br />
          {degenPendingEntry} {selectedMarket.assets[selectedDepositAssetIndex]} <span className="label">(Degen)</span>
        </div>
        <div className="label">Assets Pending Cycle Entry</div>
        <div className="buttons">
          <button
            className="claim-redep-btn"
            onClick={() => {
              onRedeemDirect(0);
            }}
            // loading={withdrawAllLoading}
            disabled={!account || fixedPendingEntry === "0"}
          >
            Redeem Fixed
          </button>
          <button
            className="claim-redep-btn"
            onClick={() => {
              onRedeemDirect(1);
            }}
            // loading={withdrawAllLoading}
            disabled={!account || degenPendingEntry === "0"}
          >
            Redeem Degen
          </button>
        </div>
      </div>

      <div className="arrowFlip">
        <Arrow />
      </div>
      <div className="pocket assetsInvested">
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(withdrawalQueued ? 0 : invested).format("0,0.[0000]")
            : // change this from [selectedDepositAssetIndex] to display all assets at once
              numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="label">Assets In Cycle</div>
        <div className="buttons">
          <button
            className="claim-redep-btn"
            onClick={() => {
              queueWithdrawAll();
            }}
            // loading={withdrawAllLoading}
            disabled={!account || !+invested || withdrawalQueued}
          >
            Queue Withdrawal
          </button>
        </div>
      </div>
      <div className="arrowFlip">
        <Arrow />
      </div>
      <div className="pocket assetsPendingExit">
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(withdrawalQueued ? invested : 0).format("0,0.[0000]")
            : // change this from [selectedDepositAssetIndex] to display all assets at once
              numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="label">Assets Pending Cycle Exit</div>
      </div>
      <div className="arrowFlip">
        <Arrow />
      </div>
      <div className="pocket assetsWithdrawable">
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(balance).format("0,0.[0000]")
            : numeral(new BigNumber(balance[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="label">Assets Withdrawable</div>
        <div className="buttons">
          <button
            className="claim-redep-btn"
            onClick={() => {
              withdrawAll();
            }}
            // loading={withdrawAllLoading}
            disabled={!account || !+balance}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimRedeposit;
