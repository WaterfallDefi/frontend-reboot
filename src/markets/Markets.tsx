import "./Markets.scss";

import React, { useEffect, useState } from "react";

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

type Props = {
  mode: Mode;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  markets: Market[] | undefined;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
};

function Markets(props: Props) {
  const { mode, setNetwork, markets, setMarkets, setModal } = props;

  const { account } = useWeb3React<Web3Provider>();

  const [selectedMarket, setSelectedMarket] = useState<Market>();

  const { price: wtfPrice } = useWTFPriceLP();
  const coingeckoPrices = useCoingeckoPrices(markets ? markets : []);

  //we are using markets as a network switch reset indicator, if flipped to undefined
  useEffect(() => {
    if (!markets) {
      setSelectedMarket(undefined);
    }
  }, [markets]);

  async function goToMarket(market: Market) {
    await switchNetwork(account, market.isAvax ? Network.AVAX : Network.BNB, setNetwork);
    setSelectedMarket(market);
  }

  return (
    <div className={"markets-wrapper " + mode}>
      {!selectedMarket ? (
        <div className="header-row">
          <div className="header first">
            <span>Portfolio Name</span>
          </div>
          <div className="header">
            <span>Asset</span>
          </div>
          <div className="header">
            <span>Lock-up period</span>
          </div>
          <div className="header">
            <span>Deposit APR</span>
          </div>
          <div className="header">
            <span>TVL</span>
          </div>
          <div className="header last">
            <span>Status</span>
          </div>
        </div>
      ) : null}
      {!selectedMarket && markets
        ? markets.map((m: Market) => {
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
        : null}
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
