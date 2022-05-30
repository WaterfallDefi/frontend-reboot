import { Metamask } from "../svgs/Metamask";
import { WalletConnect } from "../svgs/WalletConnect";

function ConnectWalletModal() {
  return (
    <div className="connect-wallet-modal">
      <title className="connect-wallet-title">Connect Wallet</title>
      <section className="connect-wallet-section">
        <div className="agreement">
          By connecting a wallet, you agree to{" "}
          <span className="terms">Terms of Service</span> and acknowledge that
          you have read and understand the{" "}
          <span className="pp">Privacy Policy</span>.
        </div>
        <div
          className="connect metamask"
          onClick={() => {
            //on connect
          }}
        >
          <div className="metamask">
            {!window.ethereum?.isMetaMask && (
              <span className="install">Install</span>
            )}
            <span className="label">Metamask</span>
          </div>
          <Metamask />
        </div>
        <div
          className="connect walletconnect"
          onClick={() => {
            //on connect
          }}
        >
          <div className="walletconnect">
            <span className="label">WalletConnect</span>
          </div>
          <WalletConnect />
        </div>
      </section>
    </div>
  );
}

export default ConnectWalletModal;
