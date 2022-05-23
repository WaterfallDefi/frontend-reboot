import { useEffect } from "react";
import "./Stake.scss";

type Props = {};

const Stake: React.FC<Props> = ({}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="stake-wrapper">
      <div className="body-wrapper">
        <div className="APY-card">
          <div>
            <p>Lock WTF to Earn</p>
            <div>
              Receive Vote Escrowed WTF (veWTF) that gets you daily WTF rewards,
            </div>
            <div>platform fees shares and more!</div>
          </div>
          <span>APR up to 1%</span>
        </div>
        <div className="total">
          <div>Total WTF Locked:</div>
          <div>Total veWTF Minted:</div>
        </div>
        <div className="actions">
          <div className="action"></div>
          <div className="stake-info">
            <div>
              <div className="veWTF">
                <p>Your veWTF</p>
                <p>_veWTFBalance</p>
                <span>1 veWTF = 0.5 WTF</span>
                <span>0% of veWTF ownership</span>
                <div>Stake WTF get veWTF</div>
              </div>
              <div className="WTF-reward">
                <p>WTF Reward</p>
                <div>
                  <p>pendingWTFRewards</p>
                </div>
                <span>$0.0 (1 WTF = $0.15)</span>
                <button>Harvest</button>
              </div>
            </div>
            <div /> {/* wtf, lap... */}
            <div>
              <div>veWTF - Locking Period vs Predicted APR</div>
              {/* line chart */}
            </div>
            <div>
              <p>Your info</p>
              <section>
                <span>Your stake</span>
                <span>0 WTF</span>
              </section>
              <section>
                <span>Your ratio</span>
                <span>0%</span>
              </section>
              <section>
                <span>Current APR:</span>
                <span>5%</span>
              </section>
              <section>
                <span>Expire date:</span>
                <span>{new Date().toDateString()}</span>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
