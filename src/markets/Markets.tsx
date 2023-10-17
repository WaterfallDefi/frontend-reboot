import "./Markets.scss";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import numeral from "numeral";

import TableRow from "../shared/TableRow";
import { Market } from "../types";
import { APYData, APYDataFull, ModalProps, Mode, Network } from "../WaterfallDefi";
import MarketDetail from "./subcomponents/MarketDetail";
import { switchNetwork } from "../header/Header";
import Dashboard from "../dashboard_v2/Dashboard_v2";

const BIG_TEN = new BigNumber(10);

type Props = {
  mode: Mode;
  network: Network;
  setDisableHeaderNetworkSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  markets: Market[] | undefined;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  APYData: APYDataFull[];
  coingeckoPrices: CoingeckoPrices;
  latestSeniorAPY: APYData;
};

export type CoingeckoPrices = {
  wbnb?: { usd?: number };
  ["wrapped-avax"]?: { usd?: number };
  ["stargate-finance"]?: { usd?: number };
};

type TableRowData = {
  portfolio: string;
  assets: string[];
  apr_markets: { tranchesApr: (string | number)[] };
  // wtfApr: (string | undefined)[] };
  tvl: string;
  status: string;
};

const headers = [
  "Vault Name",
  // "Network",
  "Asset",
  "Deposit APR",
  "TVL",
  "Status",
];

