import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ethers } from "ethers";
import { Web3ReactProvider } from "@web3-react/core";
import WaterfallDefi from "./WaterfallDefi";

const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  return library;
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WaterfallDefi />
      </Web3ReactProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
