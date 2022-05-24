import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mode } from "../WaterfallDefi";
import "./Header.scss";
import { Dark } from "./svgs/dark";
import { Light } from "./svgs/light";
//this is for mobile, do later
// import { Burger } from "./svgs/burger";

type Props = {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
};

function Header(props: Props) {
  const { mode, setMode } = props;

  const location = useLocation();
  return (
    <div className={"header-wrapper " + mode}>
      <div className="pc-left">
        <div className="waterfalldefi" />
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/"}
            data-selected={location.pathname === "/"}
          >
            Dashboard
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/portfolio/markets"}
            data-selected={location.pathname === "/portfolio/markets"}
          >
            Markets
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/portfolio/my-portfolio"}
            data-selected={location.pathname === "/portfolio/my-portfolio"}
          >
            My Portfolio
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/stake"}
            data-selected={location.pathname === "/stake"}
          >
            Stake
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <a href="https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide">
            User Guide
          </a>
        </div>
      </div>
      <div className="mobile-left"></div>
      <div className="right">
        <div className="wallet-wrapper">
          <div className="network avax">
            <div className="dropdown-triangle">▼</div>AVAX
          </div>
          <button className="connect-wallet-btn">Connect Wallet</button>
        </div>
        {mode === Mode.Light ? (
          <div className="dark-icon" onClick={() => setMode(Mode.Dark)}>
            <Dark />
          </div>
        ) : null}
        {mode === Mode.Dark ? (
          <div className="light-icon" onClick={() => setMode(Mode.Light)}>
            <Light />
          </div>
        ) : null}
      </div>
      {/* todo: mobile drawers */}
      {/* <header>
              <Burger />
              <img src="url(/waterfalldefi.png)" />
            </header> */}
      {/* todo: Connect Wallet Modal component in /subcomponents */}
      {/* <ConnectWalletModal/> */}
    </div>
  );
}

export default Header;
