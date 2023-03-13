import "./Header.scss";

import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { Modal, ModalProps, Mode, Network } from "../WaterfallDefi";
import useAuth, { setupNetwork, useEagerConnect } from "./hooks/useAuth";
import ConnectWalletModal from "./subcomponents/ConnectWalletModal";
import TransactionModal from "./subcomponents/TransactionModal";
import TermsModal from "./subcomponents/TermsModal";
import { Market } from "../types";
import { Burger } from "./svgs/burger";
import { WaterFallDark } from "./svgs";
import yego from "./pngs/y3go.png";
import { Logout } from "./svgs/logout";

const formatAccountAddress = (address?: string | null) => {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const switchNetwork = async (
  account: string | null | undefined,
  network: Network,
  setNetwork: React.Dispatch<React.SetStateAction<Network>>
) => {
  if (account) {
    let success: boolean = false;
    const provider = window.ethereum;
    if (provider?.request) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${network.toString(16)}`,
            },
          ],
        });
        success = true;
      } catch (error) {
        try {
          await setupNetwork(network);
        } catch (error) {}
        // console.error("Failed to setup the network in Metamask:", error);
      } finally {
        success && setNetwork(network);
      }
    }
    return success;
  } else {
    setNetwork(network);
    return true;
  }
};

type Props = {
  mode: Mode;
  network: Network;
  disableHeaderNetworkSwitch: boolean;
  setDisableHeaderNetworkSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  modal: ModalProps;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

function Header(props: Props) {
  const {
    mode,
    network,
    disableHeaderNetworkSwitch,
    setDisableHeaderNetworkSwitch,
    setNetwork,
    modal,
    setModal,
    setMarkets,
  } = props;

  const { active, account, chainId } = useWeb3React<Web3Provider>();

  const { logout } = useAuth(network);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    if (chainId && chainId.toString() !== Network[network]) {
      setNetwork(chainId);
    }
  }, [chainId, network, setNetwork]);

  //when navigating away from markets, reenable header network switch in case that user selected a product
  useEffect(() => {
    if (location.pathname !== "/" && disableHeaderNetworkSwitch) {
      setDisableHeaderNetworkSwitch(false);
    }
  }, [location.pathname, disableHeaderNetworkSwitch, setDisableHeaderNetworkSwitch]);

  useEagerConnect(network);

  return (
    <div className={"header-wrapper " + mode}>
      <div
        className={"mask" + (modal.state !== Modal.None || mobileDropdownOpen ? " visible" : "")}
        onClick={() => (modal.state !== Modal.None ? setModal({ state: Modal.None }) : setMobileDropdownOpen(false))}
      />
      {modal.state === Modal.Terms ? <TermsModal setModal={setModal} /> : null}
      {modal.state === Modal.ConnectWallet ? <ConnectWalletModal network={network} /> : null}
      {modal.state === Modal.Txn ? (
        <TransactionModal
          network={network}
          txn={modal.txn}
          status={modal.status}
          message={modal.message}
          setModal={setModal}
        />
      ) : null}
      <div className="pc-left">
        <div className="yego-logo" />
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/"}
            onClick={() => {
              if (location.pathname === "/") {
                setMarkets(undefined);
              }
              const markets = document.getElementById("markets");
              if (markets) {
                markets?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Markets
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <p
            className="link"
            onClick={() => {
              const myPortfolio = document.getElementById("my-portfolio");
              if (myPortfolio) {
                myPortfolio?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            My Portfolio
          </p>
        </div>
        {/* <div className="menu-block-wrapper">
          <a href="https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide">User Guide</a>
        </div>
        <div className="menu-block-wrapper">
          <Link className="link" to={"/blog"} data-selected={location.pathname === "/blog"}>
            Blog
          </Link>
        </div> */}
      </div>
      <div className="mobile-left">
        <div onClick={() => setMobileDropdownOpen(true)}>
          <Burger />
        </div>
        <div className={"mobile-menu" + (mobileDropdownOpen ? " open" : "")}>
          <div className="mobile-menu-burger" onClick={() => setMobileDropdownOpen(false)}>
            <Burger />
          </div>
          <div className="mobile-menu-block-wrapper">
            <Link
              className="link"
              to={"/"}
              data-selected={location.pathname === "/"}
              onClick={() => {
                if (location.pathname === "/") {
                  setMarkets(undefined);
                }
                const markets = document.getElementById("markets");
                if (markets) {
                  markets?.scrollIntoView({ behavior: "smooth" });
                }
                setMobileDropdownOpen(false);
              }}
            >
              Markets
            </Link>
          </div>
          <div className="mobile-menu-block-wrapper">
            <Link
              className="link"
              to={"/portfolio"}
              data-selected={location.pathname === "/portfolio"}
              onClick={() => {
                const myPortfolio = document.getElementById("my-portfolio");
                if (myPortfolio) {
                  myPortfolio?.scrollIntoView({ behavior: "smooth" });
                }
                setMobileDropdownOpen(false);
              }}
            >
              My Portfolio
            </Link>
          </div>
          {/* <div className="mobile-menu-block-wrapper">
            <a href="https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide">User Guide</a>
          </div>
          <div className="mobile-menu-block-wrapper">
            <Link
              className="link"
              to={"/blog"}
              data-selected={location.pathname === "/blog"}
              onClick={() => setMobileDropdownOpen(false)}
            >
              Blog
            </Link>
          </div> */}
        </div>
      </div>
      <div className="right">
        <div className="wallet-wrapper">
          <div
            className={"dropdown" + (dropdownOpen ? " open" : "")}
            // onMouseEnter={() => setDropdownOpen(true)}
            // onMouseLeave={() => setDropdownOpen(false)}
          >
            <div
              className={
                "network" + (network === Network.AVAX ? " avax" : "") + (network === Network.AETH ? " aeth" : "")
              }
            >
              <div className="dropdown-triangle">▼</div>
              {network === Network.AETH && "AETH"}
            </div>
            {dropdownOpen
              ? network === Network.AETH
                ? [
                    <div
                      key="aeth"
                      className="network aeth option"
                      onClick={() => !disableHeaderNetworkSwitch && switchNetwork(account, Network.AETH, setNetwork)}
                    >
                      AETH
                    </div>,
                  ]
                : [
                    <div
                      key="avax"
                      className="network avax option"
                      onClick={() => !disableHeaderNetworkSwitch && switchNetwork(account, Network.AVAX, setNetwork)}
                    >
                      AVAX
                    </div>,
                  ]
              : null}
          </div>
          {!active ? (
            <button
              className="connect-wallet-btn"
              onClick={() => {
                setModal({ state: Modal.ConnectWallet });
              }}
            >
              Connect Wallet
            </button>
          ) : (
            [
              <div key="connect" className="connect-wallet-btn">
                <div>{formatAccountAddress(account)}</div>
              </div>,
              <div key="logout" className="logout-btn" onClick={logout}>
                <Logout />
              </div>,
            ]
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
