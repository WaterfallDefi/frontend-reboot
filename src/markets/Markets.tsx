import "./Markets.scss";
import { MarketList } from "../config/markets";
import { Market } from "../types";
import TableRow from "../shared/TableRow";
import { useState } from "react";

type Props = {};

const Markets: React.FC<Props> = ({}) => {
  const [marketSelected, setMarketSelected] = useState<boolean>(false);

  return (
    <div className="markets-wrapper">
      {!marketSelected ? (
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
      {!marketSelected
        ? MarketList.map((m: Market) => (
            <TableRow
              data={{
                portfolio: m.portfolio,
                assets: "asdf",
                duration: "asdf",
                apr: "asdf",
                tvl: "asdf",
                status: "asdf",
                action: "asdf",
              }}
            />
          ))
        : null}
    </div>
  );
};

export default Markets;
