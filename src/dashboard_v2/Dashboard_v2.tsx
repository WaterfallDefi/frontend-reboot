import "./Dashboard.scss";
import { useEffect } from "react";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";

function Dashboard() {
  const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dashboard-wrapper dark">
      <div className="dash-banner">
        <div className="dash-banner-img none" />
        <div className="linear-gradient" />
        <h1>Dashboard</h1>
        <div className="content">
          <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">$ {price ? numeral(price).format("0,0.[00]") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">$ {marketCap ? numeral(marketCap).format("0,0") : "-"}</span>
          </div>
          <div className="block">
            <span className="title" />
            <div className="icon-group">
              <Metamask />
            </div>
          </div>
        </div>
      </div>
      <div className="total-value-locked">
        <div className="text">Total Value Locked</div>
        <div className="value">${totalTvl}</div>
      </div>
    </div>
  );
}

export default Dashboard;
