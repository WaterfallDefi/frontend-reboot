import "./MyPortfolio.scss";

import React, { useEffect, useMemo, useState } from "react";

import BigNumber from "bignumber.js";
import numeral from "numeral";

// import { Web3Provider } from "@ethersproject/providers";
// import { useWeb3React } from "@web3-react/core";

import TableRow from "../shared/TableRow";
import {
  Market,
  // PORTFOLIO_STATUS, UserInvest
} from "../types";
import {
  APYData,
  // ModalProps,
  Mode,
} from "../WaterfallDefi";
// import NoData from "./svgs/NoData";
import { usePositions } from "./hooks/usePositions";
// import PortfolioFold from "./subcomponents/PortfolioFold";
import { useTrancheBalance } from "../markets/hooks/useTrancheBalance";

//new shit
import { MarketList } from "../config/markets";
import NoData from "./svgs/NoData";

const BIG_TEN = new BigNumber(10);

const STATUSES: { name: string; value: string; status: number }[] = [
  { name: "All", value: "ALL", status: -1 },
  { name: "Pending", value: "PENDING", status: 0 },
  { name: "Active", value: "ACTIVE", status: 1 },
  { name: "Matured", value: "EXPIRED", status: 2 },
];

const headers = [
  "Portfolio Name",
  "Tranche",
  "Latest APY",
  "Principal Pending",
  "Next Cycle",
  "Principal",
  "Principal + Yield",
  "Assets Withdrawable",
];

type Props = {
  //may need network yo
  mode: Mode;
  markets: Market[];
  latestAPYs: (APYData | undefined)[];
};

