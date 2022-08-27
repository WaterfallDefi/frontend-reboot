import React, { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Blog from "./Blog";
import { MarketList } from "./config/markets";
import Dashboard from "./dashboard/Dashboard";
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
  const [mode, setMode] = useState<Mode>(Mode.Light);
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

  const layout = (element: JSX.Element, tutorial: boolean) => [
    <Header
      key="header"
      mode={mode}
      setMode={setMode}
      network={network}
      setNetwork={setNetwork}
      modal={modal}
      setModal={setModal}
      setMarkets={setMarkets}
    />,
    ...(tutorial ? [<Tutorial key="tutorial" mode={mode} />, element] : [element]),
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={layout(<Dashboard key="dashboard" mode={mode} network={network} markets={markets} />, false)}
        />
        <Route
          path="/markets"
          element={layout(
            <Markets
              key="markets"
              mode={mode}
              network={network}
              markets={markets}
              setMarkets={setMarkets}
              setModal={setModal}
            />,
            true
          )}
        />
        <Route
          path="/portfolio"
          element={layout(
            <MyPortfolio
              key="portfolio"
              mode={mode}
              network={network}
              markets={markets ? markets : []}
              setMarkets={setMarkets}
              setModal={setModal}
            />,
            true
          )}
        />
        <Route
          path="/stake"
          element={layout(<Stake key="stake" mode={mode} network={network} setModal={setModal} />, false)}
        />
        <Route path="/blog" element={layout(<Blog />, false)} />
      </Routes>
      <Footer mode={mode} />
    </BrowserRouter>
  );
}

export default WaterfallDefi;
