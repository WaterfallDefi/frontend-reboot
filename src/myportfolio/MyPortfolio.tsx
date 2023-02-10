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
  // ModalProps,
  Mode,
} from "../WaterfallDefi";
// import NoData from "./svgs/NoData";
import { usePositions } from "./hooks/usePositions";
// import PortfolioFold from "./subcomponents/PortfolioFold";
import { useTrancheBalance } from "../markets/hooks/useTrancheBalance";

//new shit
import { MarketList } from "../config/markets";
import { APYData } from "../markets/subcomponents/MarketDetail";
import { fetchSingleSubgraphCycleQuery } from "./hooks/useSubgraphQuery";

const BIG_TEN = new BigNumber(10);

const STATUSES: { name: string; value: string; status: number }[] = [
  { name: "All", value: "ALL", status: -1 },
  { name: "Pending", value: "PENDING", status: 0 },
  { name: "Active", value: "ACTIVE", status: 1 },
  { name: "Matured", value: "EXPIRED", status: 2 },
];

const headers = ["Tranche", "Latest APY", "Principal", "Assets Withdrawable", "Assets Invested"];

type Props = {
  //may need network yo
  mode: Mode;
  markets: Market[];
};

function MyPortfolio(props: Props) {
  const { mode, markets } = props;
  // const { account } = useWeb3React<Web3Provider>();
  // const { price: wtfPrice } = useWTFPriceLP();

  const positions = usePositions(markets);

  // console.log("MY PORTFOLIO POSITION");
  // console.log(positions[0]);

  //new shit
  //**CURRENTLY HARDCODED TO MarketList[0] : THIS NEEDS TO CHANGE IF WE EVER ADD MORE PRODUCTS
  const {
    balance,
    invested,
    // fetchBalance
  } = useTrancheBalance(MarketList[0].network, MarketList[0].address, MarketList[0].abi, MarketList[0].isMulticurrency);

  const [latestAPYs, setLatestAPYs] = useState<(APYData | undefined)[]>([]);

  useEffect(() => {
    const fetchSubgraph = async () => {
      const subgraphQuery: any = await fetchSingleSubgraphCycleQuery(MarketList[0].subgraphURL);
      const data = subgraphQuery.data.trancheCycles.map((tc: any) => ({
        id: tc.id,
        y: new BigNumber(tc.aprBeforeFee).dividedBy(BIG_TEN.pow(8)).times(100).toNumber(),
        x: new Date(Number(tc.endAt) * 1000),
      }));
      const _latestAPY = [];
      //fixed tranche, APYData already sorted by time, APY will never be 0 and that represents ongoing cycle
      _latestAPY.push(data.filter((apy: APYData) => apy.id.slice(0, 2) === "0-" && apy.y !== 0).pop());
      //variable tranche, APYData already sorted by time, APY will never be 0 and that represents ongoing cycle
      _latestAPY.push(data.filter((apy: APYData) => apy.id.slice(0, 2) === "1-" && apy.y !== 0).pop());
      //...junior tranche?? do we need??
      setLatestAPYs(_latestAPY);
    };

    fetchSubgraph();
  }, [markets]);

  const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const [headerSort, setHeaderSort] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  //refine this later
  const usersInvestsPayload = useMemo(
    () =>
      [
        {
          data: {
            trancheName: "Fixed",
            APY: latestAPYs[0] ? latestAPYs[0].y + "%" : "-",
            userInvest:
              positions.length > 0
                ? numeral(new BigNumber(positions[0][0][1]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format(
                    "0,0.[000000]"
                  )
                : "-",
            assetsWithdrawable: "",
            assetsInvested: "",
          },
        },
        {
          data: {
            trancheName: "Variable",
            APY: latestAPYs[1] ? latestAPYs[1].y + "%" : "-",
            userInvest:
              positions.length > 0
                ? numeral(new BigNumber(positions[0][1][1]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format(
                    "0,0.[000000]"
                  )
                : "-",
            assetsWithdrawable: "",
            assetsInvested: "",
          },
        },
        {
          data: {
            trancheName: "Aggregate",
            APY: "",
            userInvest:
              positions.length > 0
                ? numeral(
                    new BigNumber(positions[0][0][1]._hex)
                      .plus(new BigNumber(positions[0][1][1]._hex))
                      .dividedBy(BIG_TEN.pow(18))
                      .toString()
                  ).format("0,0.[000000]")
                : "-",
            assetsWithdrawable: balance,
            assetsInvested: invested,
          },
        },
      ].map((tr: any, i) => <TableRow key={i} data={tr.data} />),
    [latestAPYs, positions, balance, invested]
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
      {usersInvestsPayload}
      {/* {sortAsc ? userInvestsPayloadRendered : [...userInvestsPayloadRendered].reverse()}
      {userInvestsPayloadRendered.length === 0 ? (
        <div className="no-data">
          <NoData />
          <span>No Data</span>
        </div>
      ) : null} */}
    </div>
  );
}

export default MyPortfolio;
