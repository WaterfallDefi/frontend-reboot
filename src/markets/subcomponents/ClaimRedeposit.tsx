import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { Market } from "../../types";
import { Modal, ModalProps, Network } from "../../WaterfallDefi";
import useWithdraw from "../hooks/useWithdraw";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import useUserInfo from "../hooks/useUserInfo";
import Arrow from "../svgs/Arrow";
// import { usePositions } from "../../myportfolio/hooks/usePositions";
// import { MarketList } from "../../config/markets";
// import useRedeemDirect from "../hooks/useRedeemDirect";
import { useFarmTokenPendingRewards } from "../hooks/useFarmTokenPendingReward";
import useClaimRewards from "../hooks/useClaimRewards";

type Props = {
  network: Network;
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
    network,
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

  const { rewards, fetchRewards } = useFarmTokenPendingRewards(
    network,
    selectedMarket.strategyFarms.map((sf, i) => sf.farmTokenContractAddress)
  );

  // const positions = usePositions(MarketList);

  //changed to 6 digits for USDC
  // const fixedPendingEntry =
  //   positions.length > 0
  //     ? numeral(new BigNumber(positions[0][2][0]._hex).dividedBy(BIG_TEN.pow(6)).toString()).format("0,0.[000000]")
  //     : "-";

  //changed to 6 digits for USDC
  // const degenPendingEntry =
  //   positions.length > 0
  //     ? numeral(new BigNumber(positions[0][3][0]._hex).dividedBy(BIG_TEN.pow(6)).toString()).format("0,0.[000000]")
  //     : "-";

  const { onWithdraw, onQueueWithdraw } = useWithdraw(
    selectedMarket.network,
    selectedMarket.address,
    selectedMarket.abi,
    setModal,
    setMarkets
  );

  // const { onRedeemDirect } = useRedeemDirect(
  //   selectedMarket.network,
  //   selectedMarket.address,
  //   selectedMarket.abi,
  //   setModal,
  //   setMarkets
  // );

  const { onClaimRewards } = useClaimRewards(
    selectedMarket.network,
    selectedMarket.rewardsContract,
    selectedMarket.rewardsContractAbi,
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
          //changed to 6 digits for USDC
          !(balance instanceof Array) ? new BigNumber(balance).times(BIG_TEN.pow(6)) : new BigNumber(0)
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
      onQueueWithdraw();
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

  // const redeemPending = async (trancheId: number) => {
  //   // setWithdrawAllLoading(true);

  //   setModal({
  //     state: Modal.Txn,
  //     txn: undefined,
  //     status: "PENDING",
  //     message: "Redeeming Assets Pending Cycle Entry",
  //   });
  //   try {
  //     if (!balance) return;
  //     await onRedeemDirect(trancheId);
  //     setModal({
  //       state: Modal.Txn,
  //       txn: undefined,
  //       status: "SUCCESS",
  //       message: "Redeem Success",
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     setModal({
  //       state: Modal.Txn,
  //       txn: undefined,
  //       status: "REJECTED",
  //       message: "Redeem Failed ",
  //     });
  //   } finally {
  //     // setWithdrawAllLoading(false);
  //   }
  // };

  const claimRewards = async (rewardsTokenAddress: string) => {
    try {
      await onClaimRewards(rewardsTokenAddress);
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "SUCCESS",
        message: "Claim Success",
      });
    } catch (e) {
      console.error(e);
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "REJECTED",
        message: "Claim Failed ",
      });
    } finally {
      // setWithdrawAllLoading(false);
    }
  };

  return (
    <div className="claim-redeposit">
      {/* <div className="pocket assetsPendingEntry">
        <div className="rtn-amt">
          {fixedPendingEntry} {selectedMarket.assets[selectedDepositAssetIndex]}{" "}
          <span className="label">(Risk-Off) </span>
          <br />
          {degenPendingEntry} {selectedMarket.assets[selectedDepositAssetIndex]}{" "}
          <span className="label">(Risk-On)</span>
        </div>
        <div className="label">Assets Pending Cycle Entry</div>
        <div className="buttons">
          <button
            className="claim-redep-btn"
            onClick={() => {
              redeemPending(0);
            }}
            // loading={withdrawAllLoading}
            disabled={!account || fixedPendingEntry === "0"}
          >
            Redeem Risk-Off
          </button>
          <button
            className="claim-redep-btn"
            onClick={() => {
              redeemPending(1);
            }}
            // loading={withdrawAllLoading}
            disabled={!account || degenPendingEntry === "0"}
          >
            Redeem Risk-On
          </button>
        </div>
      </div>

      <div className="arrowFlip">
        <Arrow />
      </div> */}
      <div className="pocket assetsInvested">
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(withdrawalQueued ? 0 : invested).format("0,0.[0000]")
            : // change this from [selectedDepositAssetIndex] to display all assets at once
              numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(6))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="label extrapadding">Assets In Cycle</div>
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
              //changd to 6 digits for USDC
              numeral(new BigNumber(invested[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(6))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="label extrapadding">Assets Pending Cycle Exit</div>
      </div>
      <div className="arrowFlip">
        <Arrow />
      </div>
      <div className="pocket assetsWithdrawable">
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? numeral(balance).format("0,0.[0000]")
            : //changed to 6 digits for USDC
              numeral(new BigNumber(balance[selectedDepositAssetIndex]).dividedBy(BIG_TEN.pow(6))).format(
                "0,0.[00000]"
              )}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="label extrapadding">Assets Withdrawable</div>
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
      <div className="pocket rewardsWithdrawable">
        <div className="label extrapadding">Rewards Withdrawable</div>
        {rewards.map((r, i) => (
          <div className="rtn-amt" key={i}>
            <span>
              {selectedMarket.strategyFarms[i].farmName} : {r}
            </span>
            {/* reward withdrawal only available for stargate rn */}
            {selectedMarket.strategyFarms[i].farmName === "Stargate" && (
              <button onClick={() => claimRewards(selectedMarket.strategyFarms[i].farmTokenContractAddress)}>
                WITHDRAW
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClaimRedeposit;
