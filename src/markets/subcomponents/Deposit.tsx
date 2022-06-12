import { Market } from "../../types";
import { Hill } from "../svgs/Hill";
import ApproveCardDefault from "./ApproveCardDefault";
import TrancheCard from "./TrancheCard";

type Props = {
  selectedMarket: Market;
  coingeckoPrices: any;
};

function Deposit(props: Props) {
  const { selectedMarket, coingeckoPrices } = props;
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
          {selectedMarket.tranches.map((t, i) => {
            return (
              <TrancheCard
                selectedMarket={selectedMarket}
                tranche={t}
                trancheIndex={i}
                coingeckoPrices={coingeckoPrices}
              />
            );
          })}
        </div>
        <ApproveCardDefault />
      </div>
    </div>
  );
}

export default Deposit;
