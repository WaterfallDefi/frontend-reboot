import React, { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// import Blog from "./Blog";
import { MarketList } from "./config/markets";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { getMarkets } from "./hooks/getMarkets";
import Markets from "./markets/Markets";
import MyPortfolio from "./myportfolio/MyPortfolio";
// import Stake from "./stake/Stake";
import { Market } from "./types";

export enum Mode {
  Light = "light",
  Dark = "dark",
}

export enum Network {
  AVAX = 43114,
  BNB = 56,
  Polygon = 137,
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

function WaterfallDefi() {
  const [network, setNetwork] = useState<Network>(Network.AVAX);
  const [markets, setMarkets] = useState<Market[] | undefined>();
  const [modal, setModal] = useState<ModalProps>({ state: Modal.None });
  const [disableHeaderNetworkSwitch, setDisableHeaderNetworkSwitch] = useState<boolean>(false);

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
              />,
              <MyPortfolio key="portfolio" mode={Mode.Dark} markets={markets ? markets : []} />,
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
