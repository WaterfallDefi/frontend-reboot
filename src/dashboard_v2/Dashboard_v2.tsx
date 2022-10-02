import "./Dashboard.scss";
import { useEffect, useState } from "react";
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
import ky from "ky";

function Dashboard() {
  const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  const [wavaxPrice, setWavaxPrice] = useState<number>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getWAVAXPrice = async () => {
      const result: any = await ky
        .get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=wrapped-avax")
        .json();
      setWavaxPrice(result["wrapped-avax"]?.usd);
    };
    getWAVAXPrice();
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

  const _pendingRewardBUSD = new BigNumber(pendingRewardBUSD);

  const _pendingRewardDAIE = new BigNumber(pendingRewardDAIE);

  const _pendingRewardWAVAX = new BigNumber(pendingRewardWAVAX).times(wavaxPrice ? wavaxPrice : 0);

  const _totalRewardPool = numeral(
    _pendingRewardBUSD.plus(_pendingRewardDAIE).plus(_pendingRewardWAVAX).toString()
  ).format("0,0.[00]");

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
            <span className="title">Protocol Combined Revenue</span>
            <span className="value busd">$ {_totalRewardPool}</span>
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
