import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import { Burger } from "./svgs/burger";

type Props = {};

const Header: React.FC<Props> = ({}) => {
  const location = useLocation();
  return (
    <div className="header-wrapper">
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
          <Link
            className="link"
            target="_blank"
            rel="noopener noreferrer"
            to={
              "https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide"
            }
          >
            User Guide
          </Link>
        </div>
      </div>
      <div className="mobile-left"></div>
      <div className="right">
        <div className="wallet-wrapper">
          <div className="network">
            <select className="network-menu">
              <option value="avax">AVAX</option>
              <option value="bnb">BNB</option>
            </select>
          </div>
          <button className="connect-wallet-btn">Connect Wallet</button>
        </div>
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
};

export default Header;
