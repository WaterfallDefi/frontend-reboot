import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
}

export type ModalProps = {
  state: Modal;
  txn?: string;
  status?: string;
  message?: string;
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
    />,
    ...(tutorial
      ? [<Tutorial key="tutorial" mode={mode} />, element]
      : [element]),
  ];

  const marketInjection = markets ? markets : [];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={layout(
            <Dashboard
              key="dashboard"
              mode={mode}
              network={network}
              markets={marketInjection}
            />,
            false
          )}
        />
        <Route
          path="/markets"
          element={layout(
            <Markets
              key="markets"
              mode={mode}
              network={network}
              markets={marketInjection}
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
              markets={marketInjection}
            />,
            true
          )}
        />
        <Route
          path="/stake"
          element={layout(
            <Stake key="stake" mode={mode} network={network} />,
            false
          )}
        />
      </Routes>
      <Footer mode={mode} />
    </BrowserRouter>
  );
}

export default WaterfallDefi;
