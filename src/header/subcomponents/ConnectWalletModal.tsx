import { Metamask } from "../svgs/Metamask";
import { WalletConnect } from "../svgs/WalletConnect";
import { Network } from "../../WaterfallDefi";
import useAuth from "../hooks/useAuth";
import { useCallback } from "react";

type Props = {
  network: Network;
};

function ConnectWalletModal(props: Props) {
  const { network } = props;

  const { login } = useAuth(network);

  const onConnect = useCallback(async () => {
    if (window.ethereum?.isMetaMask && window.ethereum.request) {
      login("injected");
    } else {
      window.open("https://metamask.io/");
    }
  }, [login]);

  return (
    <div className="modal connect-wallet">
      <title className="modal-title">Connect Wallet</title>
      <section className="connect-wallet">
        <div className="agreement">
          By connecting a wallet, you agree to <span className="terms">Terms of Service</span> and acknowledge that you
          have read and understand the <span className="pp">Privacy Policy</span>.
        </div>
        <div className="connect metamask" onClick={onConnect}>
          <div className="metamask">
            {!window.ethereum?.isMetaMask && <span className="install">Install</span>}
            <span className="label">Metamask</span>
          </div>
          <Metamask />
        </div>
        <div
          className="connect walletconnect"
          onClick={() => {
            if (network === Network.AVAX) login("walletconnect");
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
