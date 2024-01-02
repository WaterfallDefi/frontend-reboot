import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import numeral from "numeral";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { Market, Tranche } from "../../types";
import { APYData, APYDataFull, ModalProps } from "../../Yego";
import { useMulticurrencyTrancheBalance, useTrancheBalance } from "../hooks/useTrancheBalance";
import Arrow from "../svgs/Arrow";
import ClaimRedeposit from "./ClaimRedeposit";
import Deposit from "./Deposit";
import PortfolioChart from "./PortfolioChart";
import StrategyChart from "./StrategyChart";
import TrancheStructure from "./TrancheStructure";
import { CoingeckoPrices } from "../Markets";
import dayjs from "dayjs";
import Countdown from "react-countdown";

const formatTimestamp = (num: string | number) => {
  const format1 = "YYYY/MM/DD HH:mm:ss";
  const d = parseInt(num + "000");
  return dayjs(d).format(format1);
};

const handleReminder = (startTime: number, endTime: number) => {
  if (!window || !startTime || !endTime) return;
  const start =
    new Date(startTime * 1000).getFullYear() +
    new Date(startTime * 1000).getMonth() +
    new Date(startTime * 1000).getDay() +
    "T" +
    new Date(startTime * 1000).getHours() +
    new Date(startTime * 1000).getMinutes();
  const end =
    new Date(endTime * 1000).getFullYear() +
    new Date(endTime * 1000).getMonth() +
    new Date(endTime * 1000).getDay() +
    "T" +
    new Date(endTime * 1000).getHours() +
    new Date(endTime * 1000).getMinutes();
  window?.open(`https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start}/${end}&text=Yego`, "_blank");
};

type Props = {
  selectedMarket: Market;
  setSelectedMarket: React.Dispatch<React.SetStateAction<Market | undefined>>;
  // coingeckoPrices: any;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  APYData: APYDataFull[];
  coingeckoPrices: CoingeckoPrices;
  latestAPYs: (APYData | undefined)[];
};

// const COLORS = ["#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

// const getLockupPeriod = (duration: string) => {
//   const lockupPeriod = Number(duration) / 86400;
//   //for testing
//   return lockupPeriod >= 1 ? numeral(lockupPeriod).format("0.[0]") + " Days" : Number(duration) / 60 + " Mins";
// };

