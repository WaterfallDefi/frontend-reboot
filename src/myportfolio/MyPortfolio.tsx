import "./MyPortfolio.scss";

type Props = {};

const MyPortfolio: React.FC<Props> = ({}) => {
  return (
    <div className="my-portfolio-wrapper">
      <div className="header-row">
        <div className="header first">
          <span>Portfolio Name</span>
        </div>
        <div className="header">
          <span>Asset</span>
        </div>
        <div className="header">
          <span>Cycle</span>
        </div>
        <div className="header">
          <span>Tranche</span>
        </div>
        <div className="header">
          <span>APR</span>
        </div>
        <div className="header">
          <span>Principal</span>
        </div>
        <div className="header">
          <span>Status</span>
        </div>
        <div className="header last">
          <span>Yield</span>
        </div>
      </div>
    </div>
  );
};

export default MyPortfolio;
