function IncreaseAction() {
  return (
    <div className="increase">
      <div className="label">
        <p>
          WTF Balance: <span>wtfBalance</span>
        </p>
        <div className="max">MAX</div>
      </div>
      <input />
      <div className="label">
        <p>WTF Reward</p>
      </div>
      <input />
      <div className="validation">validateText</div>
      <button>Increase Lock Amount</button>
      <div className="label" style={{ margin: "15px 0 10px" }}>
        <p>Lock will expire in:</p>
        {/* {expiryTimestamp !== "0" &&
              (duration
                ? dayjs.unix(Number(expiryTimestamp) + Number(duration)).format("YYYY-MM-DD HH:mm:ss")
                : dayjs.unix(Number(expiryTimestamp)).format("YYYY-MM-DD HH:mm:ss"))}
            {expiryTimestamp === "0" && newExpireDate?.format("YYYY-MM-DD")} */}
        <div style={{ display: "flex" }}>
          <div className="max" style={{ marginRight: 10 }}>
            {/* onClick={resetLockTime}> */}
            Reset
          </div>
          <div className="max">
            {/* onClick={handleMaxLockTime}> */}
            MAX
          </div>
        </div>
      </div>
      <input type="date" className="date-picker" />
      <div className="select-time-limit">
        <div className="time-limit">
          <input type="checkbox" id="3mo" />
          <span>3 Months</span>
        </div>
        <div className="time-limit">
          <input type="checkbox" id="6mo" />
          <span>6 Months</span>
        </div>
        <div className="time-limit">
          <input type="checkbox" id="1yr" />
          <span>1 Year</span>
        </div>
        <div className="time-limit">
          <input type="checkbox" id="2yr" />
          <span>2 Years</span>
        </div>
      </div>
      <button>Extend Lock Time</button>
      <button>Lock & Stake WTF</button>
      <button>Approve WTF</button>
      <button>Connect Wallet</button>
      <div className="label">
        <p>Convert Ratio</p>
        <span>convertRatio</span>
      </div>
      <div className="label">
        <p>Received veWTF</p>
        <span>receivedVeWTF</span>
      </div>
      <div className="label">
        <p>APR</p>
        <span>APR</span>
      </div>
      <button>Confirm</button>
    </div>
  );
}
export default IncreaseAction;
