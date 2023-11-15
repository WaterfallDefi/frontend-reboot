import "./MyPortfolio.scss";

import React, { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import TableRow from "../shared/TableRow";
import { Market, StrategyFarm } from "../types";
import { APYData, APYDataFull, Modal, ModalProps, Mode } from "../Yego";
// import NoData from "./svgs/NoData";
import { usePositions } from "./hooks/usePositions";
// import PortfolioFold from "./subcomponents/PortfolioFold";
import { useTrancheBalance } from "../markets/hooks/useTrancheBalance";

//new shit
import { MarketList } from "../config/markets";
import NoData from "./svgs/NoData";
import useWithdraw from "../markets/hooks/useWithdraw";
import useRedeemDirect from "../markets/hooks/useRedeemDirect";
import useUserInfo from "../markets/hooks/useUserInfo";
import { CoingeckoPrices } from "../markets/Markets";

const BIG_TEN = new BigNumber(10);

const formatBigNumber2HexString = (bn: BigNumber) => {
  return "0x" + bn.toString(16);
};

// const STATUSES: { name: string; value: string; status: number }[] = [
//   { name: "All", value: "ALL", status: -1 },
//   { name: "Pending", value: "PENDING", status: 0 },
//   { name: "Active", value: "ACTIVE", status: 1 },
//   { name: "Matured", value: "EXPIRED", status: 2 },
// ];

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
  latestSeniorAPY: APYDataFull;
  latestJuniorAPY: APYDataFull;
  coingeckoPrices: CoingeckoPrices;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

function MyPortfolio(props: Props) {
  //**TODO: dropped a "logged out" prop in here to reset back to "No Data"
  const { mode, markets, latestSeniorAPY, latestJuniorAPY, coingeckoPrices, setModal, setMarkets } = props;

  //UPGRADED to add "balanceOf" to multicall!
  const positions = usePositions(markets);
  //positions return array tuple: [0: Fixed Tranche Invested, 1: Variable Tranche Invested, 2: Fixed Tranche Pending, 3: Variable Tranche Pending]

  //new shit
  //**CURRENTLY HARDCODED TO MarketList[0] : THIS NEEDS TO CHANGE IF WE EVER ADD MORE PRODUCTS
  //delete this after 1. unfolding positions rendering structure, and 2. folding balance and invested retrieval from usePositions
  const {
    balance,
    invested,
    // fetchBalance
  } = useTrancheBalance(MarketList[0].network, MarketList[0].address, MarketList[0].abi, MarketList[0].isMulticurrency);

  const { getUserInfo } = useUserInfo(MarketList[0].network, MarketList[0].address, MarketList[0].abi);

  const [dateToNextCycle, setDateToNextCycle] = useState<Number>(0);

  const [withdrawalQueued, setWithdrawalQueued] = useState(false);
  const [withdrawalQueuedPending, setWithdrawalQueuedPending] = useState(true);

  useEffect(() => {
    markets.length > 0 && markets[0].duration && markets[0].actualStartAt
      ? setDateToNextCycle(Number(markets[0].duration) + Number(markets[0].actualStartAt))
      : setDateToNextCycle(0);
  }, [markets]);

  useEffect(() => {
    if (withdrawalQueuedPending) {
      getUserInfo().then((res) => {
        setWithdrawalQueued(!res); //isAuto true = invested, isAuto false = withdrawal queued
        setWithdrawalQueuedPending(false);
      });
    }
  }, [getUserInfo, withdrawalQueuedPending]);

  // const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  // const [selectedTranche, setSelectedTranche] = useState(-1);
  // const [selectedStatus, setSelectedStatus] = useState(-1);

  const { onWithdraw, onQueueWithdraw } = useWithdraw(
    MarketList[0].network,
    MarketList[0].address,
    MarketList[0].abi,
    setModal,
    setMarkets
  );

  const { onRedeemDirect } = useRedeemDirect(
    MarketList[0].network,
    MarketList[0].address,
    MarketList[0].abi,
    setModal,
    setMarkets
  );

  const investAgg = useMemo(
    () =>
      positions.length > 0
        ? numeral(
            new BigNumber(positions[0][0][1]._hex)
              .plus(new BigNumber(positions[0][1][1]._hex))
              //changed to 6 for USDC
              .dividedBy(BIG_TEN.pow(6))
              .toString()
          ).format("0,0.[000000]")
        : "-",
    [positions]
  );

  // const [headerSort, setHeaderSort] = useState<number>(-1);
  // const [sortAsc, setSortAsc] = useState<boolean>(true);

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
      //changed to 6 for USDC
      await onWithdraw(formatBigNumber2HexString(new BigNumber(balance).times(BIG_TEN.pow(6))));
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
      await onQueueWithdraw;
      setModal({
        state: Modal.Txn,
        txn: undefined,
        status: "SUCCESS",
        message: "Queue Withdrawal Success",
      });
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

  function calculateAPR(selectedMarket: Market) {
    //actual
    const _latestSeniorAPY = latestSeniorAPY;
    const _latestJuniorAPY = latestJuniorAPY;

    const sum = _latestSeniorAPY?.principal + _latestJuniorAPY?.principal;
    const thicknesses = [_latestSeniorAPY?.principal / sum, _latestJuniorAPY?.principal / sum];

    const seniorTrancheAPR = new BigNumber(String(_latestSeniorAPY?.y)).toNumber();
    const juniorTrancheAPR = new BigNumber(String(_latestJuniorAPY?.y)).toNumber();

    //find prices of tokens
    //ONLY FINDING CURRENT PRICE FOR NOW
    const farmTokensPrices = _latestSeniorAPY
      ? _latestSeniorAPY.farmTokens.map((add: string) => {
          const targetFarm: StrategyFarm = selectedMarket.strategyFarms.filter(
            (f) => f.farmTokenContractAddress === add
          )[0];
          return coingeckoPrices[targetFarm.dataId]?.usd;
        })
      : [];

    const rewardsUSDValues = _latestSeniorAPY
      ? _latestSeniorAPY.farmTokensAmt.map(
          (amt: number, i: number) => new BigNumber(amt).dividedBy(BIG_TEN.pow(18)).toNumber() * farmTokensPrices[i]
        )
      : [];

    const totalReward = rewardsUSDValues.reduce((acc: number, next: number) => acc + next, 0);

    const principal = _latestSeniorAPY ? _latestSeniorAPY.principal : 0;
    const duration = _latestSeniorAPY ? _latestSeniorAPY.duration : 0;

    const rawYieldForCycle = principal > 0 ? (principal + totalReward) / principal : 1;

    const durationYearMultiplier = 31536000 / duration;

    const rewardAPR = (rawYieldForCycle - 1) * 100 * durationYearMultiplier;

    const seniorRewardAPR = rewardAPR * (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);
    const juniorRewardAPR = rewardAPR - seniorRewardAPR;

    const seniorAPYData: APYData = { id: "0-", x: new Date(), y: seniorTrancheAPR + seniorRewardAPR };

    const juniorAPYData: APYData = { id: "1-", x: new Date(), y: juniorTrancheAPR + juniorRewardAPR };

    return [seniorAPYData, juniorAPYData];
  }

  // const latestAPYs = calculateAPR(markets[0]);

  const latestAPYs = markets.map((m) => calculateAPR(m));

  const usersInvestPayload = useMemo(
    () =>
      //calculations
      positions
        .map((p: Market, i: number) => {
          return [
            {
              data: {
                portfolio: p.portfolio,
                tranche: "Fixed",
                APY: latestAPYs[i] ? latestAPYs[i][0].y + "%" : "-",
                nextCycle: dateToNextCycle,
                userInvest:
                  // positions[i] this market's positions
                  // [0] the tranche
                  // [1] the returned argument index, argument 0 is just cycle ffs
                  positions.length > 0
                    ? //changed to 6 for USDC
                      numeral(new BigNumber(positions[i][0][1]._hex).dividedBy(BIG_TEN.pow(6)).toString()).format(
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
                portfolio: p.portfolio,
                tranche: "Degen",
                APY: latestAPYs[i] ? latestAPYs[i][1].y + "%" : "-",
                nextCycle: dateToNextCycle,
                userInvest:
                  positions.length > 0
                    ? //changed to 6 for USDC
                      numeral(new BigNumber(positions[i][1][1]._hex).dividedBy(BIG_TEN.pow(6)).toString()).format(
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
                portfolio: "YEGO Finance",
                tranche: "Aggregate",
                APY: "",
                nextCycle: dateToNextCycle,
                userInvest: numeral(
                  new BigNumber(positions[i][0][1]._hex)
                    .plus(new BigNumber(positions[i][1][1]._hex))
                    //changed to 6 for USDC
                    .dividedBy(BIG_TEN.pow(6))
                    .toString()
                ).format("0,0.[000000]"),

                //invested and balance of are therefore the "third tranche" (there is no third tranche)
                assetsPlusReturn: positions[i][2][1], //invested is argument 1
                assetsWithdrawable: positions[i][2][0], //balance is argument 0
              },
              pointer: true,
            },
          ];
          //render
        })
        .map((tr: any, i: number) => <TableRow key={i} data={tr.data} pointer={tr.pointer} />),
    [positions, dateToNextCycle, latestAPYs]
  );

  //refine this later
  // const usersInvestsPayload = useMemo(
  //   () =>
  //     positions.length > 0
  //       ? [
  //           {
  //             data: {
  //               portfolio: "YEGO Finance",
  //               tranche: "Fixed",
  //               APY: latestAPYs[0] ? latestAPYs[0].y + "%" : "-",
  //               nextCycle: dateToNextCycle,
  //               userInvest:
  //                 positions.length > 0
  //                   ? //changed to 6 for USDC
  //                     numeral(new BigNumber(positions[0][0][1]._hex).dividedBy(BIG_TEN.pow(6)).toString()).format(
  //                       "0,0.[000000]"
  //                     )
  //                   : "-",
  //               assetsPlusReturn: "",
  //               assetsWithdrawable: "",
  //             },
  //             pointer: false,
  //           },
  //           {
  //             data: {
  //               portfolio: "YEGO Finance",
  //               tranche: "Risk-On",
  //               APY: latestAPYs[1] ? latestAPYs[1].y + "%" : "-",
  //               nextCycle: dateToNextCycle,
  //               userInvest:
  //                 positions.length > 0
  //                   ? //  numeral(
  //                     //changed to 6 for USDC
  //                     new BigNumber(positions[0][1][1]._hex).dividedBy(BIG_TEN.pow(6)).toString()
  //                   : // )
  //                     // .format(
  //                     //     "0,0.[000000]"
  //                     //   )
  //                     "-",
  //               assetsPlusReturn: "",
  //               assetsWithdrawable: "",
  //             },
  //             pointer: false,
  //           },
  //           {
  //             data: {
  //               portfolio: "YEGO Finance",
  //               tranche: "Aggregate",
  //               APY: "",
  //               // userInvestPending: investPendingAgg,
  //               nextCycle: dateToNextCycle,
  //               userInvest: investAgg,
  //               assetsPlusReturn: invested,
  //               assetsWithdrawable: balance,
  //             },
  //             pointer: true,
  //           },
  //         ].map((tr: any, i) => <TableRow key={i} data={tr.data} pointer={tr.pointer} />)
  //       : undefined,
  //   [latestAPYs, positions, balance, invested, investAgg, dateToNextCycle]
  // );

  // const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedAsset(event.target.value);
  // };
  // const handleTranchesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedTranche(Number(event.target.value));
  // };
  // const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedStatus(Number(event.target.value));
  // };

  return (
    <div className={"my-portfolio-wrapper " + mode} id="my-portfolio">
      {/* <div className="filters">
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
      </div> */}
      <div className="header-row">
        {headers.map((h, i) => (
          <div
            key={i}
            className={"header" + (i === 0 ? " first" : i === headers.length - 1 ? " last" : "")}
            // onClick={() => {
            //   if (headerSort !== i) {
            //     setSortAsc(true);
            //     setHeaderSort(i);
            //   } else {
            //     setSortAsc(!sortAsc);
            //   }
            // }}
          >
            <span className="header-title">
              {h}
              {/* {headerSort !== i && <span className="asc">▲</span>}
              {headerSort === i && sortAsc && <span className="asc active">▲</span>}
              {headerSort === i && !sortAsc && <span className="desc active">▼</span>} */}
            </span>
          </div>
        ))}
      </div>
      {usersInvestPayload ? (
        Number(invested) === 0 && Number(balance) === 0 ? (
          <div className="no-data">
            <span>No Positions</span>
          </div>
        ) : (
          [
            usersInvestPayload,
            <div className="my-portfolio-buttons">
              <button
                className="claim-redep-btn"
                onClick={() => {
                  queueWithdrawAll();
                }}
                // loading={withdrawAllLoading}
                disabled={!+invested || withdrawalQueued}
              >
                Queue Withdrawal
              </button>
              <button
                className="claim-redep-btn"
                onClick={() => {
                  withdrawAll();
                }}
                // loading={withdrawAllLoading}
                disabled={!+balance}
              >
                Withdraw
              </button>
            </div>,
          ]
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
