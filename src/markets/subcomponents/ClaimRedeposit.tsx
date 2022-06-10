type Props = {};

function ClaimRedeposit(props: Props) {
  return (
    <div className="claim-redeposit">
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
  );
}

export default ClaimRedeposit;
