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

const headers = ["Portfolio Name", "Network", "Asset", "Lock-up Period", "Deposit APR", "TVL", "Status"];

function Markets(props: Props) {
  const { mode, network, setDisableHeaderNetworkSwitch, setNetwork, markets, setMarkets, setModal } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [selectedMarket, setSelectedMarket] = useState<Market>();

  const [headerSort, setHeaderSort] = useState<number>(-1);

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
      if ((market.isAvax && network === Network.BNB) || (!market.isAvax && network === Network.AVAX)) {
        switchNetwork(account, market.isAvax ? Network.AVAX : Network.BNB, setNetwork).then((res) => {
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
          .sort((a: Market, b: Market) => {
            switch (headerSort) {
              case 0:
                return a.portfolio.localeCompare(b.portfolio);
              case 1:
                return a.isAvax ? 1 : -1;
              case 2:
                return a.assets[0].localeCompare(b.assets[0]);
              case 3:
                return (a.duration ? a.duration : 0) > (b.duration ? b.duration : 0)
                  ? -1
                  : (b.duration ? b.duration : 0) > (a.duration ? a.duration : 0)
                  ? 1
                  : 0;
              case 4:
                const wtfAPR_A = getWTFApr(
                  a.isAvax ? Network.AVAX : Network.BNB,
                  formatAllocPoint(a?.pools[a.trancheCount - 1], a?.totalAllocPoints),
                  a?.tranches[a.trancheCount - 1],
                  a.duration,
                  a.rewardPerBlock,
                  wtfPrice,
                  a?.assets,
                  coingeckoPrices
                );
                const trancheAPR_A = a.tranches[a.trancheCount - 1].apy;
                const totalAPR_A =
                  wtfAPR_A !== "0.00" && wtfAPR_A !== undefined
                    ? Number(trancheAPR_A) + Number(numeral(wtfAPR_A).value())
                    : trancheAPR_A;

                const wtfAPR_B = getWTFApr(
                  b.isAvax ? Network.AVAX : Network.BNB,
                  formatAllocPoint(b?.pools[b.trancheCount - 1], b?.totalAllocPoints),
                  b?.tranches[b.trancheCount - 1],
                  b.duration,
                  b.rewardPerBlock,
                  wtfPrice,
                  b?.assets,
                  coingeckoPrices
                );
                const trancheAPR_B = b.tranches[b.trancheCount - 1].apy;
                const totalAPR_B =
                  wtfAPR_B !== "0.00" && wtfAPR_B !== undefined
                    ? Number(trancheAPR_B) + Number(numeral(wtfAPR_B).value())
                    : trancheAPR_B;

                return totalAPR_A > totalAPR_B ? -1 : totalAPR_B > totalAPR_A ? 1 : 0;
              case 5:
                const aTVL =
                  a.assets[0] === "WBNB"
                    ? Number(a.tvl) * Number(coingeckoPrices?.wbnb?.usd)
                    : a.assets[0] === "WAVAX"
                    ? Number(a.tvl) * Number(coingeckoPrices?.["wrapped-avax"]?.usd)
                    : a.tvl;

                const bTVL =
                  b.assets[0] === "WBNB"
                    ? Number(b.tvl) * Number(coingeckoPrices?.wbnb?.usd)
                    : b.assets[0] === "WAVAX"
                    ? Number(b.tvl) * Number(coingeckoPrices?.["wrapped-avax"]?.usd)
                    : b.tvl;
                return aTVL > bTVL ? -1 : bTVL > aTVL ? 1 : 0;
              case 6:
                if (a.status === "PENDING" && b.status === "ACTIVE") {
                  return -1;
                }
                if (a.status === "ACTIVE" && b.isRetired) {
                  return -1;
                }
                return 0;
              default:
                return 0;
            }
          })
          .map((m: Market) => {
            const tranchesApr = m.tranches.map((_t, _i) => {
              const wtfAPR = getWTFApr(
                m.isAvax ? Network.AVAX : Network.BNB,
                formatAllocPoint(m?.pools[_i], m?.totalAllocPoints),
                m?.tranches[_i],
                m.duration,
                m.rewardPerBlock,
                wtfPrice,
                m?.assets,
                coingeckoPrices
              );
              const trancheAPR = _t.apy;
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

            return (
              <TableRow
                key={m.portfolio}
                setSelectedMarket={() => goToMarket(m)}
                data={{
                  portfolio: m.portfolio,
                  network: m.isAvax ? "AVAX" : "BNB",
                  assets: m.assets,
                  duration:
                    Number(m.duration) / 86400 >= 1
                      ? Number(m.duration) / 86400 + " Days"
                      : Number(m.duration) / 60 + " Mins",
                  apr_markets: tranchesApr,
                  tvl: tvl,
                  status: m.isRetired ? "Expired" : m.status[0] + m.status.slice(1).toLowerCase(),
                }}
              />
            );
          })
      : [];
  }, [markets, headerSort, wtfPrice, coingeckoPrices, goToMarket]);

  return (
    <div className={"markets-wrapper " + mode}>
      {!selectedMarket ? <Dashboard /> : null}
      {!selectedMarket ? (
        <div className="header-row">
          {headers.map((h, i) => (
            <div
              className={"header" + (i === 0 ? " first" : i === headers.length ? " last" : "")}
              onClick={() => setHeaderSort(i)}
            >
              <span>{h}</span>
            </div>
          ))}
        </div>
      ) : null}
      {!selectedMarket && tableRows}
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
