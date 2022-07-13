import "./MyPortfolio.scss";

import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import numeral from "numeral";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import TableRow from "../shared/TableRow";
import { Market, PORTFOLIO_STATUS, UserInvest } from "../types";
import { Mode, Network } from "../WaterfallDefi";
import { fetchSubgraphQuery } from "./hooks/useSubgraphQuery";
import NoData from "./svgs/NoData";
import { usePositions } from "./hooks/usePositions";

const BIG_TEN = new BigNumber(10);

const STATUSES: { name: string; value: string; status: number }[] = [
  { name: "All", value: "ALL", status: -1 },
  { name: "Pending", value: "PENDING", status: 0 },
  { name: "Active", value: "ACTIVE", status: 1 },
  { name: "Matured", value: "EXPIRED", status: 2 },
];

type Props = {
  mode: Mode;
  network: Network;
  markets: Market[];
};

function MyPortfolio(props: Props) {
  const { mode, network, markets } = props;
  const { account } = useWeb3React<Web3Provider>();

  const [loaded, setLoaded] = useState<boolean>(false);

  const positions = usePositions(network, markets);

  const [userInvestsPayload, setUserInvestsPayload] = useState<{ userInvests: UserInvest[]; trancheCycles: any }[]>();
  const [filteredPayload, setFilteredPayload] = useState<{ userInvests: UserInvest[]; trancheCycles: any }[]>();
  const [filtered, setFiltered] = useState<number>(0);

  const [selectedAsset, setSelectedAsset] = useState<string>("ALL");
  const [selectedTranche, setSelectedTranche] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  useEffect(() => {
    if (!account) setLoaded(true);
    if (!loaded) {
      const subgraph = fetchSubgraphQuery(account);

      let subgraphQueryResult;
      let _investHistoryResult: any[];

      subgraph.then((res) => {
        subgraphQueryResult = res;
        _investHistoryResult = subgraphQueryResult.length > 0 ? [...subgraphQueryResult] : [];

        for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
          const _subgraphResultMarket = subgraphQueryResult[marketIdx];
          if (!_subgraphResultMarket) continue;

          const _markets = markets.filter((m) => (network === Network.AVAX ? m.isAvax : !m.isAvax));
          const _market = _markets[marketIdx];

          const { userInvests: _userInvests } = _subgraphResultMarket;

          const _position = positions[marketIdx];

          let userInvests = _userInvests.filter((_userInvest: UserInvest) => {
            if (_userInvest.cycle === Number(_market?.cycle) && _market.status === PORTFOLIO_STATUS.PENDING)
              return false;
            if (_userInvest.cycle === Number(_market?.cycle) && _market.status === PORTFOLIO_STATUS.ACTIVE)
              return false;
            return true;
          });

          let _cycle;
          const _MCprincipals: string[][] = [];

          console.log("_position");
          console.log(_position);

          if (_position) {
            //single currency
            if (!_market.isMulticurrency) {
              for (let i = 0; i < _position.length; i++) {
                //single currency cycle
                _cycle = new BigNumber(_position[i][0]._hex).toString();

                //single currency, i = individual tranche
                const _principal = !_market?.isMulticurrency
                  ? numeral(new BigNumber(_position[i][0]._hex).dividedBy(BIG_TEN.pow(18)).toString()).format(
                      "0,0.[0000]"
                    )
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
                console.log("MC principals");
                console.log(_MCprincipals);
                userInvests = [
                  ..._MCprincipals.map((p, ti) => {
                    return {
                      capital: "0",
                      cycle: Number(_market.cycle),
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
        setUserInvestsPayload(_investHistoryResult);
        setLoaded(true);
      });
    }
  }, [markets, network, account, positions, loaded]);

  useEffect(() => {
    if (!userInvestsPayload) return;
    let filteredCount = 0;
    const _investHistoryResult = [...userInvestsPayload];
    for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
      if (!_investHistoryResult[marketIdx]) continue;
      const { userInvests: _userInvests, trancheCycles } = _investHistoryResult[marketIdx];
      const filtered = _userInvests?.filter((_userInvest: any) => {
        //you have to filter in both places, becasue the first is simply to filter for the chain multicall, this one is to filter for render
        if (
          (markets[marketIdx].isAvax && network === Network.BNB) ||
          (!markets[marketIdx].isAvax && network === Network.AVAX)
        )
          return false;
        if (!trancheCycles) return false;
        const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
        // if (_userInvest?.principal.toString() === "0") return false;
        if (
          selectedStatus > -1 &&
          trancheCycles[trancheCycleId] &&
          selectedStatus !== trancheCycles[trancheCycleId].state
        )
          return false;
        if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return false;
        if (selectedAsset !== "ALL" && !markets[marketIdx].assets.includes(selectedAsset)) return false;

        return true;
      });
      filteredCount += filtered.length;

      _investHistoryResult[marketIdx] = { ..._investHistoryResult[marketIdx], userInvests: filtered };
    }
    setFilteredPayload(_investHistoryResult);
    setFiltered(filteredCount);
  }, [markets, network, selectedStatus, selectedTranche, selectedAsset, userInvestsPayload]);

  console.log("userInvestsPayload");
  console.log(userInvestsPayload);
  console.log("filteredPayload");
  console.log(filteredPayload);

  return loaded ? (
    <div className={"my-portfolio-wrapper " + mode}>
      <div className="filters">
        <select>
          {STATUSES.map((s) => (
            <option onClick={() => setSelectedStatus(s.status)}>{s.name}</option>
          ))}
        </select>
        <select>
          <option onClick={() => setSelectedAsset("ALL")}>All</option>
          {network === Network.AVAX && <option onClick={() => setSelectedAsset("DAI.e")}>DAI.e</option>}
          {network === Network.AVAX && <option onClick={() => setSelectedAsset("WAVAX")}>WAVAX</option>}
          {network === Network.BNB && <option onClick={() => setSelectedAsset("BUSD")}>BUSD</option>}
          {network === Network.BNB && <option onClick={() => setSelectedAsset("WBNB")}>WBNB</option>}
          {network === Network.BNB && <option onClick={() => setSelectedAsset("USDT")}>USDT</option>}
        </select>
        <select>
          <option onClick={() => setSelectedTranche(-1)}>All</option>
          <option onClick={() => setSelectedTranche(0)}>Senior</option>
          <option onClick={() => setSelectedTranche(1)}>Mezzanine</option>
          <option onClick={() => setSelectedTranche(2)}>Junior</option>
        </select>
      </div>
      <div className="header-row">
        <div className="header first">
          <span>Portfolio Name</span>
        </div>
        <div className="header">
          <span>Asset</span>
        </div>
        <div className="header">
          <span>Cycle</span>
        </div>
        <div className="header">
          <span>Tranche</span>
        </div>
        <div className="header">
          <span>APR</span>
        </div>
        <div className="header">
          <span>Principal</span>
        </div>
        <div className="header">
          <span>Status</span>
        </div>
        <div className="header last">
          <span>Yield</span>
        </div>
      </div>
      {filteredPayload &&
        filteredPayload
          // .filter((m) => m.network === network)
          .map((_userInvestMarket, __idx) => {
            const { userInvests, trancheCycles } = _userInvestMarket;

            return userInvests.map((_userInvest: UserInvest, _idx: number) => {
              const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;

              const trancheCycle = trancheCycles[trancheCycleId];

              const _market = markets[__idx];

              const tranchesDisplayText =
                _market.trancheCount === 3 ? ["Senior", "Mezzanine", "Junior"] : ["Fixed", "Variable"];

              const status =
                trancheCycle.state === 0 || _market.status === PORTFOLIO_STATUS.PENDING
                  ? PORTFOLIO_STATUS.PENDING
                  : Number(_market.cycle) === trancheCycle?.cycle && trancheCycle?.state === 1
                  ? PORTFOLIO_STATUS.ACTIVE
                  : (Number(_market.cycle) !== trancheCycle?.cycle && trancheCycle?.state === 1) ||
                    trancheCycle?.state === 2
                  ? "MATURED"
                  : "";

              return (
                <TableRow
                  key={__idx}
                  data={{
                    portfolio: _market.portfolio,
                    assets: _market.assets,
                    trancheCycle: {
                      trancheCycle: trancheCycle.state !== 0 ? trancheCycle : "--",
                      duration: _market.duration,
                    },
                    tranche: tranchesDisplayText[_userInvest.tranche],
                    apr_portfolio: "asdf",
                    principal: !_market.isMulticurrency ? _userInvest.principal : _userInvest.MCprincipal,
                    status: status,
                    yield: "asdf",
                  }}
                  openFold={true}
                />
              );
            });
          })}
      {filtered === 0 ? (
        <div className="no-data">
          <NoData />
          <span>No Positions</span>
        </div>
      ) : null}
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default MyPortfolio;
