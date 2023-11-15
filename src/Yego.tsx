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
import { useCoingeckoPrices, useDefiLlamaAPRs } from "./hooks/useCoingeckoPrices";

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

export type APYDataFull = {
  id: string;
  y: number;
  x: Date;
  duration: number;
  farmTokens: any; //type this
  farmTokensAmt: any; //type this
  principal: any; //type this
};

function Yego() {
  const [network, setNetwork] = useState<Network>(Network.AETH);
  const [markets, setMarkets] = useState<Market[] | undefined>();
  const [modal, setModal] = useState<ModalProps>({ state: Modal.None });
  const [disableHeaderNetworkSwitch, setDisableHeaderNetworkSwitch] = useState<boolean>(false);
  const [APYData, setAPYData] = useState<APYDataFull[]>([]);
  const [latestSeniorAPY, setLatestSeniorAPY] = useState<APYDataFull | undefined>();
  const [latestJuniorAPY, setLatestJuniorAPY] = useState<APYDataFull | undefined>();

  const coingeckoPrices: any = useCoingeckoPrices();
  // const defiLlamaAPRs: any = useDefiLlamaAPRs();

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
      if (subgraphQuery.data === undefined) return;
      const data: APYDataFull[] = subgraphQuery.data.trancheCycles.map((tc: any) => ({
        id: tc.id,
        y: new BigNumber(tc.apr).dividedBy(BIG_TEN.pow(16)).toNumber(),
        x: new Date(Number(tc.endAt) * 1000),
        duration: tc.endAt - tc.startAt,
        farmTokens: tc.farmTokens,
        farmTokensAmt: tc.farmTokensAmt,
        principal: new BigNumber(tc.principal).dividedBy(BIG_TEN.pow(6)).toNumber(),
      }));
      console.log(data);
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

    setLatestSeniorAPY(_latestAPY[0]);
    setLatestJuniorAPY(_latestAPY[1]);
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
                coingeckoPrices={coingeckoPrices}
              />,
              latestSeniorAPY && latestJuniorAPY && markets ? (
                <MyPortfolio
                  key="portfolio"
                  mode={Mode.Dark}
                  markets={markets}
                  latestSeniorAPY={latestSeniorAPY}
                  latestJuniorAPY={latestJuniorAPY}
                  coingeckoPrices={coingeckoPrices}
                  setModal={setModal}
                  setMarkets={setMarkets}
                />
              ) : (
                <div />
              ),
            ],
            true
          )}
        />
      </Routes>
      <Footer mode={Mode.Dark} />
    </BrowserRouter>
  );
}

export default Yego;
