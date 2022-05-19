import { Hill } from "../svgs/Hill";

type Props = {};

const MarketDetail: React.FC<Props> = ({}) => {
  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div className="block">
            <span className="portfolio-name">portfolio name</span>
          </div>
          <div className="block">
            <span className="assets"></span>
          </div>
          <div className="block">
            <span className="tvl">$TVL: 10000000</span>
          </div>
        </div>
      </div>
      <div className="charts">
        <div className="record-card">
          <section>
            <div>Return Principal + Yield</div>
            <div style={{ padding: "10px 0" }}>$100,000</div>
            <div>
              <div className="button">Withdraw All</div>
              <div className="button">Roll Deposit</div>
            </div>
            <div style={{ marginTop: 10 }}>Autoroll Balance: $100,000</div>
            <div style={{ display: "flex", marginTop: 10 }}>
              <label className="autorolling-label">Auto Rolling</label>
              <div
                style={{
                  padding: 1.5,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                }}
              >
                <switch />
              </div>
            </div>
          </section>
          <section>
            <div>WTF Reward</div>
            <div>1000 WTF</div>
            <div>
              <div className="button">
                Claim
                {/* ArrowRight SVG */}
              </div>
            </div>
          </section>
        </div>
        <div className="block">PortfolioChart</div>
        <div className="block">TrancheChart</div>
      </div>
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
          <div className="approve-card">
            <div className="row">
              <div>Wallet Balance</div>
              <div>100,000</div>
            </div>
            <div className="row">
              <div>Remaining</div>
              <div>100,000</div>
            </div>
            <div className="separator" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
