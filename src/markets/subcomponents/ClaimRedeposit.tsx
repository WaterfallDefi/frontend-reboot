import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { Market } from "../../types";
import { Modal, ModalProps } from "../../WaterfallDefi";
import useWithdraw from "../hooks/useWithdraw";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import useUserInfo from "../hooks/useUserInfo";

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

  const { onWithdraw, onQueueWithdraw } = useWithdraw(
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

  return (
    <div className="claim-redeposit tvl-bar">
      <div className="user-deposit">
        Assets In Cycle:{" "}
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(withdrawalQueued ? 0 : invested).format("0,0.[0000]")
            : // change this from [selectedDepositAssetIndex] to display all assets at once
              numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
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
        Assets Pending Cycle Exit:{" "}
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(withdrawalQueued ? invested : 0).format("0,0.[0000]")
            : // change this from [selectedDepositAssetIndex] to display all assets at once
              numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        Assets Withdrawable:{" "}
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(balance).format("0,0.[0000]")
            : numeral(new BigNumber(balance[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
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
