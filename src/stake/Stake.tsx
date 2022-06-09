import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useMemo, useState } from "react";
import { Mode, Network } from "../WaterfallDefi";
import "./Stake.scss";
import Stakings from "../config/staking";
import { useStakingPool } from "./hooks/useStaking";
import useBalanceOfOtherAddress from "./hooks/useBalanceOfOtherAddress";
import {
  AVAXMultiSigAddress,
  BUSDAddress,
  DaiEPendingRewardLiquidFillChartAddress,
  MultiSigAddress,
  WAVAXDepositAddress,
} from "../config/address";
import { NETWORKS } from "../types";
import numeral from "numeral";
import BigNumber from "bignumber.js";
import useBalance from "./hooks/useBalance";
import useTotalSupply from "./hooks/useTotalSupply";
import useGetLockingWTF from "./hooks/useGetLockingWTF";
import { usePendingReward } from "./hooks/usePendingReward";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import useClaimRewards from "./hooks/useClaimRewards";
import useClaimFeeRewards from "./hooks/useClaimFeeRewards";
import IncreaseAction from "./subcomponents/IncreaseAction";
import UnstakeAction from "./subcomponents/UnstakeAction";

const BLOCK_TIME = (chainId: string) => {
  switch (chainId) {
    case "43114":
      return 1.98833333;
    case "97":
      return 3;
    case "56":
      return 3;
    default:
      return 3;
  }
};

const actualMultiplier = [
  0.00416666666666667, 0.01, 0.01625, 0.0250000000000001, 0.0354166666666666,
  0.05, 0.0670833333333334, 0.0899999999999999, 0.11625, 0.145833333333333,
  0.183333333333333, 0.235, 0.2925, 0.361666666666666, 0.44375, 0.54,
  0.665833333333333, 0.81, 0.981666666666667, 1.18333333333333, 1.435,
  1.72333333333333, 2.07, 2.49,
];

enum StakeKey {
  Stake = "stake",
  Unstake = "unstake",
}

type Props = {
  mode: Mode;
  network: Network;
};

