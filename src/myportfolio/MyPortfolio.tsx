import { MarketList } from "../config/markets";
import TableRow from "../shared/TableRow";
import { Market } from "../types";
import "./MyPortfolio.scss";

type Props = {};

const MyPortfolio: React.FC<Props> = ({}) => {
  return (
    <div className="my-portfolio-wrapper">
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
      {MarketList.map((m: Market) => (
        <TableRow
          data={{
            portfolio: m.portfolio,
            assets: m.assets,
            duration: "asdf",
            apr: "asdf",
            tvl: "$100,000",
            status: "Pending",
            action: "asdf",
            yield: "asdf",
          }}
          openFold={true}
        />
      ))}
    </div>
  );
};

export default MyPortfolio;
