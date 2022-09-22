import "./Dashboard.scss";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";
import useBalanceOfOtherAddress from "../stake/hooks/useBalanceOfOtherAddress";
import { NETWORKS } from "../types";
import { Network } from "../WaterfallDefi";
import {
  AVAXMultiSigAddress,
  BUSDAddress,
  DaiEPendingRewardLiquidFillChartAddress,
  MultiSigAddress,
  WAVAXDepositAddress,
} from "../config/address";

function Dashboard() {
  const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { actualBalance: pendingRewardBUSD } = useBalanceOfOtherAddress(
    Network.BNB,
    BUSDAddress[NETWORKS.MAINNET],
    MultiSigAddress[NETWORKS.MAINNET]
  );

  const { actualBalance: pendingRewardDAIE } = useBalanceOfOtherAddress(
    Network.AVAX,
    DaiEPendingRewardLiquidFillChartAddress[NETWORKS.MAINNET],
    AVAXMultiSigAddress[NETWORKS.MAINNET]
  );

  const { actualBalance: pendingRewardWAVAX } = useBalanceOfOtherAddress(
    Network.AVAX,
    WAVAXDepositAddress[NETWORKS.MAINNET],
    AVAXMultiSigAddress[NETWORKS.MAINNET]
  );

  const _pendingRewardBUSD = numeral(new BigNumber(pendingRewardBUSD).times(0.8).toString()).format("0,0");

  const _pendingRewardDAIE = numeral(new BigNumber(pendingRewardDAIE).times(0.8).toString()).format("0,0");

  const _pendingRewardWAVAX = numeral(new BigNumber(pendingRewardWAVAX).times(0.8).toString()).format("0,0.[00]");

  return (
    <div className="dashboard-wrapper dark">
      <div className="dash-banner">
        <div className="content">
          <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">$ {price ? numeral(price).format("0,0.[00]") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">$ {marketCap ? numeral(marketCap).format("0,0") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">BUSD Pool</span>
            <span className="value busd">$ {_pendingRewardBUSD}</span>
          </div>
          <div className="block">
            <span className="title">DAI.e Pool</span>
            <span className="value daie">$ {_pendingRewardDAIE}</span>
          </div>
          <div className="block">
            <span className="title">WAVAX Pool</span>
            <span className="value avax">{_pendingRewardWAVAX} WAVAX</span>
          </div>
          <div className="block">
            <span className="title" />
            <div className="icon-group">
              <Metamask />
              <a href="https://www.coingecko.com/en/coins/waterfall-governance-token">
                <div className="coingecko" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="total-value-locked">
        <div className="text">Total Value Locked</div>
        <div className="value">${totalTvl}</div>
      </div>
    </div>
  );
}

export default Dashboard;
