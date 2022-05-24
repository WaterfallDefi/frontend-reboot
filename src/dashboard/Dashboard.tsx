import "./Dashboard.scss";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useEffect, useState } from "react";
import { Mode } from "../WaterfallDefi";

type Props = {
  mode: Mode;
};

function Dashboard(props: Props) {
  const { mode } = props;

  const [darkTwitter, setDarkTwitter] = useState(false);

  useEffect(() => {
    console.log("wtf");
    if (mode === Mode.Dark) {
      setDarkTwitter(true);
    } else {
      setDarkTwitter(false);
    }
  }, [mode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={"dashboard-wrapper " + mode}>
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
          {!darkTwitter ? (
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
          ) : null}
          {darkTwitter ? (
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="Waterfalldefi"
              theme="dark"
              noHeader
              noFooter
              options={{ height: "100%" }}
              transparent
              noScrollbar
            />
          ) : null}
        </div>
        <div className="market-carousel"></div>
      </div>
    </div>
  );
}

export default Dashboard;
