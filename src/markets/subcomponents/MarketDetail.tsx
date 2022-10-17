import React, { useEffect, useMemo, useState } from "react";

import numeral from "numeral";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { getAPYHourly } from "../../myportfolio/hooks/useSubgraphQuery";
import { Market, StrategyFarm, Tranche } from "../../types";
import { ModalProps, Network } from "../../WaterfallDefi";
import { useMulticurrencyTrancheBalance, useTrancheBalance } from "../hooks/useTrancheBalance";
import Arrow from "../svgs/Arrow";
import ClaimRedeposit from "./ClaimRedeposit";
import Deposit from "./Deposit";
import PortfolioChart from "./PortfolioChart";
import StrategyChart from "./StrategyChart";
import TrancheStructure from "./TrancheStructure";

type Props = {
  selectedMarket: Market;
  setSelectedMarket: React.Dispatch<React.SetStateAction<Market | undefined>>;
  coingeckoPrices: any;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

const COLORS = ["#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

const getLockupPeriod = (duration: string) => {
  const lockupPeriod = Number(duration) / 86400;
  //for testing
  return lockupPeriod >= 1 ? numeral(lockupPeriod).format("0.[0]") + " Days" : Number(duration) / 60 + " Mins";
};

const MarketDetail: React.FC<Props> = (props: Props) => {
  const { selectedMarket, setSelectedMarket, coingeckoPrices, setModal, setMarkets } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [selectedDepositAssetIndex, setSelectedDepositAssetIndex] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyFarm | undefined>(selectedMarket.strategyFarms[0]);
  const [stratChartColor, setStratChartColor] = useState<string>(COLORS[0]);
  const [simulDeposit, setSimulDeposit] = useState(false);

  const { balance, fetchBalance } = useTrancheBalance(
    //don't need { invested } for now
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency
  );

  const { MCbalance, fetchMCBalance } = useMulticurrencyTrancheBalance(
    //don't need { MCinvested } for now
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.assets.length,
    !selectedMarket.isMulticurrency
  );

  useEffect(() => {
    account && selectedMarket.isMulticurrency ? fetchMCBalance() : fetchBalance();
  }, [account, fetchMCBalance, fetchBalance, selectedMarket.isMulticurrency]);

  const [APYData, setAPYData] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    getAPYHourly(twoWeeksAgo.toISOString(), today.toISOString()).then((res: any) => {
      setAPYData(res);
    });
  }, []);

  // const [depositableAssets, setDepositableAssets] = useState<string[]>(
  //   selectedMarket.assets
  // );

  // const tokens: { addr: string; strategy: string; percent: any }[] | undefined =
  //   selectedMarket.tokens;

  // const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined =
  //   selectedMarket.trancheInvests;

  const stratChartData = useMemo(() => {
    return (
      selectedStrategy &&
      APYData.map((apy) => {
        return {
          x: apy.timestamp,
          y: Number(apy[selectedStrategy.apiKey]) * 100,
        };
      })
    );
  }, [APYData, selectedStrategy]);

  const principalTVL = selectedMarket.tranches.reduce((acc: number, next: Tranche) => acc + Number(next.target), 0);

  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div className="info-block pointer" onClick={() => setSelectedMarket(undefined)}>
            <Arrow />
          </div>
          <div className="info-block">
            <span className="portfolio-name">{selectedMarket.portfolio}</span>
            <span className="blocktext listing-date">Listing date: {selectedMarket.listingDate}</span>
          </div>
          <div className="info-block">
            <div className={"assets" + (selectedMarket.isMulticurrency ? " multicurrency" : "")}>
              {selectedMarket.assets.map((assetName: string, i) => (
                <div
                  className={"asset" + (!simulDeposit && selectedDepositAssetIndex === i ? " selected" : "")}
                  key={assetName}
                  onClick={() => {
                    setSelectedDepositAssetIndex(i);
                    setSimulDeposit(false);
                  }}
                >
                  <div
                    className="coin"
                    style={{ backgroundImage: `url(/coins/${assetName !== "DAI.e" ? assetName : "dai"}.png)` }}
                  />
                  <span>{assetName}</span>
                </div>
              ))}
              {selectedMarket.isMulticurrency && (
                <div
                  className={"multi asset" + (simulDeposit ? " selected" : "")}
                  onClick={() => setSimulDeposit(true)}
                >
                  Multi
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="tvl-bar">
        <div className="tvl-div">
          <div className="subdiv">
            <div className="subdiv-title">TVL: </div>
            <div>
              <span className="tvl">{numeral(selectedMarket.tvl).format("0,0.0000")} </span>
              {selectedMarket.assets[0] === "WBNB" || "WAVAX" ? selectedMarket.assets[0] : "$"}
            </div>
          </div>
          <div className="subdiv">
            <div className="subdiv-title">Principal TVL:</div>{" "}
            <div>
              <span className="max-tvl">{numeral(principalTVL).format("0,0.0000")}</span>{" "}
              {selectedMarket.assets[0] === "WBNB" || "WAVAX" ? selectedMarket.assets[0] : "$"}
            </div>
          </div>
        </div>
        <div className="lockup-div">
          <div className="title">Lock-up period:</div>
          {selectedMarket.duration ? getLockupPeriod(selectedMarket.duration) : "-"}
        </div>
        <div className="status-div">
          Status:{" "}
          <div className={"status " + selectedMarket.status}>
            {selectedMarket.status === "PENDING"
              ? "Subscription Open"
              : selectedMarket.status === "ACTIVE"
              ? "Active"
              : selectedMarket.status === "RETIRED"
              ? "Retired"
              : ""}
          </div>
        </div>
      </div>
      <div className="charts">
        <ClaimRedeposit
          network={selectedMarket.isAvax ? Network.AVAX : Network.BNB}
          selectedMarket={selectedMarket}
          coingeckoPrices={coingeckoPrices}
          selectedDepositAssetIndex={selectedDepositAssetIndex}
          balance={selectedMarket.isMulticurrency ? MCbalance : balance}
          simulDeposit={simulDeposit}
          setModal={setModal}
          setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
          setSimulDeposit={setSimulDeposit}
          setMarkets={setMarkets}
          flexGrow={!selectedStrategy}
        />
        <div className="chart-block portfolio-block">
          <div className="background left-br">
            <h2>Historical Performance</h2>
            {stratChartData ? <StrategyChart data={stratChartData} color={stratChartColor} /> : <div>Loading...</div>}
          </div>
          <div className="background right-br">
            <PortfolioChart strategyFarms={selectedMarket.strategyFarms} setSelectedStrategy={setSelectedStrategy} />
            <div className="legend">
              {selectedMarket.strategyFarms.map((f, i) => (
                <div
                  key={f.farmName}
                  className={
                    "farm-key strategy-select" +
                    (selectedStrategy && selectedStrategy.farmName === f.farmName ? " selected" : "")
                  }
                  onClick={() => {
                    setSelectedStrategy(f);
                    setStratChartColor(COLORS[i]);
                  }}
                >
                  <div className="key-color" style={{ backgroundColor: COLORS[i] }} />
                  <span>{f.farmName}</span>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="background right-br"></div> */}
        </div>
        <TrancheStructure
          tranches={selectedMarket.tranches}
          totalTranchesTarget={selectedMarket.totalTranchesTarget}
          wipeRight={selectedStrategy !== undefined}
        />
      </div>
      <Deposit
        isRedeposit={false}
        selectedMarket={selectedMarket}
        coingeckoPrices={coingeckoPrices}
        selectedDepositAssetIndex={selectedDepositAssetIndex}
        setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
        simulDeposit={simulDeposit}
        setSimulDeposit={setSimulDeposit}
        setModal={setModal}
        setMarkets={setMarkets}
        balance={selectedMarket.isMulticurrency ? MCbalance : balance}
      />
    </div>
  );
};

export default MarketDetail;
