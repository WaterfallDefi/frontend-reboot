import "./Markets.scss";
import { Market } from "../types";
import TableRow from "../shared/TableRow";
import { useState } from "react";
import MarketDetail from "./subcomponents/MarketDetail";
import { Mode } from "../WaterfallDefi";

type Props = {
  mode: Mode;
  markets: Market[];
};

function Markets(props: Props) {
  const { mode, markets } = props;
  const [selectedMarket, setSelectedMarket] = useState<Market>();

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
        ? markets.map((m: Market) => (
            <TableRow
              key={m.portfolio}
              setSelectedMarket={setSelectedMarket}
              data={{
                portfolio: m.portfolio,
                assets: m.assets,
                duration:
                  Number(m.duration) / 86400 >= 1
                    ? Number(m.duration) / 86400 + " Days"
                    : Number(m.duration) / 60 + " Mins",
                apr: "asdf",
                tvl: "$100,000",
                status: "Active",
              }}
            />
          ))
        : null}
      {selectedMarket ? <MarketDetail /> : null}
    </div>
  );
}

export default Markets;
