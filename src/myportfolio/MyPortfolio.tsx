import "./MyPortfolio.scss";

import React, { useEffect, useMemo, useState } from "react";

import BigNumber from "bignumber.js";
import numeral from "numeral";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import TableRow from "../shared/TableRow";
import { Market, PORTFOLIO_STATUS, UserInvest } from "../types";
import { ModalProps, Mode, Network } from "../WaterfallDefi";
import { fetchSubgraphQuery } from "./hooks/useSubgraphQuery";
import NoData from "./svgs/NoData";
import { usePositions } from "./hooks/usePositions";
import { getEstimateYield } from "./hooks/getEstimateYield";
// import getWTFApr, { formatAllocPoint } from "../hooks/getWtfApr";
// import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import PortfolioFold from "./subcomponents/PortfolioFold";

const BIG_TEN = new BigNumber(10);

const STATUSES: { name: string; value: string; status: number }[] = [
  { name: "All", value: "ALL", status: -1 },
  { name: "Pending", value: "PENDING", status: 0 },
  { name: "Active", value: "ACTIVE", status: 1 },
  { name: "Matured", value: "EXPIRED", status: 2 },
];

const headers = ["Portfolio Name", "Network", "Asset", "Cycle", "Tranche", "APR", "Principal", "Status", "Yield"];

