import React, { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Blog from "./Blog";
import { MarketList } from "./config/markets";
import Dashboard from "./dashboard_v2/Dashboard_v2";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { getMarkets } from "./hooks/getMarkets";
import Markets from "./markets/Markets";
import MyPortfolio from "./myportfolio/MyPortfolio";
import Stake from "./stake/Stake";
import Tutorial from "./tutorial/Tutorial";
import { Market } from "./types";

export enum Mode {
  Light = "light",
  Dark = "dark",
}

export enum Network {
  AVAX = 43114,
  BNB = 56,
}

export enum Modal {
  None = 0,
  Txn = 1,
  ConnectWallet = 2,
  Redeposit = 3,
  Claim = 4,
}

export type ModalProps = {
  state: Modal;
  txn?: string;
  status?: string;
  message?: string;
  redepositProps?: {
    selectedMarket: Market;
    selectedDepositAssetIndex: number;
    balance: string | string[];
    simulDeposit: boolean;
    coingeckoPrices: any;
    setSelectedDepositAssetIndex: React.Dispatch<React.SetStateAction<number>>;
    setSimulDeposit: React.Dispatch<React.SetStateAction<boolean>>;
    setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
    setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
  };
  claimProps?: {
    network: Network;
    balance: string;
    setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
    claimReward: (_lockDurationIfLockNotExists: string, _lockDurationIfLockExists: string) => Promise<void>;
  };
};

function WaterfallDefi() {
  const [network, setNetwork] = useState<Network>(Network.AVAX);
  const [markets, setMarkets] = useState<Market[] | undefined>();
  const [modal, setModal] = useState<ModalProps>({ state: Modal.None });

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
      setNetwork={setNetwork}
      modal={modal}
      setModal={setModal}
      setMarkets={setMarkets}
    />,
    ...(tutorial ? [<Tutorial key="tutorial" mode={Mode.Dark} />, ...elements] : [elements]),
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={layout(
            [
              <Dashboard />,
              <Markets
                key="markets"
                mode={Mode.Dark}
                network={network}
                markets={markets}
                setMarkets={setMarkets}
                setModal={setModal}
              />,
            ],
            true
          )}
        />
        <Route
          path="/portfolio"
          element={layout(
            [
              <MyPortfolio
                key="portfolio"
                mode={Mode.Dark}
                network={network}
                markets={markets ? markets : []}
                setMarkets={setMarkets}
                setModal={setModal}
              />,
            ],
            true
          )}
        />
        <Route
          path="/stake"
          element={layout([<Stake key="stake" mode={Mode.Dark} network={network} setModal={setModal} />], false)}
        />
        <Route path="/blog" element={layout([<Blog />], false)} />
      </Routes>
      <Footer mode={Mode.Dark} />
    </BrowserRouter>
  );
}

export default WaterfallDefi;
