import "./Tutorial.scss";

type Props = {};

const Tutorial: React.FC<Props> = ({}) => {
  return (
    <div className="tutorial-wrapper">
      <div className="tutorial-banner">
        <div className="boxes"></div>
        <div className="tutorial-text">
          <h1>Risk Optimised Yield Farming</h1>
          <p>
            Yield will be distributed in a way such that users of more senior
            tranches get a fixed return, while users of more junior tranches get
            a leveraged return
          </p>
        </div>
      </div>
      <div className="claim-wrapper">
        <div className="pre-row" />
        <div className="row">
          <div className="col">
            <div className="img-wrapper"></div>
            <h2>Deposit</h2>
            <p className="desc-text">
              Choose the tranche that suits you and get started!
            </p>
          </div>
          <div className="col">
            <div className="img-wrapper"></div>
            <h2>Wait</h2>
            <p className="desc-text">
              When all the tranches are filled, it will set off the portfolio
              deployment.
            </p>
          </div>
          <div className="col">
            <div className="img-wrapper"></div>
            <h2>Withdraw</h2>
            <p className="desc-text">
              When the deployment period expires, you can claim your returns.
            </p>
          </div>
        </div>
      </div>
      <div className="guide"></div>
    </div>
  );
};

export default Tutorial;