const MarketDetail: React.FC<Props> = (props: Props) => {
  const {
    selectedMarket,
    setSelectedMarket,
    // coingeckoPrices,
    setModal,
    setMarkets,
    APYData,
    coingeckoPrices,
    latestAPYs,
  } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [selectedDepositAssetIndex, setSelectedDepositAssetIndex] = useState(0);
  // const [stratChartColor, setStratChartColor] = useState<string>(COLORS[0]);
  const [simulDeposit, setSimulDeposit] = useState(false);

  const [toggleChartTranche, setToggleChartTranche] = useState<number>(0);

  //NEW SHIT: invested is assets in cycle => queueWithdrawal
  const { balance, invested, fetchBalance } = useTrancheBalance(
    selectedMarket.network,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.isMulticurrency
  );

  const { MCbalance, MCinvested, fetchMCBalance } = useMulticurrencyTrancheBalance(
    //don't need { MCinvested } for now
    selectedMarket.network,
    selectedMarket.address,
    selectedMarket.abi,
    selectedMarket.assets.length,
    !selectedMarket.isMulticurrency
  );

  useEffect(() => {
    account && selectedMarket.isMulticurrency ? fetchMCBalance() : fetchBalance();
  }, [account, fetchMCBalance, fetchBalance, selectedMarket.isMulticurrency]);

  //don't know why this is here but keep just in case
  // const principalTVL = selectedMarket.tranches.reduce((acc: number, next: Tranche) => acc + Number(next.target), 0);

  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div className="info-block pointer" onClick={() => setSelectedMarket(undefined)}>
            <Arrow />
          </div>
          <div className="info-block">
            <span className="portfolio-name">{selectedMarket.portfolio}</span>
            {/* <span className="blocktext listing-date">Listing date: {selectedMarket.listingDate}</span> */}
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
          <div className="title">TVL: </div>
          <div>
            <span className="tvl">{numeral(selectedMarket.tvl).format("0,0.0000")} </span>
            {selectedMarket.assets[0] === "WBNB" || "WAVAX" ? selectedMarket.assets[0] : "$"}
          </div>
        </div>
        <div className="clock-div">
          <div className="next-cycle">
            Next Cycle <br />
            <span className="countdown">
              <Countdown
                date={
                  (Number(selectedMarket.duration) +
                    Number(selectedMarket.actualStartAt) +
                    Number(selectedMarket.investmentWindow)) *
                  1000
                }
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  return (
                    <span>
                      {!completed && (
                        <>
                          {hours} Hours {minutes} Minutes {seconds} Seconds
                        </>
                      )}
                    </span>
                  );
                }}
              />
            </span>
          </div>
          <div className="active-cycle">
            {selectedMarket.status === "PENDING" ? "Last" : "Active"} Cycle
            {" " + formatTimestamp(selectedMarket.actualStartAt ? selectedMarket.actualStartAt : 0)} -
            {" " +
              formatTimestamp(
                Number(selectedMarket.actualStartAt ? selectedMarket.actualStartAt : 0) +
                  Number(selectedMarket.duration ? selectedMarket.duration : 0)
              )}{" "}
          </div>
          {selectedMarket.status === "ACTIVE" && (
            <div
              className="button"
              onClick={() =>
                handleReminder(
                  Number(selectedMarket.actualStartAt),
                  Number(selectedMarket.actualStartAt) + Number(selectedMarket.duration)
                )
              }
            >
              Remind Me
            </div>
          )}
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
      <div className="tvl-bar blurb">
        {selectedMarket.strategyBlurbs.map((b, i) => (
          <p key={i}>
            {b}
            <br />
          </p>
        ))}
      </div>
      <div className="charts">
        <div className="chart-block portfolio-block">
          <div className="background left-br right-br">
            <h3>Strategy Composition</h3>
            <PortfolioChart strategyFarms={selectedMarket.strategyFarms} />
          </div>
        </div>
        <TrancheStructure
          tranches={selectedMarket.tranches}
          totalTranchesTarget={selectedMarket.totalTranchesTarget}
          toggleChartTranche={toggleChartTranche}
          setToggleChartTranche={setToggleChartTranche}
        />
        <div className="chart-block historical-performance">
          <div className="background left-br right-br">
            <h3>Historical Performance</h3>
            {APYData ? (
              <StrategyChart
                APYdata={APYData}
                strategyFarms={selectedMarket.strategyFarms}
                coingeckoPrices={coingeckoPrices}
                tranches={selectedMarket.tranches}
                trancheCount={selectedMarket.trancheCount}
                toggleChartTranche={toggleChartTranche}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
      {account ? (
        <ClaimRedeposit
          network={selectedMarket.network}
          selectedMarket={selectedMarket}
          // coingeckoPrices={coingeckoPrices}
          selectedDepositAssetIndex={selectedDepositAssetIndex}
          balance={selectedMarket.isMulticurrency ? MCbalance : balance}
          invested={selectedMarket.isMulticurrency ? MCinvested : invested}
          // simulDeposit={simulDeposit}
          setModal={setModal}
          // setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
          // setSimulDeposit={setSimulDeposit}
          setMarkets={setMarkets}
        />
      ) : (
        <div className="tvl-bar wallet-not-connected">
          <div>Wallet Not Connected</div>
        </div>
      )}
      <Deposit
        selectedMarket={selectedMarket}
        // coingeckoPrices={coingeckoPrices}
        selectedDepositAssetIndex={selectedDepositAssetIndex}
        setSelectedDepositAssetIndex={setSelectedDepositAssetIndex}
        simulDeposit={simulDeposit}
        setSimulDeposit={setSimulDeposit}
        setModal={setModal}
        setMarkets={setMarkets}
        balance={selectedMarket.isMulticurrency ? MCbalance : balance}
        latestAPYs={latestAPYs}
      />
    </div>
  );
};

export default MarketDetail;
