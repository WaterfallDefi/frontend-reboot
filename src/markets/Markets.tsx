import "./Markets.scss";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import numeral from "numeral";

import getWTFApr, { formatAllocPoint } from "../hooks/getWtfApr";
import { useCoingeckoPrices } from "../hooks/useCoingeckoPrices";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import TableRow from "../shared/TableRow";
import { Market } from "../types";
import { ModalProps, Mode, Network } from "../WaterfallDefi";
import MarketDetail from "./subcomponents/MarketDetail";
import { switchNetwork } from "../header/Header";
import Dashboard from "../dashboard_v2/Dashboard_v2";

type Props = {
  mode: Mode;
  network: Network;
  setDisableHeaderNetworkSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  markets: Market[] | undefined;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

type CoingeckoPrices = {
  wbnb?: { usd?: number };
  ["wrapped-avax"]?: { usd?: number };
};

type TableRowData = {
  portfolio: string;
  network: string;
  assets: string[];
  duration: string;
  apr_markets: { tranchesApr: (string | number)[]; wtfApr: (string | undefined)[] };
  tvl: string;
  status: string;
};

const headers = ["Portfolio Name", "Network", "Asset", "Lock-up Period", "Deposit APR", "TVL", "Status"];

function Markets(props: Props) {
  const { mode, network, setDisableHeaderNetworkSwitch, setNetwork, markets, setMarkets, setModal } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [selectedMarket, setSelectedMarket] = useState<Market>();

  const [headerSort, setHeaderSort] = useState<number>(-1);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const { price: wtfPrice } = useWTFPriceLP();
  const coingeckoPrices: CoingeckoPrices = useCoingeckoPrices();

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
            const wtfAprs = m.tranches.map((_t, _i) => {
              return getWTFApr(
                m.network,
                formatAllocPoint(m?.pools[_i], m?.totalAllocPoints),
                m?.tranches[_i],
                m.duration,
                m.rewardPerBlock,
                wtfPrice,
                m?.assets,
                coingeckoPrices
              );
            });

            const tranchesApr = m.tranches.map((_t, _i) => {
              const wtfAPR = wtfAprs[_i];
              const trancheAPR: string = _t.apy;
              const totalAPR =
                wtfAPR !== "0.00" && wtfAPR !== undefined
                  ? Number(trancheAPR) + Number(numeral(wtfAPR).value())
                  : trancheAPR;
              return totalAPR;
            });

            const nonDollarTvl = m.assets[0] === "WBNB" || m.assets[0] === "WAVAX";

            const tvl =
              (!nonDollarTvl ? "$" : "") +
              numeral(m.tvl.includes("e-") ? "0" : m.tvl).format("0,0.[0000]") +
              (nonDollarTvl ? " " + m.assets[0] : "");

            const networkStrings = {
              43114: "AVAX",
              56: "BNB",
              137: "Polygon",
            };

            return {
              market: m,
              data: {
                portfolio: m.portfolio,
                network: networkStrings[m.network],
                assets: m.assets,
                duration:
                  Number(m.duration) / 86400 >= 1
                    ? Number(m.duration) / 86400 + " Days"
                    : Number(m.duration) / 60 + " Mins",
                apr_markets: { tranchesApr: tranchesApr, wtfApr: wtfAprs },
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
                return a.data.network.localeCompare(b.data.network);
              case 2:
                return a.data.assets[0].localeCompare(b.data.assets[0]);
              case 3:
                return (a.market.duration ? a.market.duration : 0) < (b.market.duration ? b.market.duration : 0)
                  ? -1
                  : (b.market.duration ? b.market.duration : 0) < (a.market.duration ? a.market.duration : 0)
                  ? 1
                  : 0;
              case 4:
                return Number(a.data.apr_markets.tranchesApr[a.market.trancheCount - 1]) <
                  Number(b.data.apr_markets.tranchesApr[b.market.trancheCount - 1])
                  ? -1
                  : Number(a.data.apr_markets.tranchesApr[a.market.trancheCount - 1]) >
                    Number(b.data.apr_markets.tranchesApr[b.market.trancheCount - 1])
                  ? 1
                  : 0;
              case 5:
                const aTVL =
                  a.market.assets[0] === "WBNB"
                    ? Number(a.market.tvl) * Number(coingeckoPrices?.wbnb?.usd)
                    : a.market.assets[0] === "WAVAX"
                    ? Number(a.market.tvl) * Number(coingeckoPrices?.["wrapped-avax"]?.usd)
                    : a.market.tvl;

                const bTVL =
                  b.market.assets[0] === "WBNB"
                    ? Number(b.market.tvl) * Number(coingeckoPrices?.wbnb?.usd)
                    : b.market.assets[0] === "WAVAX"
                    ? Number(b.market.tvl) * Number(coingeckoPrices?.["wrapped-avax"]?.usd)
                    : b.market.tvl;
                return aTVL < bTVL ? -1 : bTVL < aTVL ? 1 : 0;
              case 6:
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
          .map((m) => <TableRow key={m.data.portfolio} setSelectedMarket={() => goToMarket(m.market)} data={m.data} />)
      : [];
  }, [markets, headerSort, wtfPrice, coingeckoPrices, goToMarket]);

  return (
    <div className={"markets-wrapper " + mode}>
      {!selectedMarket ? <Dashboard coingeckoPrices={coingeckoPrices} /> : null}
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
          coingeckoPrices={coingeckoPrices}
          setModal={setModal}
          setMarkets={setMarkets}
        />
      ) : null}
    </div>
  );
}

export default Markets;
