import { useState } from "react";
import { Boxes } from "./svgs/Boxes";
import { Mountain } from "./svgs/Mountain";
import "./Tutorial.scss";

type Props = {};

const Tutorial: React.FC<Props> = ({}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className={"tutorial-wrapper" + (collapsed ? " collapsed" : "")}>
      <div className="tutorial-banner">
        <div className="boxes">
          <Boxes />
        </div>
        <div className="tutorial-text">
          <h1>Risk Optimised Yield Farming</h1>
          <p>
            Yield will be distributed in a way such that users of more senior
            tranches get a fixed return, while users of more junior tranches get
            a leveraged return
          </p>
        </div>
        <div className="mountain">
          <Mountain />
          <div className="claim">
            <span className="label">Weekly rewards for AVAX coming soon!</span>
            <div className="weekly-reward">67,612.1</div>
          </div>
        </div>
      </div>
      <div className="guide-wrapper">
        {!collapsed ? <div className="pre-row" /> : null}
        <div className="row">
          <div className="col">
            <div className="img-wrapper">
              <div className="deposit img" />
            </div>
            <h2>Deposit</h2>
            <p className="desc-text">
              Choose the tranche that suits you and get started!
            </p>
          </div>
          <div className="col">
            <div className="img-wrapper">
              <div className="wait img" />
            </div>
            <h2>Wait</h2>
            <p className="desc-text">
              When all the tranches are filled, it will set off the portfolio
              deployment.
            </p>
          </div>
          <div className="col">
            <div className="img-wrapper">
              <div className="withdraw img" />
            </div>
            <h2>Withdraw</h2>
            <p className="desc-text">
              When the deployment period expires, you can claim your returns.
            </p>
          </div>
        </div>
      </div>
      {!collapsed ? (
        <div
          className="collapse-control collapse"
          onClick={() => setCollapsed(true)}
        >
          ^ Collapse
        </div>
      ) : null}
      {collapsed ? (
        <div
          className="collapse-control uncollapse"
          onClick={() => setCollapsed(false)}
        >
          Tutorial
        </div>
      ) : null}
    </div>
  );
};

export default Tutorial;
