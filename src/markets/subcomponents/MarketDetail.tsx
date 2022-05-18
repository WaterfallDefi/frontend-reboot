type Props = {};

const MarketDetail: React.FC<Props> = ({}) => {
  return (
    <div className="market-detail-wrapper">
      <div className="information">
        <div className="block-wrapper">
          <div className="block">
            <span className="portfolio-name">port name</span>
          </div>
          <div className="block">
            <span className="assets"></span>
          </div>
          <div className="block">
            <span className="tvl"></span>
          </div>
        </div>
      </div>
      <div className="charts"></div>
      <div className="content-cd"></div>
    </div>
  );
};

export default MarketDetail;
