import "./MyPortfolio.scss";

import React, { useEffect, useState } from "react";

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
import usePendingWTFReward from "../markets/hooks/usePendingWTFReward";
import { MasterChefAddress } from "../config/address";

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
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
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

  useEffect(() => {
    const fetchSubgraph = async () => {
      const subgraphQuery = await fetchSubgraphQuery(account);
      setSubgraph(subgraphQuery);
      setLoaded(true);
    };

    fetchSubgraph();
  }, [account]);

  const _investHistoryResult = subgraph && subgraph.length > 0 ? [...subgraph] : [];

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

  const userInvestsPayload: { userInvests: UserInvest[] }[] = [];
  let filteredCount = 0;
  for (let marketIdx = 0; marketIdx < _investHistoryResult.length; marketIdx++) {
    if (!_investHistoryResult[marketIdx]) continue;
    const { userInvests, trancheCycles } = _investHistoryResult[marketIdx];
    const filtered = userInvests?.filter((_userInvest: any) => {
      if (!trancheCycles) return false;
      const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;
      if (_userInvest.principal === "0") return false;
      if (selectedTranche > -1 && selectedTranche !== _userInvest.tranche) return false;
      if (selectedAsset !== "ALL" && !markets[marketIdx].assets.includes(selectedAsset)) return false;
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

  return (
    <div className={"my-portfolio-wrapper " + mode}>
      <div className="filters">
        <select>
          {STATUSES.map((s, i) => (
            <option key={i} onClick={() => setSelectedStatus(s.status)}>
              {s.name}
            </option>
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
      {!loaded ? (
        <div>Loading...</div>
      ) : (
        userInvestsPayload.map((_userInvestMarket, __idx) => {
          const { userInvests } = _userInvestMarket;
          const { trancheCycles } = _investHistoryResult[__idx];

          return userInvests.map((_userInvest: UserInvest, _idx: number) => {
            const trancheCycleId = _userInvest.tranche + "-" + _userInvest.cycle;

            const trancheCycle = trancheCycles[trancheCycleId];

            const _market = markets[__idx];

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

            return (
              <TableRow
                key={_idx}
                data={{
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
                }}
                foldElement={
                  <PortfolioFold
                    network={network}
                    trancheMasterAddress={_market.address}
                    abi={_market.abi}
                    totalAmount={_userInvest.principal}
                    totalAmounts={_userInvest.MCprincipal}
                    assets={_market.assets}
                    isCurrentCycle={isCurrentCycle}
                    isPending={trancheCycle?.state === 0 || _market.status === PORTFOLIO_STATUS.PENDING}
                    isActive={trancheCycle?.state === 1}
                    currentTranche={_userInvest.tranche}
                    fee={_market.tranches[_userInvest.tranche].fee}
                    isAvax={_market.isAvax}
                    isMulticurrency={_market.isMulticurrency}
                    autorollImplemented={_market.autorollImplemented}
                    trancheCount={_market.trancheCount}
                    setModal={setModal}
                    setMarkets={setMarkets}
                  />
                }
              />
            );
          });
        })
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
