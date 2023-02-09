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

// const formatBigNumber2HexString = (bn: BigNumber) => {
//   return "0x" + bn.toString(16);
// };

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

  const { onWithdraw } = useWithdraw(
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
        setWithdrawalQueued(res);
        setWithdrawalQueuedPending(false);
      });
    }
  }, [getUserInfo, withdrawalQueuedPending]);

  console.log("userInfo.isAuto");
  console.log(withdrawalQueued);

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
      await onWithdraw();
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

  return (
    <div className="claim-redeposit tvl-bar">
      <div className="user-deposit">
        Assets In Cycle:{" "}
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(invested).format("0,0.[0000]")
            : numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(18))).format(
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
            disabled={!account || !+invested}
          >
            Queue Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimRedeposit;
