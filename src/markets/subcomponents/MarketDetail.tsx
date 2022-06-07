import { useEffect, useState } from "react";
import { getAPYHourly } from "../../myportfolio/hooks/useSubgraphQuery";
import { Market } from "../../types";
import { Hill } from "../svgs/Hill";
import PortfolioChart from "./PortfolioChart";
import TrancheStructure from "./TrancheStructure";

type Props = {
  selectedMarket: Market;
};

const COLORS = ["#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];

const MarketDetail: React.FC<Props> = (props: Props) => {
  const { selectedMarket } = props;

  const today = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);

  const [APYData, setAPYData] = useState<any[]>([]);

  useEffect(() => {
    getAPYHourly(twoWeeksAgo.toISOString(), today.toISOString()).then(
      (res: any) => {
        setAPYData(res);
      }
    );
  }, []);

  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div className="block">
            <span className="portfolio-name">{selectedMarket.portfolio}</span>
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
        <div className="linear-gradient" />
        <div className="record-card">
          <div className="section">
            <div className="label">Return Principal + Yield</div>
            <div className="rtn-amt">$100,000</div>
            <div className="buttons">
              <button>Withdraw All</button>
              <button>Roll Deposit</button>
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
                {/* <switch /> */}
              </div>
            </div>
          </div>
          <div className="section">
            <div className="label">WTF Reward</div>
            <div className="rtn-amt">1000 WTF</div>
            <div className="buttons">
              <button>Claim</button>
            </div>
          </div>
        </div>
        <div className="block col">
          <PortfolioChart
            strategyFarms={selectedMarket.strategyFarms}
            APYData={APYData}
          />
          <div className="legend">
            {selectedMarket.strategyFarms.map((f, i) => (
              <div key={f.farmName} className="farm-key">
                <div
                  className="key-color"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span>{f.farmName}</span>
              </div>
            ))}
          </div>
        </div>
        <TrancheStructure
          tranches={selectedMarket.tranches}
          totalTranchesTarget={selectedMarket.totalTranchesTarget}
        />
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
            <div className="row">BUSD</div>
            <input />
            <div className="validate-text">Insufficient balance</div>
            <div className="important-notes">
              <div>Important Notes</div>
              <div>Return is fixed</div>
            </div>
            <div className="button">
              <button>Deposit</button>
            </div>
            <div className="redemption-fee">
              Withdrawal Fee: All principal + yield of the current cycle *{" "}
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
