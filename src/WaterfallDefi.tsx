import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import Blog from "./Blog";
import { MarketList } from "./config/markets";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { getMarkets } from "./hooks/getMarkets";
import Markets from "./markets/Markets";
import { fetchSingleSubgraphCycleQuery } from "./myportfolio/hooks/useSubgraphQuery";
import MyPortfolio from "./myportfolio/MyPortfolio";
// import Stake from "./stake/Stake";
import { Market } from "./types";

const BIG_TEN = new BigNumber(10);

export enum Mode {
  Light = "light",
  Dark = "dark",
}

export enum Network {
  AVAX = 43114,
  AETH = 42161,
}

export enum Modal {
  None = 0,
  Txn = 1,
  ConnectWallet = 2,
  // Redeposit = 3, unused
  // Claim = 4, unused
  Terms = 5,
}

export type ModalProps = {
  state: Modal;
  txn?: string;
  status?: string;
  message?: string;
};

export type APYData = {
  id: string;
  y: number;
  x: Date;
};

function WaterfallDefi() {
  const [network, setNetwork] = useState<Network>(Network.AETH);
  const [markets, setMarkets] = useState<Market[] | undefined>();
  const [modal, setModal] = useState<ModalProps>({ state: Modal.None });
  const [disableHeaderNetworkSwitch, setDisableHeaderNetworkSwitch] = useState<boolean>(false);
  const [APYData, setAPYData] = useState<APYData[]>([]);
  const [latestAPYs, setLatestAPYs] = useState<(APYData | undefined)[]>([]);

  useEffect(() => {
    setModal({
      state: Modal.Terms,
    });
  }, []);

  useEffect(() => {
    if (!markets) {
      getMarkets(MarketList).then((res) => {
        setMarkets(res);
      });
    }
  }, [markets]);

  //need to upgrade this if we ever have more than one product
  useEffect(() => {
    const fetchSubgraph = async () => {
      const subgraphQuery: any = await fetchSingleSubgraphCycleQuery(MarketList[0].subgraphURL);
      const data: APYData[] = subgraphQuery.data.trancheCycles.map((tc: any) => ({
        id: tc.id,
        y: new BigNumber(tc.aprBeforeFee).dividedBy(BIG_TEN.pow(8)).times(100).toNumber(),
        x: new Date(Number(tc.endAt) * 1000),
      }));
      setAPYData(data);
    };

    fetchSubgraph();
  }, []);

  useEffect(() => {
    const _latestAPY = [];
    //fixed tranche, APYData already sorted by time, APY will never be 0 and that represents ongoing cycle
    _latestAPY.push(APYData.filter((apy) => apy.id.slice(0, 2) === "0-" && apy.y !== 0).pop());
    //variable tranche, APYData already sorted by time, APY will never be 0 and that represents ongoing cycle
    _latestAPY.push(APYData.filter((apy) => apy.id.slice(0, 2) === "1-" && apy.y !== 0).pop());
    //...junior tranche?? do we need??
    setLatestAPYs(_latestAPY);
  }, [APYData]);

  const layout = (elements: JSX.Element[], tutorial: boolean) => [
    <Header
      key="header"
      mode={Mode.Dark}
      network={network}
      disableHeaderNetworkSwitch={disableHeaderNetworkSwitch}
      setDisableHeaderNetworkSwitch={setDisableHeaderNetworkSwitch}
      setNetwork={setNetwork}
      modal={modal}
      setModal={setModal}
      setMarkets={setMarkets}
    />,
    ...[elements],
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={layout(
            [
              <Markets
                key="markets"
                mode={Mode.Dark}
                network={network}
                setDisableHeaderNetworkSwitch={setDisableHeaderNetworkSwitch}
                setNetwork={setNetwork}
                markets={markets}
                setMarkets={setMarkets}
                setModal={setModal}
                APYData={APYData}
                latestAPYs={latestAPYs}
              />,
              <MyPortfolio
                key="portfolio"
                mode={Mode.Dark}
                markets={markets ? markets : []}
                latestAPYs={latestAPYs}
                setModal={setModal}
                setMarkets={setMarkets}
              />,
            ],
            true
          )}
        />
      </Routes>
      <Footer mode={Mode.Dark} />
    </BrowserRouter>
  );
}

export default WaterfallDefi;
