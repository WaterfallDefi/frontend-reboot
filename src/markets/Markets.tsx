import "./Markets.scss";
import { Market } from "../types";
import TableRow from "../shared/TableRow";
import { useState } from "react";
import MarketDetail from "./subcomponents/MarketDetail";
import { Mode, Network } from "../WaterfallDefi";
import getWTFApr, { formatAllocPoint } from "../hooks/getWtfApr";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import { useCoingeckoPrices } from "../hooks/useCoingeckoPrices";
import numeral from "numeral";

type Props = {
  mode: Mode;
  markets: Market[];
  setConnectWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Markets(props: Props) {
  const { mode, markets, setConnectWalletModalOpen } = props;
  const [selectedMarket, setSelectedMarket] = useState<Market>();

  const { price: wtfPrice } = useWTFPriceLP();
  const coingeckoPrices = useCoingeckoPrices(markets);

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
      {!selectedMarket && markets.length > 0
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

            const nonDollarTvl =
              m.assets[0] === "WBNB" || m.assets[0] === "WAVAX";

            const tvl =
              (!nonDollarTvl ? "$" : "") +
              numeral(m.tvl.includes("e-") ? "0" : m.tvl).format("0,0.[0000]") +
              (nonDollarTvl ? " " + m.assets[0] : "");

            return (
              <TableRow
                key={m.portfolio}
                setSelectedMarket={() => setSelectedMarket(m)}
                data={{
                  portfolio: m.portfolio,
                  assets: m.assets,
                  duration:
                    Number(m.duration) / 86400 >= 1
                      ? Number(m.duration) / 86400 + " Days"
                      : Number(m.duration) / 60 + " Mins",
                  apr_markets: tranchesApr,
                  tvl: tvl,
                  status: m.isRetired
                    ? "Expired"
                    : m.status[0] + m.status.slice(1).toLowerCase(),
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
          setConnectWalletModalOpen={setConnectWalletModalOpen}
        />
      ) : null}
    </div>
  );
}

export default Markets;
