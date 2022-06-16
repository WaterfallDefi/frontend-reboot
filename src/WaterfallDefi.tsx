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

function WaterfallDefi() {
  const [mode, setMode] = useState<Mode>(Mode.Light);
  const [network, setNetwork] = useState<Network>(Network.AVAX);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [connectWalletModalOpen, setConnectWalletModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    getMarkets(MarketList).then((res) => {
      setMarkets(res);
    });
  }, []);

  console.log(markets);

  const layout = (element: JSX.Element, tutorial: boolean) => [
    <Header
      key="header"
      mode={mode}
      setMode={setMode}
      network={network}
      setNetwork={setNetwork}
      connectWalletModalOpen={connectWalletModalOpen}
      setConnectWalletModalOpen={setConnectWalletModalOpen}
    />,
    ...(tutorial
      ? [<Tutorial key="tutorial" mode={mode} />, element]
      : [element]),
  ];

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
              markets={markets}
            />,
            false
          )}
        />
        <Route
          path="/portfolio/markets"
          element={layout(
            <Markets
              key="markets"
              mode={mode}
              markets={markets}
              setConnectWalletModalOpen={setConnectWalletModalOpen}
            />,
            true
          )}
        />
        <Route
          path="/portfolio/my-portfolio"
          element={layout(
            <MyPortfolio key="portfolio" mode={mode} markets={markets} />,
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
