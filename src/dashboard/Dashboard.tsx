import "./Dashboard.scss";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { createRef, useEffect, useRef, useState } from "react";
import { Mode } from "../WaterfallDefi";
import { useWTFPriceLP } from "../markets/hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";
import { Market } from "../types";

type Props = {
  mode: Mode;
  markets: Market[];
};

function Dashboard(props: Props) {
  const { mode, markets } = props;

  const [darkTwitter, setDarkTwitter] = useState(false);

  const { price, marketCap } = useWTFPriceLP();

  const totalTvl = useTotalTvl();

  const scrollRefs = useRef(markets.map(() => createRef()));

  useEffect(() => {
    if (mode === Mode.Dark) {
      setDarkTwitter(true);
    } else {
      setDarkTwitter(false);
    }
  }, [mode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const threeTrancheDisplayTexts = ["Senior", "Mezzanine", "Junior"];
  const twoTrancheDisplayTexts = ["Fixed", "Variable"];

  return (
    <div className={"dashboard-wrapper " + mode}>
      <div className="dash-banner">
        <div className="dash-banner-img" />
        <div className="linear-gradient" />
        <h1>Dashboard</h1>
        <div className="content">
          <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">
              $ {price ? numeral(price).format("0,0.[00]") : "-"}
            </span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">
              $ {marketCap ? numeral(marketCap).format("0,0") : "-"}
            </span>
          </div>
          <div className="block">
            <span className="title" />
            <div className="icon-group">
              <Metamask />
            </div>
          </div>
        </div>
      </div>
      <div className="total-value-locked">
        <div className="text">Total Value Locked</div>
        <div className="value">${totalTvl}</div>
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
        <div className="market-carousel">
          <div className="icon-wrapper"></div>
          <div className="carousel-container">
            <div className="carousel-slides">
              {markets.map((_market: Market, i) => {
                if (!_market.isRetired)
                  return (
                    <div className="slide" key={i}>
                      <div className="title">{_market.portfolio}</div>
                      {(_market.trancheCount === 3
                        ? threeTrancheDisplayTexts
                        : twoTrancheDisplayTexts
                      ).map((_trancheText, j) => (
                        <div className="block">
                          <h1>{_trancheText}</h1>
                          <div className="section">
                            <div className="apr-wrapper">
                              <span>Total APR</span>
                              <p>3%</p>
                            </div>
                            <div className="apr-wrapper">
                              <span>
                                {j === _market.trancheCount - 1
                                  ? "Variable"
                                  : "Fixed"}
                              </span>
                              <span>trancheApr</span>
                            </div>
                            <div className="apr-wrapper">
                              <span>WTF APR</span>
                              <span>wtfAPR</span>
                            </div>
                            <div className="line" />
                            <div className="fee"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
