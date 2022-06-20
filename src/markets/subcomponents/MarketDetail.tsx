import numeral from "numeral";
import React, { useEffect, useMemo, useState } from "react";
import { getAPYHourly } from "../../myportfolio/hooks/useSubgraphQuery";
import { Market, StrategyFarm } from "../../types";
import { ModalProps, Network } from "../../WaterfallDefi";
import {
  useTrancheBalance,
  useMulticurrencyTrancheBalance,
} from "../hooks/useTrancheBalance";
import Arrow from "../svgs/Arrow";
import Pie from "../svgs/Pie";
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
};

const COLORS = ["#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

const getLockupPeriod = (duration: string) => {
  const lockupPeriod = Number(duration) / 86400;
  //for testing
  return lockupPeriod >= 1
    ? numeral(lockupPeriod).format("0.[0]") + " Days"
    : Number(duration) / 60 + " Mins";
};

const MarketDetail: React.FC<Props> = (props: Props) => {
  const { selectedMarket, setSelectedMarket, coingeckoPrices, setModal } =
    props;

  const [selectedDepositAssetIndex, setSelectedDepositAssetIndex] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<
    StrategyFarm | undefined
  >();
  const [stratChartColor, setStratChartColor] = useState<string>("");
  const [simulDeposit, setSimulDeposit] = useState(false);

  const { balance } = useTrancheBalance(
    //don't need { invested } for now
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency
  );

  const { MCbalance } = useMulticurrencyTrancheBalance(
    //don't need { MCinvested } for now
    selectedMarket.isAvax ? Network.AVAX : Network.BNB,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.assets.length,
    !selectedMarket.isMulticurrency
  );

  const [APYData, setAPYData] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    getAPYHourly(twoWeeksAgo.toISOString(), today.toISOString()).then(
      (res: any) => {
        setAPYData(res);
      }
    );
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

  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div
            className="info-block pointer"
            onClick={() => setSelectedMarket(undefined)}
          >
            <Arrow />
          </div>
          <div className="info-block">
            <span className="portfolio-name">{selectedMarket.portfolio}</span>
            <span className="blocktext listing-date">
              Listing date: {selectedMarket.listingDate}
            </span>
          </div>
          <div className="info-block">
            <div
              className={
                "assets" +
                (selectedMarket.isMulticurrency ? " multicurrency" : "")
              }
            >
              {selectedMarket.assets.map((assetName: string, i) => (
                <div
                  className={
                    "asset" +
                    (selectedDepositAssetIndex === i ? " selected" : "")
                  }
                  key={assetName}
                  onClick={() => setSelectedDepositAssetIndex(i)}
                >
                  <div
                    className="coin"
                    style={{ backgroundImage: `url(/coins/${assetName}.png)` }}
                  />
                  <span>{assetName}</span>
                </div>
              ))}
            </div>
            <span className="blocktext">
              Lock-up period:{" "}
              {selectedMarket.duration
                ? getLockupPeriod(selectedMarket.duration)
                : "-"}
            </span>
          </div>
          <div className="info-block">
            <div />
            <span className="tvl">$TVL: {selectedMarket.tvl}</span>
          </div>
        </div>
      </div>
      <div className="charts">
        <div className="linear-gradient" />
        <ClaimRedeposit
          selectedMarket={selectedMarket}
          coingeckoPrices={coingeckoPrices}
          selectedDepositAssetIndex={selectedDepositAssetIndex}
          balance={selectedMarket.isMulticurrency ? MCbalance : balance}
          setModal={setModal}
          flexGrow={!selectedStrategy}
        />
        <div className="chart-block portfolio-block">
          <div className="background left-br dbl-chart">
            {!stratChartData && !selectedStrategy ? (
              <PortfolioChart
                strategyFarms={selectedMarket.strategyFarms}
                setSelectedStrategy={setSelectedStrategy}
              />
            ) : stratChartData ? (
              <StrategyChart
                data={stratChartData}
                strategy={selectedStrategy}
                color={stratChartColor}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div className="background right-br">
            <div className="legend">
              <div
                className={
                  "chart-toggle" + (!selectedStrategy ? " selected" : "")
                }
                onClick={() =>
                  selectedStrategy
                    ? setSelectedStrategy(undefined)
                    : setSelectedStrategy(selectedMarket.strategyFarms[0])
                }
              >
                <Pie />
              </div>
              {selectedMarket.strategyFarms.map((f, i) => (
                <div
                  key={f.farmName}
                  className={
                    "farm-key strategy-select" +
                    (selectedStrategy &&
                    selectedStrategy.farmName === f.farmName
                      ? " selected"
                      : "")
                  }
                  onClick={() => {
                    setSelectedStrategy(f);
                    setStratChartColor(COLORS[i]);
                  }}
                >
                  <div
                    className="key-color"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span>{f.farmName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <TrancheStructure
          tranches={selectedMarket.tranches}
          totalTranchesTarget={selectedMarket.totalTranchesTarget}
          wipeRight={selectedStrategy !== undefined}
        />
      </div>
      <Deposit
        selectedMarket={selectedMarket}
        coingeckoPrices={coingeckoPrices}
        selectedDepositAssetIndex={selectedDepositAssetIndex}
        setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
        simulDeposit={simulDeposit}
        setSimulDeposit={setSimulDeposit}
        setModal={setModal}
        balance={selectedMarket.isMulticurrency ? MCbalance : balance}
      />
    </div>
  );
};

export default MarketDetail;
