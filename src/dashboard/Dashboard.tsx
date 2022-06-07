import "./Dashboard.scss";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { createRef, useEffect, useRef, useState } from "react";
import { Mode, Network } from "../WaterfallDefi";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";
import { Market } from "../types";
import getWTFApr, { formatAllocPoint } from "../hooks/getWtfApr";
import { useCoingeckoPrices } from "../hooks/useCoingeckoPrices";

type Props = {
  mode: Mode;
  markets: Market[];
};

function Dashboard(props: Props) {
  const { mode, markets } = props;

  const [darkTwitter, setDarkTwitter] = useState(false);

  const { price, marketCap } = useWTFPriceLP();
  const coingeckoPrices = useCoingeckoPrices(markets);

  const totalTvl = useTotalTvl();

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
                      ).map((_trancheText, j) => {
                        const trancheApr: string = _market.tranches[j]?.apy;
                        const wtfApr = _market
                          ? getWTFApr(
                              _market.isAvax ? Network.AVAX : Network.BNB,
                              formatAllocPoint(
                                _market?.pools[j],
                                _market?.totalAllocPoints
                              ),
                              _market?.tranches[j],
                              _market?.duration,
                              _market?.rewardPerBlock,
                              price,
                              _market?.assets,
                              coingeckoPrices
                            )
                          : "-";

                        const netApr =
                          trancheApr && wtfApr && wtfApr !== null
                            ? Number(trancheApr) +
                              Number(numeral(wtfApr).value())
                            : Number(numeral(trancheApr).value());

                        return (
                          <div className="block" key={i.toString() + j}>
                            <h1>{_trancheText}</h1>
                            <div className="section">
                              <div className="apr-wrapper">
                                <span>Total APR</span>
                                <p>{numeral(netApr).format("0,0.[00]")}%</p>
                              </div>
                              <div className="apr-wrapper">
                                <span>
                                  {j === _market.trancheCount - 1
                                    ? "Variable"
                                    : "Fixed"}
                                </span>
                                <p>{trancheApr}%</p>
                              </div>
                              <div className="apr-wrapper">
                                <span>WTF APR</span>
                                <p>{wtfApr}%</p>
                              </div>
                              <div className="line" />
                              <div className="fee"></div>
                            </div>
                          </div>
                        );
                      })}
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