function MyPortfolio(props: Props) {
  //**TODO: dropped a "logged out" prop in here to reset back to "No Data"
  const { mode, markets, latestAPYs } = props;
  // const { account } = useWeb3React<Web3Provider>();
  // const { price: wtfPrice } = useWTFPriceLP();

  const positions = usePositions(markets);
  //positions return array tuple: [0: Fixed Tranche Invested, 1: Variable Tranche Invested, 2: Fixed Tranche Pending, 3: Variable Tranche Pending]

  //new shit
  //**CURRENTLY HARDCODED TO MarketList[0] : THIS NEEDS TO CHANGE IF WE EVER ADD MORE PRODUCTS
  const {
    balance,
    invested,
    // fetchBalance
  } = useTrancheBalance(MarketList[0].network, MarketList[0].address, MarketList[0].abi, MarketList[0].isMulticurrency);

  const [dateToNextCycle, setDateToNextCycle] = useState<Number>(0);

  useEffect(() => {
    markets.length > 0 && markets[0].duration && markets[0].actualStartAt
      ? setDateToNextCycle(Number(markets[0].duration) + Number(markets[0].actualStartAt))
      : setDateToNextCycle(0);
  }, [markets]);

  const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const [headerSort, setHeaderSort] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const investPendingAgg = useMemo(
    () =>
      positions.length > 0
        ? numeral(
            new BigNumber(positions[0][2][0]._hex)
              .plus(new BigNumber(positions[0][3][0]._hex))
              .dividedBy(BIG_TEN.pow(18))
              .toString()
          ).format("0,0.[000000]")
        : "-",
    [positions]
  );

  const investAgg = useMemo(
    () =>
      positions.length > 0
        ? numeral(
            new BigNumber(positions[0][0][1]._hex)
              .plus(new BigNumber(positions[0][1][1]._hex))
              .dividedBy(BIG_TEN.pow(18))
              .toString()
          ).format("0,0.[000000]")
        : "-",
    [positions]
  );

  //refine this later
  const usersInvestsPayload = useMemo(
    () =>
      positions.length > 0
        ? [
            {
              data: {
                portfolio: "LSD Finance",
                tranche: "Fixed",
                APY: latestAPYs[0] ? latestAPYs[0].y + "%" : "-",
                userInvestPending:
                  positions.length > 0
                    ? numeral(new BigNumber(positions[0][2][0]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format(
                        "0,0.[000000]"
                      )
                    : "-",
                nextCycle: dateToNextCycle,
                userInvest:
                  positions.length > 0
                    ? numeral(new BigNumber(positions[0][0][1]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format(
                        "0,0.[000000]"
                      )
                    : "-",
                assetsPlusReturn: "",
                assetsWithdrawable: "",
              },
              pointer: false,
            },
            {
              data: {
                portfolio: "LSD Finance",
                tranche: "Degen",
                APY: latestAPYs[1] ? latestAPYs[1].y + "%" : "-",
                userInvestPending:
                  positions.length > 0
                    ? // numeral(
                      new BigNumber(positions[0][3][0]._hex).dividedBy(BIG_TEN.pow(18)).toString()
                    : // )
                      // .format(
                      //     "0,0.[000000]"
                      //   )
                      "-",
                nextCycle: dateToNextCycle,
                userInvest:
                  positions.length > 0
                    ? //  numeral(
                      new BigNumber(positions[0][1][1]._hex).dividedBy(BIG_TEN.pow(18)).toString()
                    : // )
                      // .format(
                      //     "0,0.[000000]"
                      //   )
                      "-",
                assetsPlusReturn: "",
                assetsWithdrawable: "",
              },
              pointer: false,
            },
            {
              data: {
                portfolio: "LSD Finance",
                tranche: "Aggregate",
                APY: "",
                userInvestPending: investPendingAgg,
                nextCycle: dateToNextCycle,
                userInvest: investAgg,
                assetsPlusReturn: invested,
                assetsWithdrawable: balance,
              },
              pointer: true,
            },
          ].map((tr: any, i) => <TableRow key={i} data={tr.data} pointer={tr.pointer} />)
        : undefined,
    [latestAPYs, positions, balance, invested, investPendingAgg, investAgg, dateToNextCycle]
  );

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);
  };
  const handleTranchesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTranche(Number(event.target.value));
  };
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(Number(event.target.value));
  };

  return (
    <div className={"my-portfolio-wrapper " + mode}>
      <div className="filters">
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(e)}>
          {STATUSES.map((s, i) => (
            <option key={i} value={s.status.toString()}>
              {s.name}
            </option>
          ))}
        </select>
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAssetChange(e)}>
          <option value="ALL">All</option>
          <option value="DAI.e">DAI.e</option>
          <option value="WAVAX">WAVAX</option>
          <option value="BUSD">BUSD</option>
          <option value="WBNB">WBNB</option>
          <option value="USDT">USDT</option>
        </select>
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTranchesChange(e)}>
          <option value="-1">All</option>
          <option value="0">Senior / Fixed</option>
          <option value="1">Mezzanine / Variable</option>
          <option value="2">Junior</option>
        </select>
      </div>
      <div className="header-row">
        {headers.map((h, i) => (
          <div
            key={i}
            className={"header" + (i === 0 ? " first" : i === headers.length - 1 ? " last" : "")}
            onClick={() => {
              if (headerSort !== i) {
                setSortAsc(true);
                setHeaderSort(i);
              } else {
                setSortAsc(!sortAsc);
              }
            }}
          >
            <span className="header-title">
              {h}
              {headerSort !== i && <span className="asc">▲</span>}
              {headerSort === i && sortAsc && <span className="asc active">▲</span>}
              {headerSort === i && !sortAsc && <span className="desc active">▼</span>}
            </span>
          </div>
        ))}
      </div>
      {usersInvestsPayload ? (
        Number(invested) === 0 && Number(balance) === 0 && Number(investPendingAgg) === 0 ? (
          <div className="no-data">
            <span>No Positions</span>
          </div>
        ) : (
          usersInvestsPayload
        )
      ) : (
        <div className="no-data">
          <NoData />
          <span>No Data</span>
        </div>
      )}
    </div>
  );
}

export default MyPortfolio;
