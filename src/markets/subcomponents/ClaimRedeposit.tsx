import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { Market } from "../../types";
import { Network } from "../../WaterfallDefi";
import useAutoRoll from "../hooks/useAutoRoll";
import useClaimAll from "../hooks/useClaimAll";
import {
  useMulticurrencyTrancheBalance,
  useTrancheBalance,
} from "../hooks/useTrancheBalance";
import useWithdraw from "../hooks/useWithdraw";
import usePendingWTFReward from "../hooks/usePendingWTFReward";
import BigNumber from "bignumber.js";
import numeral from "numeral";

type Props = {
  selectedMarket: Market;
  coingeckoPrices: any;
  selectedDepositAssetIndex: number;
};

const BIG_TEN = new BigNumber(10);

const formatBigNumber2HexString = (bn: BigNumber) => {
  return "0x" + bn.toString(16);
};

function ClaimRedeposit(props: Props) {
  const { selectedMarket, coingeckoPrices, selectedDepositAssetIndex } = props;

  const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  const [withdrawAllLoading, setWithdrawAllLoading] = useState(false);
  const [showRedeposit, setShowRedeposit] = useState(false);
  const [showClaim, setShowClaim] = useState(false);

  const [autoRoll, setAutoRoll] = useState(false);
  const [autoRollPending, setAutoRollPending] = useState<boolean>(true);
  const [autoRollBalance, setAutoRollBalance] = useState("0");

  const { getAutoRoll, changeAutoRoll, getAutoRollBalance } = useAutoRoll(
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.address
  );

  const { onWithdraw } = useWithdraw(
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.address,
    selectedMarket.abi
  );

  const { onClaimAll } = useClaimAll(
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.masterChefAddress
  );

  const { balance, MCbalance, invested } = !selectedMarket.isMulticurrency
    ? useTrancheBalance(
        selectedMarket.isAvax ? Network.AVAX : Network.BNB,
        selectedMarket.address,
        selectedMarket.abi
      )
    : useMulticurrencyTrancheBalance(
        selectedMarket.isAvax ? Network.AVAX : Network.BNB,
        selectedMarket.address,
        selectedMarket.abi,
        selectedDepositAssetIndex,
        selectedMarket.assets.length
      );

  const { account } = useWeb3React<Web3Provider>();

  const { totalPendingReward, tranchesPendingReward } = usePendingWTFReward(
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.masterChefAddress,
    selectedMarket.trancheCount
  );

  useEffect(() => {
    if (selectedMarket.autorollImplemented) {
      getAutoRoll().then((res) => {
        setAutoRoll(res);
        setAutoRollPending(false);
      });
    }
  }, []);

  useEffect(() => {
    if (selectedMarket.autorollImplemented) {
      getAutoRollBalance().then((res) => {
        if (res?.invested) {
          let rate = 1;
          if (selectedMarket?.assets[0] === "WAVAX" && coingeckoPrices) {
            rate = coingeckoPrices?.["wrapped-avax"]?.usd;
          }
          const _autoRollBalance = new BigNumber(res?.invested?._hex || "0")
            .dividedBy(BIG_TEN.pow(18))
            .times(rate)
            .toString();

          setAutoRollBalance(numeral(_autoRollBalance).format("0,0.[00]"));
        }
      });
    }
  }, [coingeckoPrices]);

  const claimReward = async (
    _lockDurationIfLockNotExists: string,
    _lockDurationIfLockExists: string
  ) => {
    setClaimRewardLoading(true);

    // dispatch(
    //   setConfirmModal({
    //     isOpen: true,
    //     txn: undefined,
    //     status: "PENDING",
    //     pendingMessage: intl.formatMessage({ defaultMessage: "Claiming " }),
    //   })
    // );
    try {
      await onClaimAll(_lockDurationIfLockNotExists, _lockDurationIfLockExists);
      // successNotification("Claim Success", "");
    } catch (e) {
      console.error(e);
      // dispatch(
      //   setConfirmModal({
      //     isOpen: true,
      //     txn: undefined,
      //     status: "REJECTED",
      //     pendingMessage: intl.formatMessage({ defaultMessage: "Claim Fail " }),
      //   })
      // );
    } finally {
      setShowClaim(false);

      setClaimRewardLoading(false);
    }
  };
  const withdrawAll = async () => {
    setWithdrawAllLoading(true);

    // dispatch(
    //   setConfirmModal({
    //     isOpen: true,
    //     txn: undefined,
    //     status: "PENDING",
    //     pendingMessage: intl.formatMessage({ defaultMessage: "Withdrawing" }),
    //   })
    // );
    try {
      if (!balance) return;
      await onWithdraw(
        formatBigNumber2HexString(
          new BigNumber(balance).times(BIG_TEN.pow(18))
        ),
        MCbalance ? MCbalance : []
      );
      // successNotification("Withdraw All Success", "");
    } catch (e) {
      console.error(e);

      // dispatch(
      //   setConfirmModal({
      //     isOpen: true,
      //     txn: undefined,
      //     status: "REJECTED",
      //     pendingMessage: intl.formatMessage({
      //       defaultMessage: "Withdraw Fail ",
      //     }),
      //   })
      // );
    } finally {
      setWithdrawAllLoading(false);
    }
  };
  const rollDepositPopup = () => {
    setShowRedeposit(!showRedeposit);
  };
  const claimPopup = () => {
    if (totalPendingReward !== "0") setShowClaim(!showClaim);
    // setShowClaim(!showClaim);
  };

  return (
    <div className="claim-redeposit">
      <div className="section">
        <div className="label">Return Principal + Yield</div>
        <div className="rtn-amt">
          {!selectedMarket.isMulticurrency
            ? balance
              ? numeral(balance).format("0,0.[0000]")
              : "--"
            : MCbalance
            ? numeral(
                new BigNumber(MCbalance[selectedDepositAssetIndex]).dividedBy(
                  BIG_TEN.pow(18)
                )
              ).format("0,0.[00000]")
            : "--"}{" "}
          {selectedMarket.assets[selectedDepositAssetIndex]}
        </div>
        <div className="buttons">
          <button
            onClick={() => {
              withdrawAll();
            }}
            // loading={withdrawAllLoading}
            disabled={!account || !+balance}
          >
            Withdraw All
          </button>
          <button
            onClick={rollDepositPopup}
            disabled={
              !account || !+balance || selectedMarket?.isRetired || autoRoll
            }
          >
            Roll Deposit
          </button>
        </div>
        {account && selectedMarket.autorollImplemented ? (
          <div>
            {autoRollBalance !== "0" && (
              <div style={{ marginTop: 10 }}>
                Autoroll Balance: ${autoRollBalance}
              </div>
            )}
            <div style={{ display: "flex", marginTop: 10 }}>
              <label className="autorolling-label">Auto Rolling</label>
              <div
                style={{
                  padding: 1.5,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                }}
              >
                {/* !autorollPending */}
                {/* <switch /> */}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="section">
        <div className="label">WTF Reward</div>
        <div className="rtn-amt">
          {totalPendingReward
            ? numeral(
                new BigNumber(totalPendingReward.toString()).dividedBy(
                  BIG_TEN.pow(18)
                )
              ).format("0,0.[0000]")
            : "--"}{" "}
          WTF
        </div>
        <div className="buttons">
          <button onClick={() => claimPopup()}>Claim</button>
        </div>
      </div>
    </div>
  );
}

export default ClaimRedeposit;