type Props = {
  mode: Mode;
  network: Network;
  markets: Market[];
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

type TableRowData = {
  portfolio: string;
  network: string;
  assets: string[];
  trancheCycle: {
    trancheCycle: any;
    duration: string | undefined;
  };
  tranche: string;
  apr_portfolio: {
    totalAPR: string;
    trancheName: string;
    APR: string;
    wtfAPR: string;
  };
  principal: {
    principal: string;
    MCprincipal: string[];
    assets: string[];
  };
  status: string;
  yield: {
    yield: string | string[] | undefined;
    assets: string[];
    interest: string;
  };
};

function MyPortfolio(props: Props) {
  const { mode, network, markets, setModal, setMarkets } = props;
  const { account } = useWeb3React<Web3Provider>();
  // const { price: wtfPrice } = useWTFPriceLP();

  const positions = usePositions(markets);

  const [subgraph, setSubgraph] = useState<any>(undefined);

  const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  const [selectedTranche, setSelectedTranche] = useState(-1);

  //aiyah... X_X return to this once we've figured out statuses
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const [headerSort, setHeaderSort] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubgraph = async () => {
      const subgraphQuery = await fetchSubgraphQuery(account);
      setSubgraph(subgraphQuery);
    };
    fetchSubgraph();
  }, [account]);

  const userInvestsPayloadPrerendered = useMemo(() => {
    const _investHistoryResult = subgraph && subgraph.length > 0 ? [...subgraph] : [];

    if (markets.length === 0) return [];

    for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
      const _subgraphResultMarket = subgraph[marketIdx];
      if (!_subgraphResultMarket) continue;
      const _market = markets[marketIdx];
      const { userInvests: _userInvests } = _subgraphResultMarket;
      const _position = positions[marketIdx];

      let userInvests = _userInvests?.filter((_userInvest: UserInvest) => {
        if (_userInvest?.cycle === Number(_market?.cycle) && _market?.status === PORTFOLIO_STATUS.PENDING) return false;
        if (_userInvest?.cycle === Number(_market?.cycle) && _market?.status === PORTFOLIO_STATUS.ACTIVE) return false;
        return true;
      });

      let _cycle;
      const _MCprincipals: string[][] = [];

      if (_position) {
        //single currency
        if (!_market.isMulticurrency) {
          for (let i = 0; i < _position.length; i++) {
            //single currency cycle
            _cycle = new BigNumber(_position[i][0]._hex).toString();

            //single currency, i = individual tranche
            const _principal = !_market?.isMulticurrency
              ? numeral(new BigNumber(_position[i][1]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format("0,0.[0000]")
              : "";

            if (
              _cycle === _market?.cycle &&
              (_market?.status === PORTFOLIO_STATUS.PENDING || _market?.status === PORTFOLIO_STATUS.ACTIVE)
            ) {
              userInvests = [
                {
                  capital: "0",
                  cycle: Number(_market?.cycle),
                  harvestAt: 0,
                  id: "",
                  investAt: 0,
                  owner: "",
                  principal: _principal,
                  tranche: i,
                  interest: "0",
                  earningsAPY: "NaN",
                },
                ...userInvests,
              ];
            }
          }
        } else {
          //multicurrency
          _cycle = new BigNumber(_position[0][0]._hex).toString();

          //multicurrency, j = individual tranche
          for (let j = 0; j < _market.trancheCount; j++) {
            _MCprincipals.push(
              _market.depositAssetAddresses.map((a, tokenIdx) =>
                numeral(
                  new BigNumber(_position[j + 1 + tokenIdx * _market.trancheCount][0]._hex)
                    .dividedBy(BIG_TEN.pow(18))
                    .toString()
                ).format("0,0.[0000]")
              )
            );
          }
          if (
            _cycle === _market?.cycle &&
            (_market?.status === PORTFOLIO_STATUS.PENDING || _market?.status === PORTFOLIO_STATUS.ACTIVE)
          ) {
            userInvests = [
              ..._MCprincipals.map((p, ti) => {
                return {
                  capital: "0",
                  cycle: Number(_market?.cycle),
                  harvestAt: 0,
                  id: "",
                  investAt: 0,
                  owner: "",
                  principal: "0",
                  MCprincipal: p,
                  tranche: ti,
                  interest: "0",
                  earningsAPY: "NaN",
                };
              }),
              ...userInvests,
            ];
          }
        }
      }
      _investHistoryResult[marketIdx].userInvests = userInvests;
    }

    const userInvestsPayload: { userInvests: UserInvest[] }[] = [];

    for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
      if (!_investHistoryResult[marketIdx]) continue;
      const {
        userInvests,
        //ALWAYS 24 HOURS
        // trancheCycles
      } = _investHistoryResult[marketIdx];
      const filtered = userInvests?.filter((_userInvest: any) => {
        // if (!trancheCycles) return false;
        // const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
        if (!markets[marketIdx].isMulticurrency && _userInvest.principal === "0") return false;
        if (markets[marketIdx].isMulticurrency && _userInvest.MCprincipal.every((p: string) => Number(p) === 0))
          return false;
        if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return false;
        if (selectedAsset !== "ALL" && !markets[marketIdx].assets.includes(selectedAsset.toString())) return false;
        // if (
        //   selectedStatus > -1 &&
        //   trancheCycles[trancheCycleId] &&
        //   selectedStatus !== trancheCycles[trancheCycleId].state
        // )
        //   return false;
        return true;
      });

      userInvestsPayload[marketIdx] = { userInvests: filtered };
    }

    return userInvestsPayload
      .map((_userInvestMarket: { userInvests: UserInvest[] }, __idx) => {
        const { userInvests } = _userInvestMarket;

        //no more tranche cycles!
        // const { trancheCycles } = _investHistoryResult[__idx];

        return userInvests.map<{ data: TableRowData; foldElement: JSX.Element }>(
          (_userInvest: UserInvest, _idx: number) => {
            // const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;

            // const trancheCycle: any = trancheCycles[trancheCycleId];

            const _market: Market = markets[__idx];

            const tranchesDisplayText =
              _market.trancheCount === 3 ? ["Senior", "Mezzanine", "Junior"] : ["Fixed", "Variable"];

            //this logic needs to be completely changed
            const status =
              // trancheCycle?.state === 0 || _market.status === PORTFOLIO_STATUS.PENDING
              //   ? PORTFOLIO_STATUS.PENDING
              //   : Number(_market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1
              //   ? PORTFOLIO_STATUS.ACTIVE
              //   : (Number(_market.cycle) !== trancheCycle?.cycle && trancheCycle?.state === 1) ||
              //     trancheCycle?.state === 2
              //   ? "MATURED"
              //   :
              "";

            const isCurrentCycle = _market && _market.cycle === _userInvest.cycle.toString();

            const trancheAPY = isCurrentCycle ? _market.tranches[_userInvest.tranche].apy : _userInvest.earningsAPY;

            //this logic needs to be completely changed
            const isActiveCycle =
              // Number(_market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1;
              true;

            const estimateYield = getEstimateYield(
              _userInvest.principal,
              trancheAPY,
              // trancheCycle?.startAt,
              isActiveCycle
            );

            const multicurrencyEstimateYield = _userInvest.MCprincipal
              ? _userInvest.MCprincipal.map((p) =>
                  getEstimateYield(
                    p,
                    trancheAPY,
                    // trancheCycle?.startAt,
                    isActiveCycle
                  )
                )
              : [];

            const wtfAPY =
              // isCurrentCycle
              //   ? getWTFApr(
              //       network,
              //       formatAllocPoint(_market.pools[_userInvest.tranche], _market.totalAllocPoints),
              //       _market.tranches[_userInvest.tranche],
              //       _market.duration,
              //       _market.rewardPerBlock,
              //       wtfPrice,
              //       _market.assets
              //     )
              //   :
              "-";

            const netAPY = wtfAPY !== "-" ? Number(trancheAPY) + Number(numeral(wtfAPY).value()) : trancheAPY;

            const networkStrings = {
              43114: "AVAX",
              56: "BNB",
              137: "MATIC",
            };

            return {
              data: {
                portfolio: _market.portfolio,
                network: networkStrings[_market.network],
                assets: _market.assets,
                trancheCycle: {
                  trancheCycle:
                    //no more trancheCycle
                    // trancheCycle?.state !== 0 ? trancheCycle :
                    undefined,
                  duration: _market.duration,
                },
                tranche: tranchesDisplayText[_userInvest.tranche],
                apr_portfolio: {
                  totalAPR: numeral(netAPY).format("0,0.[0000]"),
                  trancheName: tranchesDisplayText[_userInvest.tranche],
                  APR: numeral(trancheAPY).format("0,0.[0000]"),
                  wtfAPR: wtfAPY !== "-" ? wtfAPY + " %" : "Unavailable",
                },
                principal: {
                  principal: _userInvest.principal,
                  MCprincipal: _userInvest.MCprincipal,
                  assets: _market.assets,
                },
                status: status,
                yield: {
                  yield:
                    //no more trancheCycles
                    // trancheCycle?.state !== 2
                    //   ?
                    !_market.isMulticurrency ? estimateYield : multicurrencyEstimateYield,
                  // : undefined,
                  assets: _market.assets,
                  interest: _userInvest.interest,
                },
              },
              foldElement:
                _market.network === network ? (
                  <PortfolioFold
                    network={_market.network}
                    trancheMasterAddress={_market.address}
                    masterWTFAddress={_market.masterChefAddress}
                    abi={_market.abi}
                    totalAmount={_userInvest.principal}
                    totalAmounts={_userInvest.MCprincipal}
                    assets={_market.assets}
                    isCurrentCycle={isCurrentCycle}
                    isPending={false} //set to always false, the product is always running
                    isActive={true} //set to always true, the product is always running
                    currentTranche={_userInvest.tranche}
                    fee={_market.tranches[_userInvest.tranche].fee}
                    isMulticurrency={_market.isMulticurrency}
                    autorollImplemented={_market.autorollImplemented}
                    trancheCount={_market.trancheCount}
                    setModal={setModal}
                    setMarkets={setMarkets}
                  />
                ) : (
                  <div className="fold">
                    <div className="mini-wrapper">
                      Please switch network with the upper right corner dropdown to withdraw these funds.
                    </div>
                  </div>
                ),
            };
          }
        );
      })
      .flat();
  }, [
    positions,
    subgraph,
    selectedAsset,
    selectedTranche,
    // selectedStatus,
    markets,
    network,
    setMarkets,
    setModal,
  ]);

  const userInvestsPayloadRendered = useMemo(
    () =>
      userInvestsPayloadPrerendered
        .sort(
          (
            a: { data: TableRowData; foldElement: JSX.Element },
            b: { data: TableRowData; foldElement: JSX.Element }
          ) => {
            switch (headerSort) {
              case 0:
                return a.data.portfolio.localeCompare(b.data.portfolio);
              case 1:
                return a.data.network.localeCompare(b.data.network);
              case 2:
                return a.data.assets[0].localeCompare(b.data.assets[0]);
              case 4:
                return a.data.tranche.localeCompare(b.data.tranche);
              case 5:
                return Number(a.data.apr_portfolio.totalAPR) < Number(b.data.apr_portfolio.totalAPR)
                  ? -1
                  : Number(b.data.apr_portfolio.totalAPR) < Number(a.data.apr_portfolio.totalAPR)
                  ? 1
                  : 0;
              case 6:
                return Number(a.data.principal.principal) < Number(b.data.principal.principal)
                  ? -1
                  : Number(b.data.principal.principal) < Number(a.data.principal.principal)
                  ? 1
                  : 0;
              case 7:
                return a.data.status.localeCompare(b.data.status);
              default:
                return 0;
            }
          }
        )
        .map((tr: { data: TableRowData; foldElement: JSX.Element }, i) => (
          <TableRow key={i} data={tr.data} foldElement={tr.foldElement} />
        )),
    [userInvestsPayloadPrerendered, headerSort]
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
      {sortAsc ? userInvestsPayloadRendered : [...userInvestsPayloadRendered].reverse()}
      {userInvestsPayloadRendered.length === 0 ? (
        <div className="no-data">
          <NoData />
          <span>No Data</span>
        </div>
      ) : null}
    </div>
  );
}

export default MyPortfolio;
