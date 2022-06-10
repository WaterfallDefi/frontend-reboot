import { Hill } from "../svgs/Hill";
import ApproveCardDefault from "./ApproveCardDefault";

type Props = {};

function Deposit(props: Props) {
  return (
    <div className="deposit">
      <div className="next-cycle-wrapper">
        <Hill />
        <div className="next-cycle">Next Cycle</div>
        <div className="active-cycle">Active Cycle</div>
        <div className="button">Remind Me</div>
      </div>
      <div className="top-bar">
        <div className="step-bar">
          <div className="step">1</div>
          <div className="step-name">Choose Tranche</div>
          <div className="line" />
          <div className="step">2</div>
          <div className="step-name">Deposit</div>
        </div>
        <div className="select-deposit-asset">
          <div className="step-name">0 Remaining</div>
          <div className="remaining-depositable-outer">
            <div className="remaining-depositable-inner" />
          </div>
        </div>
      </div>
      <div className="deposit-item">
        <div className="tranches">
          <div className="tranche one">
            <div className="tranche-name">Senior</div>
            <div className="apr">APR 3.5%</div>
            <div className="risk-text">Low Risk; Fixed</div>
            <div className="status">
              <div className="risk-text">TVL: $1</div>
              <div className="remaining">Remaining: 1</div>
            </div>
            <div className="progress-bar"></div>
          </div>
          <div className="tranche two">
            <div className="tranche-name">Fixed</div>
            <div className="apr">APR 5%</div>
            <div className="risk-text">Medium Risk; Fixed</div>
            <div className="status">
              <div className="risk-text">TVL: $3</div>
              <div className="remaining">Remaining: 3</div>
            </div>
            <div className="progress-bar"></div>
          </div>
          <div className="tranche three">
            <div className="tranche-name">Mezzanine</div>
            <div className="apr">APR 7.8%</div>
            <div className="risk-text">Multiple Leverage; Variable</div>
            <div className="status">
              <div className="risk-text">TVL: 5%</div>
              <div className="remaining">Remaining: 5</div>
            </div>
            <div className="progress-bar" />
          </div>
        </div>
        <ApproveCardDefault />
      </div>
    </div>
  );
}

export default Deposit;