function Stake(props: Props) {
  const { mode, network } = props;

  const [activatedKey, setActivatedKey] = useState<StakeKey>(StakeKey.Stake);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { account } = useWeb3React<Web3Provider>();

  const stakingConfig = network === Network.BNB ? Stakings[0] : Stakings[1];

  const {
    totalStaked,
    isPoolActive,
    totalLocked,
    userStaked,
    maxAPR,
    rewardPerBlock,
  } = useStakingPool(
    network,
    stakingConfig?.rewardTokenAddress || "",
    stakingConfig?.earningTokenAddress || "",
    account
  );

  const { actualBalance: pendingReward } = useBalanceOfOtherAddress(
    network,
    network === Network.BNB
      ? BUSDAddress[NETWORKS.MAINNET]
      : DaiEPendingRewardLiquidFillChartAddress[NETWORKS.MAINNET],
    network === Network.BNB
      ? MultiSigAddress[NETWORKS.MAINNET]
      : AVAXMultiSigAddress[NETWORKS.MAINNET]
  );

  const { actualBalance: pendingRewardWAVAX } = useBalanceOfOtherAddress(
    Network.AVAX,
    WAVAXDepositAddress[NETWORKS.MAINNET],
    AVAXMultiSigAddress[NETWORKS.MAINNET]
  );

  const _pendingReward = numeral(
    new BigNumber(pendingReward).times(0.8).toString()
  ).format("0,0.[00]");

  const _pendingRewardWAVAX = numeral(
    new BigNumber(pendingRewardWAVAX).times(0.8).toString()
  ).format("0,0.[00]");

  const { balance: VeWTFBalance } = useBalance(
    network,
    stakingConfig.earningTokenAddress
  );
  const VeWTFTotalSupply = useTotalSupply(
    network,
    stakingConfig.earningTokenAddress
  );
  const {
    total: lockingWTF,
    expiryTimestamp,
    startTimestamp,
    fetchLockingWTF,
  } = useGetLockingWTF(network, account);

  const pendingWTFRewards = usePendingReward(
    network,
    stakingConfig.rewardTokenAddress,
    account
  );
  const { price: wtfPrice } = useWTFPriceLP();
  const { claimRewards } = useClaimRewards(network);
  const { claimFeeRewards } = useClaimFeeRewards(network);
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [feeRewardsHarvestLoading, setFeeRewardsHarvestLoading] =
    useState(false);
  const onHarvest = async () => {
    setHarvestLoading(true);
    try {
      const result = await claimRewards();
      // fetchBalance();
      // setBalanceInput(0);
      // fetchLockingWTF();
      // successNotification("Claim Reward Success", "");

      //TO DO: SUCCESS MODAL
    } catch (e) {
      console.error(e);
    } finally {
      setHarvestLoading(false);
    }
  };

  const _VeWTFBalance = numeral(VeWTFBalance).value() || 0;
  const _VeWTFTotalSupply = numeral(VeWTFTotalSupply).value() || 0;
  const VeWTFRatio =
    VeWTFTotalSupply && VeWTFBalance
      ? numeral((_VeWTFBalance / _VeWTFTotalSupply) * 100).format("0,0.[0000]")
      : "-";
  const VeWTFRatioPercentage =
    VeWTFTotalSupply && VeWTFBalance ? _VeWTFBalance / _VeWTFTotalSupply : 0;

  const currentAPR = useMemo(() => {
    if (!rewardPerBlock) return "";
    const blockTime = BLOCK_TIME(network.toString());
    return (
      numeral(
        new BigNumber(VeWTFRatioPercentage)
          .times(rewardPerBlock)
          .times((60 / blockTime) * 60 * 24 * 365 * 100)
          .dividedBy(lockingWTF)
          .toString()
      ).format("0,0.[00]") + "%"
    );
  }, [VeWTFRatioPercentage, rewardPerBlock]);

  const data = useMemo(() => {
    return {
      labels: [
        "1 Month",
        "2 Months",
        "3 Months",
        "4 Months",
        "5 Months",
        "6 Months",
        "7 Months",
        "8 Months",
        "9 Months",
        "10 Months",
        "11 Months",
        "12 Months",
        "13 Months",
        "14 Months",
        "15 Months",
        "16 Months",
        "17 Months",
        "18 Months",
        "19 Months",
        "20 Months",
        "21 Months",
        "22 Months",
        "23 Months",
        "24 Months",
      ],
      datasets: [
        {
          label: "veWTF Predicted APR",
          fill: false,
          backgroundColor: "#0066FF",
          borderColor: "#0066FF",
          pointBorderColor: "#0066FF",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#0066FF",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: actualMultiplier.map((e) => {
            return numeral((e * (numeral(maxAPR).value() || 0)) / 2.49).value();
          }),
        },
      ],
    };
  }, [maxAPR]);

  return (
    <div className={"stake-wrapper " + mode}>
      <div className="body-wrapper">
        <div className="APY-card">
          <div>
            <p>Lock WTF to Earn</p>
            <div>
              Receive Vote Escrowed WTF (veWTF) that gets you daily WTF rewards,
            </div>
            <div>platform fees shares and more!</div>
          </div>
          <span>APR up to {maxAPR}%</span>
        </div>
        <div className="total">
          <div>
            Total WTF Locked: {numeral(totalLocked).format("0,0.[0000]")}
          </div>
          <div>
            Total veWTF Minted:{" "}
            {numeral(_VeWTFTotalSupply).format("0,0.[0000]")}
          </div>
        </div>
        <div className="actions">
          <div className="action">
            <div className="segment">
              <div
                className="segment-block"
                key="stake"
                data-activated={activatedKey === "stake"}
                onClick={() => setActivatedKey(StakeKey.Stake)}
              >
                Stake
              </div>
              <div
                className="segment-block"
                key="unstake"
                data-activated={activatedKey === "unstake"}
                onClick={() => setActivatedKey(StakeKey.Unstake)}
              >
                Unstake
              </div>
            </div>
            {activatedKey === StakeKey.Stake && <IncreaseAction />}
            {activatedKey === StakeKey.Unstake && <UnstakeAction />}
          </div>
          <div className="stake-info">
            <div>
              <div className="veWTF">
                <p>Your veWTF</p>
                <p>
                  {VeWTFBalance
                    ? numeral(_VeWTFBalance).format("0,0.[0000]")
                    : "-"}
                </p>
                <span>
                  {VeWTFBalance !== "0" &&
                    `(1 veWTF= ${numeral(
                      Number(lockingWTF) / Number(_VeWTFBalance)
                    ).format("0,0.[0000]")} WTF)`}
                </span>
                <span>{VeWTFRatio && VeWTFRatio}% of veWTF ownership</span>
                <div>Stake WTF get veWTF</div>
              </div>
              <div className="WTF-reward">
                <p>WTF Reward</p>
                <div>
                  <p>{pendingWTFRewards}</p>
                </div>
                <span>
                  ${" "}
                  {pendingWTFRewards && wtfPrice
                    ? numeral(
                        parseFloat(pendingWTFRewards.replace(/,/g, "")) *
                          parseFloat(wtfPrice.replace(/,/g, "").toString())
                      ).format("0,0.[00]")
                    : ""}{" "}
                  (1 WTF= $ {wtfPrice})
                </span>
                <button onClick={onHarvest}>Harvest</button>
              </div>
            </div>
            <div /> {/* wtf, lap... */}
            <div>
              <div>veWTF - Locking Period vs Predicted APR</div>
              {/* line chart */}
            </div>
            <div>
              <p>Your info</p>
              <section>
                <span>Your stake</span>
                <span>
                  {lockingWTF !== "0"
                    ? numeral(lockingWTF).format("0,0.[0000]")
                    : "-"}{" "}
                  WTF
                </span>
              </section>
              <section>
                <span>Your ratio</span>
                <span>
                  {lockingWTF !== "0"
                    ? numeral(
                        (Number(_VeWTFBalance) / Number(lockingWTF)) * 100
                      ).format("0,0.[00]")
                    : "-"}{" "}
                  %
                </span>
              </section>
              <section>
                <span>Current APR:</span>
                <span>{currentAPR && currentAPR}</span>
              </section>
              <section>
                <span>Expire date:</span>
                <span>
                  {expiryTimestamp &&
                    expiryTimestamp !== "0" &&
                    new Date(Number(expiryTimestamp)).toDateString()}
                </span>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stake;
