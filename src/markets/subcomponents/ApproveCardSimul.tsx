type Props = {};

function ApproveCardMulticurrency(props: Props) {
  return (
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
  );
}

export default ApproveCardMulticurrency;
