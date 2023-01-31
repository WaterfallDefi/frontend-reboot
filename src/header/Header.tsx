import "./Header.scss";

import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { Modal, ModalProps, Mode, Network } from "../WaterfallDefi";
import useAuth, { setupNetwork, useEagerConnect } from "./hooks/useAuth";
import ConnectWalletModal from "./subcomponents/ConnectWalletModal";
import TransactionModal from "./subcomponents/TransactionModal";
import RedepositModal from "./subcomponents/RedepositModal";
import TermsModal from "./subcomponents/TermsModal";
import { Market } from "../types";
import { Burger } from "./svgs/burger";
import { WaterFallDark } from "./svgs";
import { Logout } from "./svgs/logout";

//this is for mobile, do later
// import { Burger } from "./svgs/burger";

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
      {modal.state === Modal.Redeposit && modal.redepositProps ? (
        <RedepositModal
          selectedMarket={modal.redepositProps.selectedMarket}
          selectedDepositAssetIndex={modal.redepositProps.selectedDepositAssetIndex}
          balance={modal.redepositProps.balance}
          simulDeposit={modal.redepositProps.simulDeposit}
          // coingeckoPrices={modal.redepositProps.coingeckoPrices}
          setSelectedDepositAssetIndex={modal.redepositProps.setSelectedDepositAssetIndex}
          setSimulDeposit={modal.redepositProps.setSimulDeposit}
          setModal={modal.redepositProps.setModal}
          setMarkets={modal.redepositProps.setMarkets}
        />
      ) : null}
      {/* {modal.state === Modal.Claim && modal.claimProps ? (
        <ClaimModal
          network={modal.claimProps.network}
          balance={modal.claimProps.balance}
          setModal={modal.claimProps.setModal}
          claimReward={modal.claimProps.claimReward}
        />
      ) : null} */}
      <div className="pc-left">
        <div className="waterfall-defi-logo">
          <WaterFallDark />
        </div>
        <div className="menu-block-wrapper">
          <Link
            className="link"
            to={"/"}
            data-selected={location.pathname === "/"}
            onClick={() => {
              if (location.pathname === "/") {
                setMarkets(undefined);
              }
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Markets
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <p
            className="link"
            onClick={() => {
              window.scrollTo({
                top: document.documentElement.scrollHeight + 500,
                behavior: "smooth",
              });
            }}
          >
            My Portfolio
          </p>
        </div>
        {/* no more wtf */}
        {/* {network !== Network.Polygon && (
          <div className="menu-block-wrapper">
            <Link className="link" to={"/stake"} data-selected={location.pathname === "/stake"}>
              Stake
            </Link>
          </div>
        )} */}
        <div className="menu-block-wrapper">
          <a href="https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide">User Guide</a>
        </div>
        <div className="menu-block-wrapper">
          <Link className="link" to={"/blog"} data-selected={location.pathname === "/blog"}>
            Blog
          </Link>
        </div>
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
                location.pathname === "/" && setMarkets(undefined);
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
              onClick={() => setMobileDropdownOpen(false)}
            >
              My Portfolio
            </Link>
          </div>
          {/* no more WTF */}
          {/* {network !== Network.Polygon && (
            <div className="mobile-menu-block-wrapper">
              <Link
                className="link"
                to={"/stake"}
                data-selected={location.pathname === "/stake"}
                onClick={() => setMobileDropdownOpen(false)}
              >
                Stake
              </Link>
            </div>
          )} */}
          <div className="mobile-menu-block-wrapper">
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
          </div>
        </div>
      </div>
      <div className="right">
        <div className="wallet-wrapper">
          <div
            className={"dropdown" + (dropdownOpen ? " open" : "")}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div
              className={
                "network" +
                (network === Network.AVAX ? " avax" : "") +
                (network === Network.BNB ? " bnb" : "") +
                (network === Network.Polygon ? " matic" : "")
              }
            >
              <div className="dropdown-triangle">▼</div>
              {network === Network.AVAX && "AVAX"}
              {network === Network.BNB && "BNB"}
              {network === Network.Polygon && "MATIC"}
            </div>
            {dropdownOpen
              ? network === Network.AVAX
                ? [
                    <div
                      key="bnb"
                      className="network bnb option"
                      onClick={() => !disableHeaderNetworkSwitch && switchNetwork(account, Network.BNB, setNetwork)}
                    >
                      BNB
                    </div>,
                    location.pathname !== "/stake" ? (
                      <div
                        key="matic"
                        className="network matic option"
                        onClick={() =>
                          !disableHeaderNetworkSwitch && switchNetwork(account, Network.Polygon, setNetwork)
                        }
                      >
                        MATIC
                      </div>
                    ) : null,
                  ]
                : network === Network.BNB
                ? [
                    <div
                      key="avax"
                      className="network avax option"
                      onClick={() => !disableHeaderNetworkSwitch && switchNetwork(account, Network.AVAX, setNetwork)}
                    >
                      AVAX
                    </div>,
                    location.pathname !== "/stake" ? (
                      <div
                        key="matic"
                        className="network matic option"
                        onClick={() =>
                          !disableHeaderNetworkSwitch && switchNetwork(account, Network.Polygon, setNetwork)
                        }
                      >
                        MATIC
                      </div>
                    ) : null,
                  ]
                : [
                    <div
                      key="bnb"
                      className="network bnb option"
                      onClick={() => !disableHeaderNetworkSwitch && switchNetwork(account, Network.BNB, setNetwork)}
                    >
                      BNB
                    </div>,
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
