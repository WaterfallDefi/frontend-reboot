import "./Dashboard.scss";
// import numeral from "numeral";
// import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";

function Dashboard() {
  // const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  return (
    <div className="dashboard-wrapper dark">
      <div className="dash-banner">
        <div className="content">
          <div className="block">
            <span className="title">Total Value Locked</span>
            <span className="value">$ {totalTvl}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
