import "./Dashboard.scss";
// import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";

function Dashboard() {
  // const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  const totalCapitalDeployed = 98916547;

  return (
    <div className="dashboard-wrapper dark">
      <div className="dash-banner">
        <div className="content">
          {/* <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">$ {price ? numeral(price).format("0,0.[00]") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">$ {marketCap ? numeral(marketCap).format("0,0") : "-"}</span>
          </div> */}
          <div className="block">
            <span className="title">Total Value Locked</span>
            <span className="value">$ {totalTvl}</span>
          </div>
          <div className="block">
            <span className="title">Total Capital Deployed</span>
            <span className="value">$ {numeral(totalCapitalDeployed).format("0,0")}</span>
          </div>
          <div className="block">
            <span className="title" />
            <div className="icon-group">
              <Metamask />
              <a href="https://www.coingecko.com/en/coins/waterfall-governance-token">
                <div className="coingecko" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
