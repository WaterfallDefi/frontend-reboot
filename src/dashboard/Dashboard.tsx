import "./Dashboard.scss";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useEffect, useRef, useState } from "react";
import { Mode, Network } from "../WaterfallDefi";
import { useWTFPriceLP } from "../hooks/useWtfPriceFromLP";
import numeral from "numeral";
import { Metamask } from "../header/svgs/Metamask";
import useTotalTvl from "./hooks/useTotalTvl";
import { Market } from "../types";
import getWTFApr, { formatAllocPoint } from "../hooks/getWtfApr";
import { useCoingeckoPrices } from "../hooks/useCoingeckoPrices";
import { useIsBrowserTabActive } from "../hooks/useIsBrowserTabActive";
import { useNavigate } from "react-router-dom";

type Props = {
  mode: Mode;
  network: Network;
  markets: Market[] | undefined;
};

function Dashboard(props: Props) {
  const { mode, network, markets } = props;

  const nav = useNavigate();

  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselMarkets = markets ? markets.filter((m) => (network === Network.AVAX ? m.isAvax : !m.isAvax)) : [];

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [darkTwitter, setDarkTwitter] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  const bgImgs = ["default", "alternate", "none"];

  const { price, marketCap } = useWTFPriceLP();
  const coingeckoPrices = useCoingeckoPrices(markets ? markets : []);

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

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    if (carouselRef.current?.scrollLeft !== (carouselMarkets.length - 1) * 420) {
      carouselRef.current?.scrollBy({ left: 10, behavior: "smooth" });
    } else {
      carouselRef.current?.scrollBy({
        left: (carouselMarkets.length - 1) * -420,
        behavior: "smooth",
      });
    }
  }, [carouselRef, refreshCounter, carouselMarkets.length]);

  const threeTrancheDisplayTexts = ["Senior", "Mezzanine", "Junior"];
  const twoTrancheDisplayTexts = ["Fixed", "Variable"];

  return (
    <div className={"dashboard-wrapper " + mode}>
      <div className="dash-banner">
        <div className={"dash-banner-img " + bgImgs[backgroundImg]} />
        <div
          className="banner-img-toggle"
          onClick={() => (backgroundImg === 2 ? setBackgroundImg(0) : setBackgroundImg(backgroundImg + 1))}
        />
        <div className="linear-gradient" />
        <h1>Dashboard</h1>
        <div className="content">
          <div className="block">
            <span className="title">WTF Price</span>
            <span className="value">$ {price ? numeral(price).format("0,0.[00]") : "-"}</span>
          </div>
          <div className="block">
            <span className="title">Market Cap</span>
            <span className="value">$ {marketCap ? numeral(marketCap).format("0,0") : "-"}</span>
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
          <div className="title">Announcements</div>
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
          <div className="icon-wrapper">
            <div className={"svg" + (network === Network.AVAX ? " avax" : " bnb")} />
          </div>
          <div className="carousel-container">
            <div className="carousel-slides" ref={carouselRef}>
              {carouselMarkets.map((_market: Market, i) => {
                return !_market.isRetired ? (
                  <div className="slide" key={i}>
                    <div className="title">{_market.portfolio}</div>
                    {(_market.trancheCount === 3 ? threeTrancheDisplayTexts : twoTrancheDisplayTexts).map(
                      (_trancheText, j) => {
                        const trancheApr: string = _market.tranches[j]?.apy;
                        const wtfApr = _market
                          ? getWTFApr(
                              _market.isAvax ? Network.AVAX : Network.BNB,
                              formatAllocPoint(_market?.pools[j], _market?.totalAllocPoints),
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
                            ? Number(trancheApr) + Number(numeral(wtfApr).value())
                            : Number(numeral(trancheApr).value());

                        return (
                          <div className="block" key={i.toString() + j}>
                            <h1 className={_trancheText}>{_trancheText}</h1>
                            <div className="section">
                              <div className="apr-wrapper">
                                <span>Total APR</span>
                                <p>{numeral(netApr).format("0,0.[00]")}%</p>
                              </div>
                              <div className="apr-wrapper">
                                <span>{j === _market.trancheCount - 1 ? "Variable" : "Fixed"}</span>
                                <p>{trancheApr}%</p>
                              </div>
                              <div className="apr-wrapper">
                                <span>WTF APR</span>
                                <p>{wtfApr}%</p>
                              </div>
                              <div className="line" />
                              <div className="fee">
                                <span>Withdraw Fee</span>
                                <span>{_market?.tranches[j].fee}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <button onClick={() => nav("/markets")}>Start</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
