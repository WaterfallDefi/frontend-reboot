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
import getWTFApr, { formatAllocPoint } from "../hooks/getWtfApr";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
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
  const { price: wtfPrice } = useWTFPriceLP();

  const positions = usePositions(markets);

  const [loaded, setLoaded] = useState<boolean>(false);
  const [subgraph, setSubgraph] = useState<any>([]);

  const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const [headerSort, setHeaderSort] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubgraph = async () => {
      const subgraphQuery = await fetchSubgraphQuery(account);
      setSubgraph(subgraphQuery);
      setLoaded(true);
    };

    fetchSubgraph();
  }, [account]);

  const _investHistoryResult = useMemo(() => (subgraph && subgraph.length > 0 ? [...subgraph] : []), [subgraph]);

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
                principal: null,
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

  const userInvestsPayload: { userInvests: UserInvest[] }[] = useMemo(() => [], []);
  let filteredCount = 0;
  for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
    if (!_investHistoryResult[marketIdx]) continue;
    const { userInvests, trancheCycles } = _investHistoryResult[marketIdx];
    const filtered = userInvests?.filter((_userInvest: any) => {
      if (!trancheCycles) return false;
      const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
      // if (!markets[marketIdx].isMulticurrency && _userInvest.principal === "0") return false;
      // if (markets[marketIdx].isMulticurrency && _userInvest.MCprincipal.every((p: string) => Number(p) === 0))
      //   return false;
      if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return false;
      if (selectedAsset !== "ALL" && !markets[marketIdx].assets.includes(selectedAsset.toString())) return false;
      if (
        selectedStatus > -1 &&
        trancheCycles[trancheCycleId] &&
        selectedStatus !== trancheCycles[trancheCycleId].state
      )
        return false;
      return true;
    });
    filteredCount += filtered.length;

    userInvestsPayload[marketIdx] = { userInvests: filtered };
  }

  const userInvestsPayloadPrerendered = useMemo(
    () =>
      userInvestsPayload
        .map((_userInvestMarket: { userInvests: UserInvest[] }, __idx) => {
          const { userInvests } = _userInvestMarket;
          const { trancheCycles } = _investHistoryResult[__idx];

          return userInvests.map<{ data: TableRowData; foldElement: JSX.Element }>(
            (_userInvest: UserInvest, _idx: number) => {
              const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;

              const trancheCycle: any = trancheCycles[trancheCycleId];

              const _market: any = markets[__idx];

              const tranchesDisplayText =
                _market.trancheCount === 3 ? ["Senior", "Mezzanine", "Junior"] : ["Fixed", "Variable"];

              const status =
                trancheCycle?.state === 0 || _market.status === PORTFOLIO_STATUS.PENDING
                  ? PORTFOLIO_STATUS.PENDING
                  : Number(_market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1
                  ? PORTFOLIO_STATUS.ACTIVE
                  : (Number(_market.cycle) !== trancheCycle?.cycle && trancheCycle?.state === 1) ||
                    trancheCycle?.state === 2
                  ? "MATURED"
                  : "";

              const isCurrentCycle = _market && _market.cycle === _userInvest.cycle.toString();

              const trancheAPY = isCurrentCycle ? _market.tranches[_userInvest.tranche].apy : _userInvest.earningsAPY;

              const isActiveCycle = Number(_market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1;

              const estimateYield = getEstimateYield(
                _userInvest.principal,
                trancheAPY,
                trancheCycle?.startAt,
                isActiveCycle
              );

              const multicurrencyEstimateYield = _userInvest.MCprincipal
                ? _userInvest.MCprincipal.map((p) =>
                    getEstimateYield(p, trancheAPY, trancheCycle?.startAt, isActiveCycle)
                  )
                : [];

              const wtfAPY = isCurrentCycle
                ? getWTFApr(
                    network,
                    formatAllocPoint(_market.pools[_userInvest.tranche], _market.totalAllocPoints),
                    _market.tranches[_userInvest.tranche],
                    _market.duration,
                    _market.rewardPerBlock,
                    wtfPrice,
                    _market.assets
                  )
                : "-";

              const netAPY = wtfAPY !== "-" ? Number(trancheAPY) + Number(numeral(wtfAPY).value()) : trancheAPY;

              return {
                data: {
                  portfolio: _market.portfolio,
                  network: _market.isAvax ? "AVAX" : "BNB",
                  assets: _market.assets,
                  trancheCycle: {
                    trancheCycle: trancheCycle?.state !== 0 ? trancheCycle : undefined,
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
                      trancheCycle?.state !== 2
                        ? !_market.isMulticurrency
                          ? estimateYield
                          : multicurrencyEstimateYield
                        : undefined,
                    assets: _market.assets,
                    interest: _userInvest.interest,
                  },
                },
                foldElement: (
                  <PortfolioFold
                    network={_market.isAvax ? Network.AVAX : Network.BNB}
                    trancheMasterAddress={_market.address}
                    masterWTFAddress={_market.masterChefAddress}
                    abi={_market.abi}
                    totalAmount={_userInvest.principal}
                    totalAmounts={_userInvest.MCprincipal}
                    assets={_market.assets}
                    isCurrentCycle={isCurrentCycle}
                    isPending={trancheCycle?.state === 0 || _market.status === PORTFOLIO_STATUS.PENDING}
                    isActive={trancheCycle?.state === 1}
                    currentTranche={_userInvest.tranche}
                    fee={_market.tranches[_userInvest.tranche].fee}
                    isMulticurrency={_market.isMulticurrency}
                    autorollImplemented={_market.autorollImplemented}
                    trancheCount={_market.trancheCount}
                    setModal={setModal}
                    setMarkets={setMarkets}
                  />
                ),
              };
            }
          );
        })
        .flat(),
    [_investHistoryResult, userInvestsPayload, markets, network, setMarkets, setModal, wtfPrice]
  );

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
                return a.data.network === "AVAX" ? 1 : -1;
              case 2:
                return a.data.assets[0].localeCompare(b.data.assets[0]);
              case 4:
                return a.data.tranche.localeCompare(b.data.tranche);
              default:
                return 0;
            }
          }
        )
        .map((tr: { data: TableRowData; foldElement: JSX.Element }) => (
          <TableRow data={tr.data} foldElement={tr.foldElement} />
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
            <span>
              {headerSort === i ? (sortAsc ? "^ " : "v ") : null}
              {h}
            </span>
          </div>
        ))}
      </div>
      {!loaded ? (
        <div className="loading">Loading...</div>
      ) : sortAsc ? (
        userInvestsPayloadRendered
      ) : (
        [...userInvestsPayloadRendered].reverse()
      )}
      {loaded && filteredCount === 0 ? (
        <div className="no-data">
          <NoData />
          <span>No Data</span>
        </div>
      ) : null}
    </div>
  );
}

export default MyPortfolio;
