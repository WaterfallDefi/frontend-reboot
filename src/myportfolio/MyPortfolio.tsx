import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import TableRow from "../shared/TableRow";
import { Market, PORTFOLIO_STATUS, UserInvest } from "../types";
import { Mode } from "../WaterfallDefi";
import "./MyPortfolio.scss";
import { useSubgraphQuery } from "./hooks/useSubgraphQuery";
import numeral from "numeral";
import NoData from "./svgs/NoData";

const BIG_TEN = new BigNumber(10);

type Props = {
  mode: Mode;
  markets: Market[];
};

function MyPortfolio(props: Props) {
  const { mode, markets } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [positions, setPositions] = useState<any[]>();

  const subgraph = useSubgraphQuery(
    undefined, //remove single market subgraph query because... why?? refactor out later
    account,
    markets
  );

  useEffect(() => {
    subgraph.then((res) => {
      setPositions(res);
    });
  }, []);

  const _investHistoryResult = positions ? [...positions] : [];

  for (
    let marketIdx = 0;
    marketIdx < _investHistoryResult.length;
    marketIdx++
  ) {
    const _subgraphResultMarket = _investHistoryResult[marketIdx];
    if (!_subgraphResultMarket) continue;
    const _market = markets[marketIdx];
    const { userInvests: _userInvests, trancheCycles } = _subgraphResultMarket;
    const _position = _investHistoryResult[marketIdx];

    let userInvests = _userInvests?.filter((_userInvest: UserInvest) => {
      if (
        _userInvest?.cycle === Number(_market?.cycle) &&
        _market?.status === PORTFOLIO_STATUS.PENDING
      )
        return false;
      if (
        _userInvest?.cycle === Number(_market?.cycle) &&
        _market?.status === PORTFOLIO_STATUS.ACTIVE
      )
        return false;
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
            ? numeral(
                new BigNumber(_position[i][1]._hex)
                  .dividedBy(BIG_TEN.pow(18))
                  .toString()
              ).format("0,0.[0000]")
            : "";

          if (
            _cycle == _market?.cycle &&
            (_market?.status === PORTFOLIO_STATUS.PENDING ||
              _market?.status === PORTFOLIO_STATUS.ACTIVE)
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
        //assume three tranches for now
        for (let j = 0; j < 3; j++) {
          _MCprincipals.push(
            _market.depositAssetAddresses.map((a, tokenIdx) =>
              numeral(
                new BigNumber(_position[j + 1 + tokenIdx * 3][0]._hex)
                  .dividedBy(BIG_TEN.pow(18))
                  .toString()
              ).format("0,0.[0000]")
            )
          );
        }
        if (
          _cycle == _market?.cycle &&
          (_market?.status === PORTFOLIO_STATUS.PENDING ||
            _market?.status === PORTFOLIO_STATUS.ACTIVE)
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

  const userInvestsPayload: { _userInvest: UserInvest[] }[] = [];
  let filteredCount = 0;
  for (
    let marketIdx = 0;
    marketIdx < _investHistoryResult.length;
    marketIdx++
  ) {
    if (!_investHistoryResult[marketIdx]) continue;
    const { userInvests: _userInvests, trancheCycles } =
      _investHistoryResult[marketIdx];
    const filtered = _userInvests?.filter((_userInvest: any) => {
      if (!trancheCycles) return false;
      const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
      if (_userInvest.principal == "0") return false;

      //DO FILTERS LATER

      // if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche)
      //   return false;
      // if (
      //   selectedAsset !== "ALL" &&
      //   !markets[marketIdx].assets.includes(selectedAsset)
      // )
      //   return false;
      // if (
      //   selectedStatus > -1 &&
      //   trancheCycles[trancheCycleId] &&
      //   selectedStatus !== trancheCycles[trancheCycleId].state
      // )
      //   return false;
      return true;
    });
    filteredCount += filtered.length;

    userInvestsPayload[marketIdx] = { _userInvest: filtered };
  }

  return (
    <div className={"my-portfolio-wrapper " + mode}>
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
      {userInvestsPayload.map((_userInvestMarket, __idx) => {
        const { _userInvest: userInvests } = _userInvestMarket;
        const { trancheCycles } = _investHistoryResult[__idx];

        return userInvests.map((_userInvest: UserInvest, _idx: number) => {
          const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;

          const trancheCycle = trancheCycles[trancheCycleId];

          const _market = markets[__idx];

          const tranchesDisplayText =
            _market.trancheCount === 3
              ? ["Senior", "Mezzanine", "Junior"]
              : ["Fixed", "Variable"];

          const status =
            trancheCycle.state === 0 ||
            _market.status === PORTFOLIO_STATUS.PENDING
              ? PORTFOLIO_STATUS.PENDING
              : Number(_market.cycle) === trancheCycle?.cycle &&
                trancheCycle?.state === 1
              ? PORTFOLIO_STATUS.ACTIVE
              : (Number(_market.cycle) !== trancheCycle?.cycle &&
                  trancheCycle?.state === 1) ||
                trancheCycle?.state === 2
              ? "MATURED"
              : "";

          return (
            <TableRow
              key={_market.portfolio}
              data={{
                portfolio: _market.portfolio,
                assets: _market.assets,
                trancheCycle: {
                  trancheCycle: trancheCycle.state !== 0 ? trancheCycle : "--",
                  duration: _market.duration,
                },
                tranche: tranchesDisplayText[_userInvest.tranche],
                apr_portfolio: "asdf",
                principal: !_market.isMulticurrency
                  ? _userInvest.principal
                  : _userInvest.MCprincipal,
                status: status,
                yield: "asdf",
              }}
              openFold={true}
            />
          );
        });
      })}
      {userInvestsPayload.length === 0 ? (
        <div className="no-data">
          <NoData />
          <span>No Positions</span>
        </div>
      ) : null}
    </div>
  );
}

export default MyPortfolio;