function Markets(props: Props) {
  const {
    mode,
    network,
    setDisableHeaderNetworkSwitch,
    setNetwork,
    markets,
    setMarkets,
    setModal,
    APYData,
    coingeckoPrices,
    latestSeniorAPY,
  } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [selectedMarket, setSelectedMarket] = useState<Market>();

  const [headerSort, setHeaderSort] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // const { price: wtfPrice } = useWTFPriceLP();

  //we are using markets as a network switch reset indicator, if flipped to undefined
  useEffect(() => {
    if (!markets) {
      setSelectedMarket(undefined);
      setDisableHeaderNetworkSwitch(false);
    }
  }, [markets, setSelectedMarket, setDisableHeaderNetworkSwitch]);

  const goToMarket = useCallback(
    async (market: Market) => {
      if (market.network !== network) {
        switchNetwork(account, market.network, setNetwork).then((res) => {
          if (res) {
            setSelectedMarket(market);
            setDisableHeaderNetworkSwitch(true);
          }
        });
      } else {
        setSelectedMarket(market);
        setDisableHeaderNetworkSwitch(true);
      }
    },
    [account, network, setDisableHeaderNetworkSwitch, setNetwork]
  );

  const tableRows = useMemo(() => {
    return markets
      ? markets
          .map((m: Market) => {
            console.log(APYData);

            const _latestSeniorAPY = APYData.filter((apy) => apy.id.slice(0, 2) === "0-" && apy.y !== 0).pop();
            const _latestJuniorAPY = APYData.filter((apy) => apy.id.slice(0, 2) === "1-" && apy.y !== 0).pop();

            const seniorTrancheAPR = new BigNumber(String(_latestSeniorAPY?.y)).toNumber();
            const juniorTrancheAPR = new BigNumber(String(_latestJuniorAPY?.y)).toNumber();

            //new historical
            const sum = Number(markets[0].tranches[0]?.autoPrincipal) + Number(markets[0].tranches[1]?.autoPrincipal);

            const thicknesses = [
              Number(markets[0].tranches[0]?.autoPrincipal) / Number(sum),
              Number(markets[0].tranches[1]?.autoPrincipal) / Number(sum),
            ];
            //need verbose naming because this is complicated
            const seniorTranchePrincipal = markets[0].tranches[0]?.principal;

            const seniorTrancheProfit = _latestSeniorAPY?.farmTokensAmt[0]; //times farm token price
            //times USDC price

            //OLD indicative
            // const APROnThatDate = m.strategyFarms.map(
            //   (sf) =>
            //     defiLlamaAPRs[sf.dataId].data.filter((d: any) => {
            //       const date = new Date(latestSeniorAPY.x);
            //       const timestamp = new Date(d.timestamp);
            //       return date.getDate() - timestamp.getDate() === 0 && date.getMonth() - timestamp.getMonth() === 0;
            //     })[0]
            // );

            // const sum = Number(markets[0].tranches[0]?.autoPrincipal) + Number(markets[0].tranches[1]?.autoPrincipal);

            // const thicknesses = [
            //   Number(markets[0].tranches[0]?.autoPrincipal) / Number(sum),
            //   Number(markets[0].tranches[1]?.autoPrincipal) / Number(sum),
            // ];

            // const seniorRewardAPR =
            //   (APROnThatDate.reduce((acc, next) => acc + next.apyReward, 0) / APROnThatDate.length) *
            //   (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

            // const juniorRewardAPR =
            //   APROnThatDate.reduce((acc, next) => acc + next.apyReward, 0) / APROnThatDate.length -
            //   (APROnThatDate.reduce((acc, next) => acc + next.apyReward, 0) / APROnThatDate.length) *
            //     (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

            //PLACEHOLDER: DECOMPOSE REWARD CALCULATION
            const tranchesApr = [seniorTrancheAPR, juniorTrancheAPR];

            const nonDollarTvl = m.assets[0] === "WBNB" || m.assets[0] === "WAVAX";

            const tvl =
              (!nonDollarTvl ? "$" : "") +
              numeral(m.tvl.includes("e-") ? "0" : m.tvl).format("0,0.[0000]") +
              (nonDollarTvl ? " " + m.assets[0] : "");

            // const networkStrings = {
            //   43114: "AVAX",
            //   42161: "AETH",
            // };

            return {
              market: m,
              data: {
                portfolio: m.portfolio,
                // network: networkStrings[m.network],
                assets: m.assets,
                apr_markets: { tranchesApr: tranchesApr },
                // wtfApr: wtfAprs },
                tvl: tvl,
                status: m.isRetired ? "Expired" : m.status[0] + m.status.slice(1).toLowerCase(),
              },
            };
          })
          //TYPE DATA!!
          .sort((a: { market: Market; data: TableRowData }, b: { market: Market; data: TableRowData }) => {
            switch (headerSort) {
              case 0:
                return a.data.portfolio.localeCompare(b.data.portfolio);
              case 1:
                return a.data.assets[0].localeCompare(b.data.assets[0]);
              case 2:
                return Number(a.data.apr_markets.tranchesApr[a.market.trancheCount - 1]) <
                  Number(b.data.apr_markets.tranchesApr[b.market.trancheCount - 1])
                  ? -1
                  : Number(a.data.apr_markets.tranchesApr[a.market.trancheCount - 1]) >
                    Number(b.data.apr_markets.tranchesApr[b.market.trancheCount - 1])
                  ? 1
                  : 0;
              case 3:
                const aTVL = a.market.tvl;

                const bTVL = b.market.tvl;
                return aTVL < bTVL ? -1 : bTVL < aTVL ? 1 : 0;
              case 4:
                if (a.data.status === "PENDING" && b.data.status === "ACTIVE") {
                  return -1;
                }
                if (a.data.status === "ACTIVE" && b.market.isRetired) {
                  return -1;
                }
                return 0;
              default:
                return 0;
            }
          })
          .map((m) => (
            <TableRow
              key={m.data.portfolio}
              setSelectedMarket={() => goToMarket(m.market)}
              data={m.data}
              pointer={true}
            />
          ))
      : [];
  }, [markets, headerSort, latestSeniorAPY, APYData, goToMarket]);

  //horrible hack but what can you do?
  function calculateAPR(selectedMarket: Market) {
    const _latestSeniorAPY = APYData.filter((apy) => apy.id.slice(0, 2) === "0-" && apy.y !== 0).pop();
    const _latestJuniorAPY = APYData.filter((apy) => apy.id.slice(0, 2) === "1-" && apy.y !== 0).pop();

    const seniorTrancheAPR = new BigNumber(String(_latestSeniorAPY?.y)).toNumber();
    const juniorTrancheAPR = new BigNumber(String(_latestJuniorAPY?.y)).toNumber();

    // const APROnThatDate = selectedMarket.strategyFarms.map(
    //   (sf) =>
    //     coingeckoPrices[sf.dataId].data.filter((d: any) => {
    //       const date = new Date(latestSeniorAPY.x);
    //       const timestamp = new Date(d.timestamp);
    //       return date.getDate() - timestamp.getDate() === 0 && date.getMonth() - timestamp.getMonth() === 0;
    //     })[0]
    // );

    const sum = Number(selectedMarket.tranches[0]?.autoPrincipal) + Number(selectedMarket.tranches[1]?.autoPrincipal);

    const thicknesses = [
      Number(selectedMarket.tranches[0]?.autoPrincipal) / Number(sum),
      Number(selectedMarket.tranches[1]?.autoPrincipal) / Number(sum),
    ];

    // const seniorRewardAPR =
    //   (APROnThatDate.reduce((acc, next) => acc + next.apyReward, 0) / APROnThatDate.length) *
    //   (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

    // const juniorRewardAPR =
    //   APROnThatDate.reduce((acc, next) => acc + next.apyReward, 0) / APROnThatDate.length -
    //   (APROnThatDate.reduce((acc, next) => acc + next.apyReward, 0) / APROnThatDate.length) *
    //     (thicknesses[0] < 0.5 ? thicknesses[0] : 0.5);

    const seniorAPYData: APYData = { id: "0-", x: new Date(), y: seniorTrancheAPR };
    // + seniorRewardAPR };

    const juniorAPYData: APYData = { id: "1-", x: new Date(), y: juniorTrancheAPR };
    // + juniorRewardAPR };

    return [seniorAPYData, juniorAPYData];
  }

  return (
    <div className={"markets-wrapper " + mode} id="markets">
      {!selectedMarket ? <Dashboard /> : null}
      {!selectedMarket ? (
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
      ) : null}
      {!selectedMarket && sortAsc ? tableRows : null}
      {!selectedMarket && !sortAsc ? [...tableRows].reverse() : null}
      {selectedMarket ? (
        <MarketDetail
          selectedMarket={selectedMarket}
          setSelectedMarket={setSelectedMarket}
          // coingeckoPrices={coingeckoPrices}
          setModal={setModal}
          setMarkets={setMarkets}
          APYData={APYData}
          coingeckoPrices={coingeckoPrices}
          latestAPYs={calculateAPR(selectedMarket)}
        />
      ) : null}
    </div>
  );
}

export default Markets;
