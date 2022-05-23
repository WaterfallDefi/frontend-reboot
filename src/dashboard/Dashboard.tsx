import "./Dashboard.scss";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useEffect } from "react";

type Props = {};

const Dashboard: React.FC<Props> = ({}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dash-banner">
        <div className="dash-banner-img" />
        <div className="linear-gradient" />
        <h1>Dashboard</h1>
        <div className="content">
          <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">$0.15</span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">$1,000,000</span>
          </div>
          <div className="block">
            <span className="title"></span>
          </div>
        </div>
      </div>
      <div className="total-value-locked">
        <div className="text">Total Value Locked</div>
        <div className="value">$1,500,000</div>
      </div>
      <div className="info-wrapper">
        <div className="announcements">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="Waterfalldefi"
            theme="light"
            noHeader
            noFooter
            options={{ height: "100%" }}
            transparent
            noScrollbar
          />
        </div>
        <div className="market-carousel"></div>
      </div>
    </div>
  );
};

export default Dashboard;
