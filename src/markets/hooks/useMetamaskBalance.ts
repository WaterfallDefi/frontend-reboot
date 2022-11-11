import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useState } from "react";

const BIG_TEN = new BigNumber(10);

export const useMetamaskBalance = () => {
  const [result, setResult] = useState<any>();

  const { account } = useWeb3React();

  const provider = window.ethereum;

  //   const { fastRefresh } = useRefresh();

  const fetchBalance = useCallback(async () => {
    if (provider?.request) {
      try {
        const balance = await provider.request({
          method: "eth_getBalance",
          params: [account],
        });
        setResult(balance);
      } catch (e) {
        console.error(e);
      }
    }
  }, [provider, account]);

  useEffect(() => {
    if (account) fetchBalance();
  }, [account, fetchBalance]);

  return { balance: new BigNumber(result).dividedBy(BIG_TEN.pow(18)), fetchBalance };
};
