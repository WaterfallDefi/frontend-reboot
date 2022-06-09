function UnstakeAction() {
  return (
    <div className="unstake">
      <div className="label">
        <p>
          Available unlock:
          <span>veWTFBalance</span>
        </p>
      </div>

      <div className="label" style={{ marginTop: 24 }}>
        <p>Burning veWTF</p>
        <span>veWTFBalance</span>
      </div>
      <div className="label">
        <p>Receiving WTF</p>
        <span>lockingWTF</span>
      </div>
      <button>Unlock</button>
    </div>
  );
}

export default UnstakeAction;
