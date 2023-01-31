import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React from "react";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";
// import useClaimAll from "../hooks/useClaimAll";
import useWithdraw from "../hooks/useWithdraw";
// import usePendingWTFReward from "../hooks/usePendingWTFReward";
import BigNumber from "bignumber.js";
import numeral from "numeral";
// import useAutoroll from "../hooks/useAutoroll";

type Props = {
  // network: Network;
  selectedMarket: Market;
  // coingeckoPrices: any;
  selectedDepositAssetIndex: number;
  balance: string | string[];
  // simulDeposit: boolean;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  // setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
  // setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
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
    // simulDeposit,
    setModal,
    // setSelectedDepositAssetIndex,
    // setSimulDeposit,
    setMarkets,
  } = props;

  // const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  // const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);

  //Always Autoroll
  // const [autoroll, setAutoroll] = useState(false);

  // const [autorollPending, setAutorollPending] = useState<boolean>(true);

  //Always Autoroll
  // const [awaitingAutorollConfirm, setAwaitingAutorollConfirm] = useState<boolean>(false);

  // const [autorollBalance, setAutorollBalance] = useState<string | undefined>();

  // const { getAutoroll, changeAutoroll, getAutorollBalance } = useAutoroll(
  //   selectedMarket.network,
  //   selectedMarket.address
  // );

  const { onWithdraw } = useWithdraw(
    selectedMarket.network,
    selectedMarket.address,
    selectedMarket.abi,
    setModal,
    setMarkets
  );

  //no more WTF

  // const { onClaimAll } = useClaimAll(selectedMarket.network, selectedMarket.masterChefAddress, setModal);

  const { account } = useWeb3React<Web3Provider>();

  //no more WTF

  // const { totalPendingReward } = usePendingWTFReward(
  //   selectedMarket.network,
  //   selectedMarket.masterChefAddress,
  //   selectedMarket.trancheCount
  // );

  //always autoroll

  // useEffect(() => {
  //   if (selectedMarket.autorollImplemented && autorollPending) {
  //     getAutoroll().then((res) => {
  //       setAutoroll(res);
  //       setAutorollPending(false);
  //     });
  //   }
  // }, [selectedMarket.autorollImplemented, getAutoroll, autorollPending]);

  // useEffect(() => {
  //   if (selectedMarket.autorollImplemented && !autorollBalance) {
  //     getAutorollBalance().then((res) => {
  //       if (res?.invested) {
  //         let rate = 1;
  //         if (selectedMarket.assets[0] === "WAVAX" && coingeckoPrices) {
  //           rate = coingeckoPrices["wrapped-avax"].usd;
  //         }
  //         const _autoRollBalance = new BigNumber(res.invested._hex || "0")
  //           .dividedBy(BIG_TEN.pow(18))
  //           .times(rate)
  //           .toString();

  //         setAutorollBalance(numeral(_autoRollBalance).format("0,0.[00]"));
  //       }
  //     });
  //   }
  // }, [selectedMarket.autorollImplemented, getAutorollBalance, selectedMarket.assets, coingeckoPrices, autorollBalance]);

  //NO MORE WTF

  // const claimReward = async (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => {
  //   // setClaimRewardLoading(true);

  //   setModal({
  //     state: Modal.Txn,
  //     txn: undefined,
  //     status: "PENDING",
  //     message: "Claiming",
  //   });
  //   try {
  //     await onClaimAll(_lockDurationIfLockNotExists, _lockDurationIfLockExists);
  //     setModal({
  //       state: Modal.Txn,
  //       txn: undefined,
  //       status: "SUCCESS",
  //       message: "Claim Success",
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     setModal({
  //       state: Modal.Txn,
  //       txn: undefined,
  //       status: "REJECTED",
  //       message: "Claim Fail",
  //     });
  //   } finally {
  //     // setClaimRewardLoading(false);
  //   }
  // };

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

  //Always Autoroll: no autoroll deposit

  // const rollDepositPopup = () => {
  //   setModal({
  //     state: Modal.Redeposit,
  //     redepositProps: {
  //       selectedMarket: selectedMarket,
  //       selectedDepositAssetIndex: selectedDepositAssetIndex,
  //       balance: balance,
  //       simulDeposit: simulDeposit,
  //       coingeckoPrices: coingeckoPrices,
  //       setSelectedDepositAssetIndex: setSelectedDepositAssetIndex,
  //       setSimulDeposit: setSimulDeposit,
  //       setModal: setModal,
  //       setMarkets: setMarkets,
  //     },
  //   });
  // };

  //no more WTF

  // const claimPopup = () => {
  //   setModal({
  //     state: Modal.Claim,
  //     claimProps: {
  //       network: network,
  //       balance: totalPendingReward,
  //       setModal: setModal,
  //       claimReward: claimReward,
  //     },
  //   });
  // };

  return (
    <div className="claim-redeposit tvl-bar">
      <div className="user-deposit">
        User Deposit:{" "}
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
            Withdraw All
          </button>
          {/* Always Autoroll: no roll deposit */}
          {/* <button
            className="claim-redep-btn"
            onClick={rollDepositPopup}
            disabled={!account || !+balance || selectedMarket?.isRetired || autoroll}
          >
            Roll Deposit
          </button> */}
        </div>
      </div>

      {/* Always Autoroll */}
      {/* {account && selectedMarket.autorollImplemented ? (
        <div className="autoroll-controls">
          {autorollBalance !== "0" ? (
            <div className="autoroll-balance">Autoroll Balance: ${autorollBalance}</div>
          ) : null}
          <div className="control-wrapper">
            <div className="control">
              {!autorollPending ? (
                <button
                  className={"autoroll-btn " + (autoroll ? "stop" : "start")}
                  disabled={awaitingAutorollConfirm}
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
            </div>
          </div>
          <span className={"autoroll-lbl " + (autoroll ? "on" : "off")}>
            {awaitingAutorollConfirm ? "Switch Auto Txn Pending..." : "Autoroll: " + (autoroll ? "On" : "Off")}{" "}
          </span>
        </div>
      ) : null} */}

      {/* NO MORE WTF */}
      {/* <div className="wtf-reward">
        <div className="label">WTF Reward</div>
        <div className="rtn-amt">
          {totalPendingReward
            ? numeral(new BigNumber(totalPendingReward.toString()).dividedBy(BIG_TEN.pow(18))).format("0,0.[0000]")
            : "--"}{" "}
        </div>
        <div className="buttons">
          <button onClick={() => claimPopup()}>Claim</button>
        </div>
      </div> */}
    </div>
  );
}

export default ClaimRedeposit;
