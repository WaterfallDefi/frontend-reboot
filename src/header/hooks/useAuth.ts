import { useCallback, useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
import { Network } from "../../WaterfallDefi";

enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
}

const walletconnect = new WalletConnectConnector({
  rpc: {
    43114: "https://api.avax.network/ext/bc/C/rpc",
    42161: "https://arb1.arbitrum.io/rpc",
  },
  supportedChainIds: [43114, 42161],
  qrcode: true,
  bridge: "https://bridge.walletconnect.org",
});

const injected = new InjectedConnector({
  supportedChainIds: [43114, 42161],
});

const connectorsByName = {
  injected: injected,
  walletconnect: walletconnect,
};

const AVAXNodes = ["https://api.avax.network/ext/bc/C/rpc", "https://rpc.ankr.com/avalanche"];
const BNBNodes = [
  "https://bsc-dataseed.binance.org/",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.ninicoin.io/",
];
const PolygonNodes = ["https://polygon-rpc.com", "https://rpc-mainnet.matic.network", "https://rpc.ankr.com/polygon"];
const ArbitrumNodes = [
  "https://arb1.arbitrum.io/rpc",
  "https://arbitrum.blockpi.network/v1/rpc/public",
  "https://rpc.ankr.com/arbitrum",
];

export const setupNetwork = async (network: Network) => {
  const provider = window.ethereum;

  const chainNames = {
    43114: "Avalanche",
    42161: "Arbitrum",
  };

  const networkNames = {
    43114: "AVAX",
    42161: "Arbitrum",
  };

  const networkSymbols = {
    43114: "AVAX",
    42161: "AETH",
  };

  const rpcUrls = {
    43114: AVAXNodes,
    42161: ArbitrumNodes,
  };

  const blockExplorerUrls = {
    43114: ["https://snowtrace.io"],
    42161: ["https://arbiscan.io/"],
  };

  if (provider?.request) {
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${network.toString(16)}`,
            chainName: chainNames[network],
            nativeCurrency: {
              name: networkNames[network],
              symbol: networkSymbols[network],
              decimals: 18,
            },
            rpcUrls: rpcUrls[network],
            blockExplorerUrls: blockExplorerUrls[network],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined");
    return false;
  }
};

const useAuth = (network: Network) => {
  const { activate, deactivate } = useWeb3React();

  const login = useCallback(
    (connectorID: string) => {
      const connector = connectorID === "injected" ? connectorsByName.injected : connectorsByName.walletconnect;
      window.localStorage.setItem("connectorIdv2", connectorID);
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork(network);
            if (hasSetup) {
              activate(connector);
            }
          } else {
            if (error instanceof NoEthereumProviderError) {
              console.error(error);
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              console.log(error);
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = undefined;
              }
            } else {
              console.error(error);
            }
          }
        });
      } else {
        console.error("cannot connect");
      }
    },
    [activate, network]
  );

  const logout = useCallback(() => {
    deactivate();
    if (window.localStorage.getItem("walletconnect")) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = undefined;
      window.localStorage.removeItem("walletconnect");
    }
    window.localStorage.removeItem("connectorIdv2");
  }, [deactivate]);

  return { login, logout };
};

export const useEagerConnect = (network: Network) => {
  const { login } = useAuth(network);

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorIdv2") as ConnectorNames;
    if (connectorId) {
      login(connectorId);
    }
  }, [login]);
};

export default useAuth;
