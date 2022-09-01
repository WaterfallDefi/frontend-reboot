import "./Header.scss";

import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { Modal, ModalProps, Mode, Network } from "../WaterfallDefi";
import useAuth, { useEagerConnect } from "./hooks/useAuth";
import ConnectWalletModal from "./subcomponents/ConnectWalletModal";
import TransactionModal from "./subcomponents/TransactionModal";
// import { Dark } from "./svgs/dark"; remember to delete these
// import { Light } from "./svgs/light";
import RedepositModal from "./subcomponents/RedepositModal";
import ClaimModal from "./subcomponents/ClaimModal";
import { Market } from "../types";

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
        console.error("Failed to setup the network in Metamask:", error);
      } finally {
        success && setNetwork(network);
      }
    }
  } else {
    setNetwork(network);
  }
};

type Props = {
  mode: Mode;
  network: Network;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  modal: ModalProps;
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[] | undefined>>;
};

function Header(props: Props) {
  const { mode, network, setNetwork, modal, setModal, setMarkets } = props;

  const { active, account, chainId } = useWeb3React<Web3Provider>();

  const { login, logout } = useAuth(network);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    if (chainId && chainId.toString() !== Network[network]) {
      setNetwork(chainId);
    }
  }, [chainId, network, setNetwork]);

  useEagerConnect(network);

  return (
    <div className={"header-wrapper " + mode}>
      <div
        className={"mask" + (modal.state !== Modal.None ? " visible" : "")}
        onClick={() => setModal({ state: Modal.None })}
      />
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
          coingeckoPrices={modal.redepositProps.coingeckoPrices}
          setSelectedDepositAssetIndex={modal.redepositProps.setSelectedDepositAssetIndex}
          setSimulDeposit={modal.redepositProps.setSimulDeposit}
          setModal={modal.redepositProps.setModal}
          setMarkets={modal.redepositProps.setMarkets}
        />
      ) : null}
      {modal.state === Modal.Claim && modal.claimProps ? (
        <ClaimModal
          network={modal.claimProps.network}
          balance={modal.claimProps.balance}
          setModal={modal.claimProps.setModal}
          claimReward={modal.claimProps.claimReward}
        />
      ) : null}
      <div className="pc-left">
        <div className="waterfalldefi" />
        <div className="menu-block-wrapper">
          <Link className="link" to={"/"} data-selected={location.pathname === "/"}>
            Markets
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link className="link" to={"/portfolio"} data-selected={location.pathname === "/portfolio"}>
            My Portfolio
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <Link className="link" to={"/stake"} data-selected={location.pathname === "/stake"}>
            Stake
          </Link>
        </div>
        <div className="menu-block-wrapper">
          <a href="https://waterfall-defi.gitbook.io/waterfall-defi/resources/mainnet-user-guide">User Guide</a>
        </div>
        <div className="menu-block-wrapper">
          <Link className="link" to={"/blog"} data-selected={location.pathname === "/blog"}>
            Blog
          </Link>
        </div>
      </div>
      <div className="mobile-left"></div>
      <div className="right">
        <div className="wallet-wrapper">
          <div
            className={"dropdown" + (dropdownOpen ? " open" : "")}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className={"network" + (network === Network.AVAX ? " avax" : " bnb")}>
              <div className="dropdown-triangle">▼</div>
              {network === Network.AVAX ? "AVAX" : "BNB"}
            </div>
            {dropdownOpen ? (
              network === Network.AVAX ? (
                <div className="network bnb option" onClick={() => switchNetwork(account, Network.BNB, setNetwork)}>
                  BNB
                </div>
              ) : (
                <div className="network avax option" onClick={() => switchNetwork(account, Network.AVAX, setNetwork)}>
                  AVAX
                </div>
              )
            ) : null}
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
            <div className="connect-wallet-btn">
              <div>{formatAccountAddress(account)}</div>
            </div>
          )}
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
}

export default Header;
