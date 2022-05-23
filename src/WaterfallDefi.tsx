import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Markets from "./markets/Markets";
import MyPortfolio from "./myportfolio/MyPortfolio";
import Stake from "./stake/Stake";
import Tutorial from "./tutorial/Tutorial";

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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={[
            <Header key="header" mode={mode} />,
            <Dashboard key="dashboard" mode={mode} />,
          ]}
        />
        <Route
          path="/portfolio/markets"
          element={[
            <Header key="header" mode={mode} />,
            <Tutorial key="tutorial" mode={mode} />,
            <Markets key="markets" mode={mode} />,
          ]}
        />
        <Route
          path="/portfolio/my-portfolio"
          element={[
            <Header key="header" mode={mode} />,
            <Tutorial key="tutorial" mode={mode} />,
            <MyPortfolio key="portfolio" mode={mode} />,
          ]}
        />
        <Route
          path="/stake"
          element={[<Header key="header" mode={mode} />, <Stake mode={mode} />]}
        />
      </Routes>
      <Footer mode={mode} />
    </BrowserRouter>
  );
}

export default WaterfallDefi;
