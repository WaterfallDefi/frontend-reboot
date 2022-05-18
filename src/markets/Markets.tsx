import "./Markets.scss";

type Props = {};

const Markets: React.FC<Props> = ({}) => {
  return (
    <div className="markets-wrapper">
      <div className="header-row">
        <div className="header first">
          <span>Portfolio Name</span>
        </div>
        <div className="header">
          <span>Asset</span>
        </div>
        <div className="header">
          <span>Lock-up period</span>
        </div>
        <div className="header">
          <span>Deposit APR</span>
        </div>
        <div className="header">
          <span>TVL</span>
        </div>
        <div className="header">
          <span>Status</span>
        </div>
        <div className="header last">
          <span>Action</span>
        </div>
      </div>
    </div>
  );
};

export default Markets;
