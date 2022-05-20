import "./Markets.scss";
import { MarketList } from "../config/markets";
import { Market } from "../types";
import TableRow from "../shared/TableRow";
import { useState } from "react";
import MarketDetail from "./subcomponents/MarketDetail";

type Props = {};

const Markets: React.FC<Props> = ({}) => {
  const [selectedMarket, setSelectedMarket] = useState<Market>();

  return (
    <div className="markets-wrapper">
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
          <div className="header">
            <span>Status</span>
          </div>
          <div className="header last">
            <span>Action</span>
          </div>
        </div>
      ) : null}
      {!selectedMarket
        ? MarketList.map((m: Market) => (
            <TableRow
              setSelectedMarket={setSelectedMarket}
              data={{
                portfolio: m.portfolio,
                assets: m.assets,
                duration: "asdf",
                apr: "asdf",
                tvl: "asdf",
                status: "asdf",
                action: "asdf",
              }}
            />
          ))
        : null}
      {selectedMarket ? <MarketDetail /> : null}
    </div>
  );
};

export default Markets;
